import { Dedalus } from "dedalus-labs";
import { getPineconeService } from "./PineconeService";

// Minimal chat turn type for in-memory state
export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

// What we return to the API layer
export type ChatResult = {
  answer: string;
  citations: Array<{
    title: string;
    snippet: string;
    score: number;
    chunkId?: string;
  }>;
};

export class ChatService {
  private dedalus: Dedalus;
  private model: string;

  // In-memory store: sessionId -> chat turns
  // Hackathon-friendly. Swap to Redis for multi-instance persistence.
  private historyBySession = new Map<string, ChatTurn[]>();

  // Tuning knobs
  private readonly maxTurnsToKeep = 10;
  private readonly topK = 6;
  private readonly maxContextChars = 9000; // helps avoid overly long prompt

  constructor(apiKey: string, model = "anthropic/claude-sonnet-4-5") {
    this.dedalus = new Dedalus({ apiKey });
    this.model = model;
  }

  /**
   * Primary entrypoint:
   * - Retrieves relevant excerpts from Pinecone for the question (scoped to policyId)
   * - Sends excerpts + short history + question to LLM
   * - Stores the turn in memory
   */
  async chat(sessionId: string, policyId: string, userMessage: string): Promise<ChatResult> {
    const pinecone = getPineconeService();
    if (!pinecone) {
      throw new Error("Pinecone is not initialized (set PINECONE_API_KEY and PINECONE_INDEX_NAME)");
    }

    // 1) Retrieve relevant excerpts (RAG)
    const matches = await pinecone.query(userMessage, this.topK, {
      policyId: { $eq: policyId },
    });

    const citations = (matches || []).map((m) => ({
      title: m.metadata?.title ?? m.metadata?.policyId ?? m.id,
      snippet: (m.text || "").slice(0, 350),
      score: m.score ?? 0,
      chunkId: m.id,
    }));

    // Build context block for the model
    let contextBlock = (matches || [])
      .map((m, i) => {
        const title = m.metadata?.title ?? m.metadata?.policyId ?? m.id;
        const score = (m.score ?? 0).toFixed(2);
        const text = (m.text || "").trim();
        return `Excerpt ${i + 1} (score ${score}) — ${title}\n${text}`;
      })
      .join("\n\n");

    // Truncate context if too long
    if (contextBlock.length > this.maxContextChars) {
      contextBlock = contextBlock.slice(0, this.maxContextChars) + "\n\n[Context truncated]";
    }

    // 2) Load history for this session and prune
    const history = this.historyBySession.get(sessionId) ?? [];
    const prunedHistory = this.pruneHistory(history);

    // 3) Compose messages for Dedalus
    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: this.getSystemPrompt() },

      // Evidence goes before the conversation so the model always sees it
      {
        role: "user",
        content:
          `You are answering questions about policyId="${policyId}".\n` +
          `Use ONLY the excerpts below as evidence.\n\n` +
          `EVIDENCE:\n${contextBlock}`,
      },

      // Prior conversation
      ...prunedHistory.map((t) => ({ role: t.role, content: t.content })),

      // New user question
      { role: "user", content: userMessage },
    ];

    // 4) Call the model
    const resp = await this.dedalus.chat.completions.create({
      model: this.model,
      messages,
      temperature: 0.2,
    });

    const answer = (resp.choices?.[0]?.message?.content ?? "").trim();

    // 5) Update memory
    const newHistory: ChatTurn[] = [
      ...prunedHistory,
      { role: "user", content: userMessage },
      { role: "assistant", content: answer || "The ballot text provided does not specify." },
    ];
    this.historyBySession.set(sessionId, this.pruneHistory(newHistory));

    return {
      answer: answer || "The ballot text provided does not specify.",
      citations,
    };
  }

  /** Clears a session manually (optional utility) */
  clearSession(sessionId: string) {
    this.historyBySession.delete(sessionId);
  }

  /** Optional: get raw history for debugging */
  getSessionHistory(sessionId: string): ChatTurn[] {
    return this.historyBySession.get(sessionId) ?? [];
  }

  private pruneHistory(turns: ChatTurn[]): ChatTurn[] {
    if (turns.length <= this.maxTurnsToKeep) return turns;
    return turns.slice(turns.length - this.maxTurnsToKeep);
  }

  private getSystemPrompt(): string {
    return `
You are a helpful, neutral assistant answering questions about a ballot measure or policy.

Rules:
- Use ONLY the provided excerpts as your source of truth.
- If the excerpts do not answer the question, reply: "The ballot text provided does not specify."
- Be non-partisan and factual.
- Do not introduce outside facts, laws, numbers, or jurisdictions not present in the excerpts.
- Keep answers concise (2-6 sentences), unless the user asks for more detail.

If helpful, you may quote short phrases from the excerpts, but do not fabricate quotes.
`.trim();
  }
}

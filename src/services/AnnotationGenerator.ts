import { Pinecone } from "@pinecone-database/pinecone";
import { Dedalus } from "dedalus-labs";
import type {
  UserProfile,
  Policy,
  Annotation,
  AnnotationResponse,
} from "../types/ballot";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

export interface AnnotationGeneratorConfig {
  pineconeApiKey: string;
  pineconeIndexName: string;
  dedalusApiKey: string;
  /** Defaults to "anthropic/claude-sonnet-4-5" */
  model?: string;
  /** Pinecone namespaces to search. Defaults to ["legislation", "legal-code"] */
  namespaces?: string[];
}

// ---------------------------------------------------------------------------
// Internal helpers / types
// ---------------------------------------------------------------------------

interface PineconeMatch {
  id: string;
  text: string;
  score: number;
  metadata: Record<string, any>;
}

/** Real citation metadata pulled from Pinecone — never LLM-generated. */
interface SourceInfo {
  index: number; // 1-based label shown to the LLM
  title: string;
  url: string;
}

// ---------------------------------------------------------------------------
// AnnotationGenerator
// ---------------------------------------------------------------------------

/**
 * Self-contained annotation generator that queries Pinecone for legislative
 * context and calls Dedalus (Claude) to produce per-policy annotations
 * mapped to the user's issues.
 *
 * Usage:
 * ```ts
 * const generator = new AnnotationGenerator({ pineconeApiKey, pineconeIndexName, dedalusApiKey });
 * const response = await generator.getAllAnnotations(userProfile, policies);
 * ```
 */
export class AnnotationGenerator {
  private readonly pc: Pinecone;
  private readonly indexName: string;
  private readonly dedalus: Dedalus;
  private readonly model: string;
  private readonly namespaces: string[];

  private static readonly EMBEDDING_MODEL = "llama-text-embed-v2";

  constructor(config: AnnotationGeneratorConfig) {
    this.pc = new Pinecone({ apiKey: config.pineconeApiKey });
    this.indexName = config.pineconeIndexName;
    this.dedalus = new Dedalus({ apiKey: config.dedalusApiKey });
    this.model = config.model ?? "anthropic/claude-sonnet-4-5";
    this.namespaces = config.namespaces ?? ["legislation", "legal-code"];
  }

  // -----------------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------------

  /**
   * Generate annotations for every policy in `policies`, personalised to
   * `userProfile`. Policies are processed **sequentially** so each one
   * gets unique Pinecone sources (already-used vector IDs are excluded
   * from subsequent queries).
   */
  async getAllAnnotations(
    userProfile: UserProfile,
    policies: Policy[]
  ): Promise<AnnotationResponse> {
    const response: AnnotationResponse = {};
    const usedVectorIds = new Set<string>();

    for (const policy of policies) {
      const annotations = await this.annotatePolicy(
        userProfile,
        policy,
        usedVectorIds
      );
      response[policy.id] = annotations;
    }

    return response;
  }

  // -----------------------------------------------------------------------
  // Per-policy pipeline
  // -----------------------------------------------------------------------

  private async annotatePolicy(
    userProfile: UserProfile,
    policy: Policy,
    usedVectorIds: Set<string>
  ): Promise<Annotation[]> {
    // 1. Retrieve context from Pinecone, excluding previously-used vectors
    const { contextText, sources, matchedVectorIds } =
      await this.retrieveContext(userProfile, policy, usedVectorIds);

    // Mark these vectors as used so later policies get fresh sources
    for (const id of matchedVectorIds) {
      usedVectorIds.add(id);
    }

    // 2. Call Dedalus to generate annotations, passing real sources for citation
    return this.generateAnnotations(userProfile, policy, contextText, sources);
  }

  // -----------------------------------------------------------------------
  // Pinecone retrieval
  // -----------------------------------------------------------------------

  private async embed(texts: string[]): Promise<number[][]> {
    const response = await this.pc.inference.embed({
      model: AnnotationGenerator.EMBEDDING_MODEL,
      inputs: texts,
      parameters: { inputType: "query", truncate: "END" },
    });
    return response.data.map((item: any) => item.values);
  }

  /**
   * Query Pinecone across all namespaces.
   * @param excludeIds  Vector IDs to skip (e.g. already used by earlier policies).
   *                    We over-fetch to compensate for filtered-out vectors.
   */
  private async queryPinecone(
    queryText: string,
    topK = 5,
    excludeIds: Set<string> = new Set()
  ): Promise<PineconeMatch[]> {
    // Over-fetch so we still have enough after filtering out excluded IDs
    const fetchK = topK + excludeIds.size + 5;

    const [embedding] = await this.embed([queryText]);
    const index = this.pc.index(this.indexName);

    const allMatches: PineconeMatch[] = [];

    for (const ns of this.namespaces) {
      const response = await index.query({
        vector: embedding,
        topK: fetchK,
        includeMetadata: true,
        ...(ns ? { namespace: ns } : {}),
      } as any);

      for (const match of response.matches ?? []) {
        const meta: any = match.metadata ?? {};
        allMatches.push({
          id: match.id,
          text: meta.text ?? "",
          score: match.score ?? 0,
          metadata: meta,
        });
      }
    }

    // Deduplicate by id, drop excluded vectors, sort by score, take topK
    const seen = new Set<string>();
    return allMatches
      .filter((m) => {
        if (excludeIds.has(m.id)) return false;
        if (seen.has(m.id)) return false;
        seen.add(m.id);
        return true;
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  /**
   * Retrieve legislative context from Pinecone for a single policy.
   *
   * The search query is built from the **policy text only** (title +
   * question) so that each policy gets semantically distinct results.
   * User keywords are NOT mixed into the embedding query — they're
   * already communicated to the LLM in the prompt.
   *
   * @param excludeIds  Vector IDs already used by earlier policies —
   *                    these are filtered out so each policy gets fresh sources.
   *
   * Returns the formatted context string, the real source metadata, and
   * the vector IDs that were selected (so the caller can track them).
   */
  private async retrieveContext(
    userProfile: UserProfile,
    policy: Policy,
    excludeIds: Set<string>
  ): Promise<{
    contextText: string;
    sources: SourceInfo[];
    matchedVectorIds: string[];
  }> {
    // Use the policy's own text as the query — this is what makes each
    // policy's retrieval unique. No user keywords in the embedding.
    const searchQuery = `${policy.title} ${policy.question}`;

    const matches = await this.queryPinecone(searchQuery, 5, excludeIds);

    // Collect the vector IDs we're using
    const matchedVectorIds = matches.map((m) => m.id);

    // Build numbered source list so the LLM can reference by index
    const sources: SourceInfo[] = matches.map((m, i) => ({
      index: i + 1,
      title: m.metadata?.title ?? m.id,
      url: m.metadata?.url ?? "",
    }));

    // Assemble context string with labelled sources
    let contextText = `**Policy: ${policy.title}**\n${policy.question}\n`;

    if (matches.length > 0) {
      contextText += "\n**Related Legislation (numbered sources):**\n";
      for (let i = 0; i < matches.length; i++) {
        const m = matches[i];
        const title = m.metadata?.title ?? m.id;
        const url = m.metadata?.url ?? "";
        contextText += `\n--- [Source ${i + 1}] ${title}${url ? ` (${url})` : ""} ---\n${m.text}\n`;
      }
    }

    return { contextText, sources, matchedVectorIds };
  }

  // -----------------------------------------------------------------------
  // Dedalus (Claude) annotation generation
  // -----------------------------------------------------------------------

  private buildSystemPrompt(userProfile: UserProfile): string {
    const issueList = Object.keys(userProfile.issues);

    return `You are a neutral, nonpartisan policy analyst. Your ONLY job is to return a JSON array.

You MUST return ONLY valid JSON—no markdown, no code fences, no extra text.

Use ONLY the provided policy text and retrieved legislative context. Do NOT use outside knowledge or invent facts/sources.

The user cares about these issues: ${issueList.join(", ")}.

YOUR OUTPUT must be a JSON array of annotation objects. Only produce an annotation for issues that have a genuine, meaningful connection to the policy — do NOT force annotations for issues that aren't relevant. Skip issues with no real connection.

You MUST always return at least one annotation. If none of the user's issues are strongly relevant, pick the single closest issue and provide a general-purpose annotation that explains what the policy does.

Each annotation object must have this exact structure:
{
  "issue": "the user issue this annotation connects to (must be one of the user's issues listed above)",
  "annotation": "1-3 SHORT sentences in plain, everyday language (no legal jargon). Explain what this means for the user in relation to this issue. Be direct and conversational.",
  "sourceIndices": [1, 3]
}

RULES:
- "issue" must exactly match one of the user's issues listed above.
- "annotation" must be grounded in the provided context. No speculation or outside facts.
- Keep annotations SHORT and in plain language. Avoid legal terms like "supplemented", "amended", "Home Rule Charter" — instead say what it actually does in simple words. Write as if explaining to a friend.
- "sourceIndices": a list of the [Source N] numbers from the retrieved context that support this annotation. Use ONLY the source numbers shown in the context. Do NOT fabricate any URLs or titles—just list the integer indices.
- You MUST return at least one annotation object. NEVER return an empty array.
- Return ONLY the JSON array.`;
  }

  private buildUserPrompt(
    userProfile: UserProfile,
    policy: Policy,
    context: string
  ): string {
    const parts: string[] = [];

    parts.push(context);

    parts.push(`\n**User Profile:**`);
    parts.push(`Age: ${userProfile.age}`);
    parts.push(`Zip Code: ${userProfile.zipCode}`);
    if (userProfile.aboutYou) {
      parts.push(`About: ${userProfile.aboutYou}`);
    }

    parts.push(`\nIssues and keywords:`);
    for (const [issue, keywords] of Object.entries(userProfile.issues)) {
      parts.push(`- ${issue}: ${keywords.join(", ")}`);
    }

    parts.push(
      `\nReturn a JSON array of annotations for policy "${policy.id}" based on the user's relevant issues.`
    );

    return parts.join("\n");
  }

  private async generateAnnotations(
    userProfile: UserProfile,
    policy: Policy,
    contextText: string,
    sources: SourceInfo[]
  ): Promise<Annotation[]> {
    const systemPrompt = this.buildSystemPrompt(userProfile);
    const userPrompt = this.buildUserPrompt(userProfile, policy, contextText);

    const response = await this.dedalus.chat.completions.create({
      model: this.model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
    });

    let content = (response as any).choices[0].message.content ?? "";
    content = content
      .replace(/^```(?:json)?\s*\n?/i, "")
      .replace(/\n?```\s*$/i, "");

    let parsed: any[];
    try {
      parsed = JSON.parse(content);
    } catch {
      console.error(
        `[AnnotationGenerator] Non-JSON response for ${policy.id}:`,
        content.slice(0, 500)
      );
      return [];
    }

    if (!Array.isArray(parsed)) {
      console.error(
        `[AnnotationGenerator] Expected array for ${policy.id}, got:`,
        typeof parsed
      );
      return [];
    }

    // Build a lookup from 1-based index → real source metadata
    const sourceByIndex = new Map<number, SourceInfo>();
    for (const s of sources) {
      sourceByIndex.set(s.index, s);
    }

    // Determine type from policy id prefix
    const type = this.inferType(policy.id);

    return parsed.map((item: any, idx: number) => {
      // Resolve sourceIndices → real citations from Pinecone metadata
      const indices: number[] = Array.isArray(item.sourceIndices)
        ? item.sourceIndices
        : [];

      const citations = indices
        .map((i: number) => sourceByIndex.get(i))
        .filter((s): s is SourceInfo => s != null && s.url !== "")
        .map((s) => ({ title: s.title, url: s.url }));

      return {
        id: `${policy.id}-ann-${idx}`,
        type,
        issues: [item.issue].filter(Boolean),
        annotation: item.annotation ?? "",
        citations,
      };
    });
  }

  private inferType(policyId: string): "policy" | "question" | "candidate" {
    if (policyId.startsWith("q")) return "question";
    if (policyId.startsWith("c")) return "candidate";
    return "policy";
  }
}

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Dedalus } from "dedalus-labs";
import RippleViz from "./RippleViz";
import { getActiveNodeIds } from "@/lib/rippleTags";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Lazy Dedalus singleton (uses the same VITE key as AnnotationGenerator)
// ---------------------------------------------------------------------------
let _dedalus: Dedalus | null = null;

function getDedalusClient(): Dedalus | null {
  if (_dedalus) return _dedalus;
  const apiKey = import.meta.env.VITE_DEDALUS_API_KEY ?? "";
  if (!apiKey) return null;
  _dedalus = new Dedalus({ apiKey });
  return _dedalus;
}

const MODEL = "anthropic/claude-sonnet-4-5";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatPanelProps {
  policyId: string;
  policyTitle: string;
  /** Ballot text + annotation to provide as LLM context */
  context?: string;
  initialPrompt?: string;
  /** Issue IDs the user selected during onboarding */
  selectedIssues: string[];
}

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------
function buildSystemPrompt(policyTitle: string, context: string): string {
  return `You are a helpful, non-partisan assistant answering questions about the following ballot measure.

BALLOT MEASURE: "${policyTitle}"

CONTEXT:
${context}

RULES:
- Use ONLY the context above as your source of truth.
- If the context does not answer the question, say: "The ballot text provided does not specify."
- Be concise — 2-5 sentences unless the user asks for more detail.
- Do NOT introduce outside facts, laws, or statistics not present in the context.
- Stay neutral and factual.`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function ChatPanel({
  policyId,
  policyTitle,
  context = "",
  initialPrompt = "",
  selectedIssues,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState(initialPrompt);
  const [isLoading, setIsLoading] = useState(false);

  // Ripple state
  const [triggerKey, setTriggerKey] = useState(0);
  const [activeNodeIds, setActiveNodeIds] = useState<string[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  // Reset when policy changes
  useEffect(() => {
    setMessages([]);
    setTriggerKey(0);
    setActiveNodeIds([]);
    setInput(initialPrompt);
  }, [policyId, initialPrompt]);

  // ---------------------------------------------------------------------------
  // Send — calls Dedalus directly (same pattern as AnnotationGenerator)
  // ---------------------------------------------------------------------------
  const send = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const dedalus = getDedalusClient();
      if (!dedalus) {
        throw new Error("VITE_DEDALUS_API_KEY is not set in your .env file.");
      }

      // Build messages array for the LLM
      const llmMessages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
        { role: "system", content: buildSystemPrompt(policyTitle, context) },
        // Include conversation history (keep last 10 turns to avoid token overflow)
        ...updatedMessages.slice(-10).map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ];

      const response = await dedalus.chat.completions.create({
        model: MODEL,
        messages: llmMessages,
        temperature: 0.2,
      });

      const answerText = ((response as any).choices?.[0]?.message?.content ?? "").trim();

      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: answerText || "The ballot text provided does not specify.",
      };
      setMessages((prev) => [...prev, assistantMsg]);

      // Trigger ripple — keyword-match on the answer
      const ids = getActiveNodeIds(answerText);
      setActiveNodeIds(ids);
      setTriggerKey((k) => k + 1);
    } catch (err: any) {
      const errMsg =
        err?.message?.includes("VITE_DEDALUS_API_KEY")
          ? err.message
          : "Something went wrong. Check the console for details.";
      console.error("[ChatPanel]", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errMsg },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Ripple visualization */}
      <div className="shrink-0 flex justify-center pt-2 pb-1 px-2">
        <RippleViz
          policyTitle={policyTitle}
          activeNodeIds={activeNodeIds}
          triggerKey={triggerKey}
          selectedNodeIds={selectedIssues}
        />
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto px-4 pb-2 space-y-2.5"
      >
        {messages.length === 0 && (
          <p className="text-xs text-muted-foreground text-center pt-4">
            Ask a question about this ballot item to see the ripple effect.
          </p>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "flex",
              msg.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={cn(
                "max-w-[85%] px-3 py-2 rounded-lg text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-muted text-foreground rounded-bl-sm",
              )}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted text-muted-foreground px-3 py-2 rounded-lg text-sm animate-pulse">
              Thinking…
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="shrink-0 flex items-center gap-2 border-t border-border px-4 py-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about this ballot item…"
          disabled={isLoading}
          className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-background placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="shrink-0 p-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-40 hover:opacity-90 transition-opacity"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

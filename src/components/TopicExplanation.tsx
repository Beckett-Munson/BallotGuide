import { useState } from "react";
import { ChevronDown, ExternalLink, BookOpen } from "lucide-react";
import type { TopicExplanation as TopicExplanationType } from "@/types/ballot";
import { cn } from "@/lib/utils";

interface TopicExplanationProps {
  topic: TopicExplanationType;
}

const topicIcons: Record<string, string> = {
  healthcare: "🏥",
  taxes: "💰",
  environment: "🌿",
  foreign_policy: "🌐",
  education: "📚",
  housing: "🏠",
};

export default function TopicExplanation({ topic }: TopicExplanationProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const icon = topicIcons[topic.topic] || "📋";

  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 md:p-6 flex items-center justify-between gap-4 text-left hover:bg-muted/50 transition-colors"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-lg font-display font-semibold text-foreground">
              {topic.title}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <BookOpen className="w-3 h-3" />
              {topic.citations.length} source{topic.citations.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-muted-foreground transition-transform duration-300 flex-shrink-0",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-500 ease-in-out",
          isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-5 pb-5 md:px-6 md:pb-6 border-t border-border pt-4 space-y-4">
          <p className="text-sm text-foreground/85 leading-relaxed">{topic.explanation}</p>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Sources
            </h4>
            <ul className="space-y-1.5">
              {topic.citations.map((cite, i) => (
                <li key={i}>
                  <a
                    href={cite.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-civic-blue hover:underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>
                      {cite.title}{" "}
                      <span className="text-muted-foreground">— {cite.source}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

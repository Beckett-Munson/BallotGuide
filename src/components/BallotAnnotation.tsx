import { useState } from "react";
import { ChevronDown, ExternalLink, MessageCircle } from "lucide-react";
import type { BallotItem as BallotItemType } from "@/types/ballot";
import { cn } from "@/lib/utils";

interface BallotAnnotationProps {
  item: BallotItemType;
  isActive: boolean;
}

export default function BallotAnnotation({ item, isActive }: BallotAnnotationProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={cn(
        "transition-all duration-300 rounded-lg border-l-4 p-4",
        isActive
          ? "border-l-accent bg-civic-gold-light/50 shadow-sm"
          : "border-l-border bg-transparent opacity-60"
      )}
    >
      <h4 className="text-xs font-semibold uppercase tracking-wider text-accent mb-1.5">
        What this means for you
      </h4>
      <p className="text-sm text-foreground/85 leading-relaxed mb-3">
        {item.annotation}
      </p>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1.5 text-xs font-semibold text-civic-blue hover:text-civic-blue/80 transition-colors"
      >
        <span>{isExpanded ? "Show less" : "Learn more"}</span>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 transition-transform duration-300",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-500 ease-in-out",
          isExpanded ? "max-h-[600px] opacity-100 mt-3" : "max-h-0 opacity-0"
        )}
      >
        <div className="space-y-3 pt-3 border-t border-border/50">
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Recent Coverage
            </h5>
            <p className="text-xs text-foreground/75 leading-relaxed">
              {item.expand.newsSummary}
            </p>
          </div>
          <ul className="space-y-1">
            {item.expand.citations.map((cite, i) => (
              <li key={i}>
                <a
                  href={cite.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-1.5 text-xs text-civic-blue hover:underline"
                >
                  <ExternalLink className="w-3 h-3 flex-shrink-0 mt-0.5" />
                  <span>
                    {cite.title}{" "}
                    <span className="text-muted-foreground">— {cite.source}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="p-2.5 bg-civic-blue-light/60 rounded border border-civic-blue/10">
            <div className="flex items-center gap-1.5 mb-1">
              <MessageCircle className="w-3 h-3 text-civic-blue" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-civic-blue">
                Ask a follow-up
              </span>
            </div>
            <p className="text-xs text-foreground/60 italic leading-relaxed">
              "{item.expand.chatbotPrompt}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

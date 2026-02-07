import { useState } from "react";
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import type { BallotItem as BallotItemType } from "@/types/ballot";
import { cn } from "@/lib/utils";
import { topicBackground, topicBorderColor, TOPIC_COLORS, hsl, hslAlpha } from "@/lib/topicColors";

interface BallotAnnotationProps {
  item: BallotItemType;
  isActive: boolean;
  /** When true, show only topic pills + title (e.g. desktop when row not hovered). */
  collapsed?: boolean;
  /** @deprecated no longer used */
  animateText?: boolean;
}

export default function BallotAnnotation({
  item,
  isActive,
  collapsed = false,
  animateText = false,
}: BallotAnnotationProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTopicIdx, setActiveTopicIdx] = useState(0);

  const hasTopicAnnotations =
    item.topicAnnotations && item.topicAnnotations.length > 0;

  // Determine which annotation text & citations to show
  const currentAnnotation = hasTopicAnnotations
    ? item.topicAnnotations![activeTopicIdx] ?? item.topicAnnotations![0]
    : null;

  const displayText = currentAnnotation?.text ?? item.annotation;
  const displayCitations = currentAnnotation?.citations ?? item.expand.citations;

  // Use the active topic for border color, or fall back to all topics
  const activeTopicId = currentAnnotation?.topic ?? item.relatedTopics[0];
  const activeBorderColor = activeTopicId
    ? topicBorderColor([activeTopicId])
    : topicBorderColor(item.relatedTopics);
  const activeBg = activeTopicId
    ? topicBackground([activeTopicId], 0.08)
    : topicBackground(item.relatedTopics, 0.08);
  const isGradient = activeBg.startsWith("linear-gradient");

  const hasCitations = displayCitations.length > 0;
  const isOpen = !collapsed;

  return (
    <div
      className={cn(
        "transition-all duration-700 ease-in-out rounded-lg border-l-4 overflow-hidden",
        isActive ? "shadow-sm" : "opacity-60",
        isOpen ? "p-4" : "p-2 px-3"
      )}
      style={{
        borderLeftColor: isActive ? activeBorderColor : undefined,
        background: isActive ? (isGradient ? activeBg : undefined) : "transparent",
        backgroundColor: isActive && !isGradient ? activeBg : undefined,
      }}
    >
      {/* Topic pills — always visible */}
      {item.relatedTopics.length > 0 && (
        <div className={cn("flex flex-wrap gap-1.5 transition-all duration-300", isOpen ? "mb-2" : "mb-1")}>
          {item.relatedTopics.map((topic) => {
            const color = TOPIC_COLORS[topic];
            const annotIdx = hasTopicAnnotations
              ? item.topicAnnotations!.findIndex((ta) => ta.topic === topic)
              : -1;
            const isSelected = hasTopicAnnotations && activeTopicIdx === annotIdx;
            const isClickable = annotIdx >= 0 && isOpen;

            return (
              <button
                key={topic}
                type="button"
                disabled={!isClickable}
                onClick={() => {
                  if (isClickable) setActiveTopicIdx(annotIdx);
                }}
                className={cn(
                  "px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full transition-all duration-200",
                  isClickable ? "cursor-pointer" : "cursor-default",
                  isSelected && isOpen && "ring-1"
                )}
                style={{
                  backgroundColor: color
                    ? hslAlpha(color, isSelected && isOpen ? 0.25 : 0.15)
                    : undefined,
                  color: color ? hsl(color) : undefined,
                  "--tw-ring-color": color ? hsl(color) : undefined,
                } as React.CSSProperties}
              >
                {topic.replace("_", " ")}
              </button>
            );
          })}
        </div>
      )}

      {/* Title — always visible */}
      <p className={cn(
        "font-semibold text-foreground leading-snug transition-all duration-300",
        isOpen ? "text-sm" : "text-sm truncate"
      )}>
        {item.title}
      </p>

      {/* Expandable body — height expands via grid rows, content fades in */}
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div
          className={cn(
            "overflow-hidden min-h-0 transition-opacity duration-[900ms] ease-in-out",
            isOpen ? "opacity-100 delay-200" : "opacity-0"
          )}
        >
          <h4
            className="text-xs font-semibold uppercase tracking-wider mb-1.5 mt-2"
            style={{ color: activeBorderColor }}
          >
            What this means for you
          </h4>
          <p className="text-sm text-foreground/85 leading-relaxed mb-3">
            {displayText}
          </p>

          {hasCitations && (
            <>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
                style={{ color: activeBorderColor }}
              >
                <span>{isExpanded ? "Hide sources" : "Show sources"}</span>
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 transition-transform duration-300",
                    isExpanded && "rotate-180"
                  )}
                />
              </button>

              <div
                className={cn(
                  "overflow-hidden transition-all duration-700 ease-in-out",
                  isExpanded ? "max-h-[400px] opacity-100 mt-3" : "max-h-0 opacity-0"
                )}
              >
                <ul className="space-y-1 pt-3 border-t border-border/50">
                  {displayCitations.map((cite, i) => (
                    <li key={i}>
                      <a
                        href={cite.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-1.5 text-xs hover:underline"
                        style={{ color: activeBorderColor }}
                      >
                        <ExternalLink className="w-3 h-3 flex-shrink-0 mt-0.5" />
                        <span>
                          {cite.title}
                          {"source" in cite && (cite as { source?: string }).source && (
                            <span className="text-muted-foreground"> — {(cite as { source: string }).source}</span>
                          )}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>

      {/* "Hover for details" hint — fades in when collapsed, fades out when open */}
      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-500 ease-in-out",
          isOpen ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"
        )}
      >
        <div className="overflow-hidden min-h-0">
          <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-0.5">
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            Hover for details
          </p>
        </div>
      </div>
    </div>
  );
}


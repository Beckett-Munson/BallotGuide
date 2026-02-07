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
}

export default function BallotAnnotation({ item, isActive, collapsed = false }: BallotAnnotationProps) {
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

  const borderColor = topicBorderColor(item.relatedTopics);
  const collapsedBg = topicBackground(item.relatedTopics, 0.08);
  const collapsedBgIsGradient = collapsedBg.startsWith("linear-gradient");

  if (collapsed) {
    return (
      <div
        className={cn(
          "transition-all duration-700 ease-in-out rounded-lg border-l-4 p-2 px-3 overflow-hidden",
          isActive ? "shadow-sm" : "opacity-60"
        )}
        style={{
          borderLeftColor: isActive ? borderColor : undefined,
          background: isActive ? (collapsedBgIsGradient ? collapsedBg : undefined) : "transparent",
          backgroundColor: isActive && !collapsedBgIsGradient ? collapsedBg : undefined,
        }}
      >
        {item.relatedTopics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-1">
            {item.relatedTopics.map((topic) => {
              const color = TOPIC_COLORS[topic];
              return (
                <span
                  key={topic}
                  className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full"
                  style={{
                    backgroundColor: color ? hslAlpha(color, 0.15) : undefined,
                    color: color ? hsl(color) : undefined,
                  }}
                >
                  {topic.replace("_", " ")}
                </span>
              );
            })}
          </div>
        )}
        <p className="text-sm font-semibold text-foreground leading-snug truncate">
          {item.title}
        </p>
        <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-0.5">
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          Hover for details
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "transition-all duration-700 ease-in-out rounded-lg border-l-4 p-4 overflow-hidden",
        isActive ? "shadow-sm" : "opacity-60"
      )}
      style={{
        borderLeftColor: isActive ? activeBorderColor : undefined,
        background: isActive ? (isGradient ? activeBg : undefined) : "transparent",
        backgroundColor: isActive && !isGradient ? activeBg : undefined,
      }}
    >
      {/* Topic pills — clickable when multiple annotations exist */}
      {item.relatedTopics.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {item.relatedTopics.map((topic, idx) => {
            const color = TOPIC_COLORS[topic];
            // Find which topicAnnotation index this topic maps to
            const annotIdx = hasTopicAnnotations
              ? item.topicAnnotations!.findIndex((ta) => ta.topic === topic)
              : -1;
            const isSelected = hasTopicAnnotations && activeTopicIdx === annotIdx;
            const isClickable = annotIdx >= 0;

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
                  isSelected && "ring-1"
                )}
                style={{
                  backgroundColor: color
                    ? hslAlpha(color, isSelected ? 0.25 : 0.15)
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

      <h4
        className="text-xs font-semibold uppercase tracking-wider mb-1.5"
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
  );
}

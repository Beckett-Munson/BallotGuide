import { useState } from "react";
import { ChevronRight, ExternalLink } from "lucide-react";
import type { Candidate } from "@/types/ballot";
import { cn } from "@/lib/utils";
import { TOPIC_COLORS, PARTY_COLORS, hsl, hslAlpha } from "@/lib/topicColors";

const PARTY_LABELS: Record<string, string> = {
  D: "Democrat",
  R: "Republican",
  I: "Independent",
  L: "Liberal",
};

interface CandidateCardProps {
  candidate: Candidate;
  userTopics: string[];
  isActive: boolean;
  /** When true, show only avatar + name + party (e.g. desktop when row not hovered). */
  collapsed?: boolean;
  /** When true, text types in word-by-word. */
  animateText?: boolean;
}

export default function CandidateCard({
  candidate,
  userTopics,
  isActive,
  collapsed = false,
  animateText = false,
}: CandidateCardProps) {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const partyColor = PARTY_COLORS[candidate.party] ?? { h: 220, s: 15, l: 35 };
  const initials = candidate.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  // Filter to topics the user selected AND the candidate has blurbs for
  const availableTabs = userTopics.filter(
    (t) => candidate.topicBlurbs[t]
  );

  const activeBlurb = activeTab ? candidate.topicBlurbs[activeTab] : null;
  const displayText = activeBlurb ? activeBlurb.text : candidate.bio;
  const activeCitations = activeBlurb?.citations ?? [];

  const isOpen = !collapsed;

  return (
    <div
      className={cn(
        "rounded-lg border-l-4 transition-all duration-700 ease-in-out overflow-hidden",
        isActive ? "shadow-sm" : "opacity-60",
        isOpen ? "p-3.5" : "p-2 px-3"
      )}
      style={{
        borderLeftColor: isActive ? hsl(partyColor) : undefined,
        backgroundColor: isActive ? hslAlpha(partyColor, 0.06) : "transparent",
      }}
    >
      {/* Header: Avatar + Name — always visible */}
      <div className={cn("flex items-center transition-all duration-300", isOpen ? "gap-2.5 mb-2" : "gap-2")}>
        <div
          className={cn(
            "rounded-full flex items-center justify-center font-bold flex-shrink-0 transition-all duration-300",
            isOpen ? "w-9 h-9 text-xs" : "w-7 h-7 text-[10px]"
          )}
          style={{
            backgroundColor: hslAlpha(partyColor, 0.15),
            color: hsl(partyColor),
          }}
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className={cn(
            "font-semibold font-display text-foreground leading-tight truncate transition-all duration-300",
            isOpen ? "text-sm" : "text-xs"
          )}>
            {candidate.name}
          </h4>
          <div className="flex items-center gap-1.5">
            <span
              className="text-[9px] font-bold uppercase tracking-wider"
              style={{ color: hsl(partyColor) }}
            >
              {PARTY_LABELS[candidate.party]}
            </span>
            {candidate.isIncumbent && isOpen && (
              <span className="text-[8px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                Incumbent
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Expandable body — bio/blurb + citations + topic tabs */}
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
          {/* Bio / Topic blurb */}
          <p
            className={cn(
              "text-xs leading-relaxed min-h-[3rem]",
              activeTab ? "text-foreground/90" : "text-foreground/70"
            )}
          >
            {displayText}
          </p>

          {/* Citations */}
          {activeCitations.length > 0 && (
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
              {activeCitations.map((cite, i) => (
                <a
                  key={i}
                  href={cite.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 text-[9px] text-accent/80 hover:text-accent transition-colors truncate max-w-full"
                  title={cite.title}
                >
                  <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                  <span className="truncate">{cite.title.length > 50 ? cite.title.slice(0, 50) + "…" : cite.title}</span>
                </a>
              ))}
            </div>
          )}

          {/* Topic tabs */}
          {availableTabs.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2.5 pt-2 border-t border-border/40">
              {availableTabs.map((topic) => {
                const color = TOPIC_COLORS[topic];
                const isTabActive = activeTab === topic;
                return (
                  <button
                    key={topic}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab(isTabActive ? null : topic);
                    }}
                    className={cn(
                      "px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full transition-all duration-200 cursor-pointer",
                      isTabActive ? "shadow-sm" : "hover:opacity-80"
                    )}
                    style={{
                      backgroundColor: color
                        ? hslAlpha(color, isTabActive ? 0.2 : 0.08)
                        : undefined,
                      color: color ? hsl(color) : undefined,
                      border: `1px solid ${
                        color
                          ? hslAlpha(color, isTabActive ? 0.5 : 0.15)
                          : "transparent"
                      }`,
                    }}
                  >
                    {topic.replace("_", " ")}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* "Hover for details" hint — fades in when collapsed */}
      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-500 ease-in-out",
          isOpen ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"
        )}
      >
        <div className="overflow-hidden min-h-0">
          <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-0.5">
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            Hover for details
          </p>
        </div>
      </div>
    </div>
  );
}


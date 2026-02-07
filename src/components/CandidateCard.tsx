import { useState } from "react";
import type { Candidate } from "@/types/ballot";
import { cn } from "@/lib/utils";
import { TOPIC_COLORS, hsl, hslAlpha } from "@/lib/topicColors";

const PARTY_COLORS = {
  D: { h: 215, s: 60, l: 45 },
  R: { h: 0, s: 55, l: 48 },
  I: { h: 270, s: 45, l: 50 },
  L: { h: 280, s: 40, l: 55 },
};

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
}

export default function CandidateCard({
  candidate,
  userTopics,
  isActive,
}: CandidateCardProps) {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const partyColor = PARTY_COLORS[candidate.party];
  const initials = candidate.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  // Filter to topics the user selected AND the candidate has blurbs for
  const availableTabs = userTopics.filter(
    (t) => candidate.topicBlurbs[t]
  );

  const displayText = activeTab && candidate.topicBlurbs[activeTab]
    ? candidate.topicBlurbs[activeTab]
    : candidate.bio;

  return (
    <div
      className={cn(
        "rounded-lg border-l-4 p-3.5 transition-all duration-300",
        isActive ? "shadow-sm" : "opacity-60"
      )}
      style={{
        borderLeftColor: isActive ? hsl(partyColor) : undefined,
        backgroundColor: isActive ? hslAlpha(partyColor, 0.06) : "transparent",
      }}
    >
      {/* Header: Avatar + Name */}
      <div className="flex items-center gap-2.5 mb-2">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{
            backgroundColor: hslAlpha(partyColor, 0.15),
            color: hsl(partyColor),
          }}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold font-display text-foreground leading-tight truncate">
            {candidate.name}
          </h4>
          <div className="flex items-center gap-1.5">
            <span
              className="text-[9px] font-bold uppercase tracking-wider"
              style={{ color: hsl(partyColor) }}
            >
              {PARTY_LABELS[candidate.party]}
            </span>
            {candidate.isIncumbent && (
              <span className="text-[8px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                Incumbent
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bio / Topic blurb */}
      <p
        className={cn(
          "text-xs leading-relaxed transition-all duration-200 min-h-[3rem]",
          activeTab ? "text-foreground/90" : "text-foreground/70"
        )}
      >
        {displayText}
      </p>

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
  );
}

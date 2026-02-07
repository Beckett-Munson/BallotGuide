import type { BallotItem } from "@/types/ballot";
import CandidateCard from "@/components/CandidateCard";

interface RaceMobileListProps {
  items: BallotItem[];
  hoveredIndex: number | null;
  onToggleIndex: (index: number) => void;
  userTopics: string[];
}

export default function RaceMobileList({
  items,
  hoveredIndex,
  onToggleIndex,
  userTopics,
}: RaceMobileListProps) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const candidates = item.candidates || [];
        const isOpen = hoveredIndex === index;

        return (
          <div key={item.id} className="space-y-0">
            <button
              className="w-full text-left px-4 py-3 bg-card border border-border rounded-t-lg"
              onClick={() => onToggleIndex(index)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div
                    className={`w-4 h-3 rounded-[50%] border-[1.5px] flex items-center justify-center transition-all ${
                      isOpen
                        ? "border-foreground/70 bg-foreground/70"
                        : "border-foreground/25"
                    }`}
                  >
                    {isOpen && (
                      <svg className="w-2 h-1.5 text-card" viewBox="0 0 12 10" fill="none">
                        <path d="M1 5L4 8L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Elected Office
                  </p>
                  <h3 className="font-display text-sm font-semibold text-foreground leading-snug">
                    {item.title}
                  </h3>
                  {candidates.length >= 2 && !isOpen && (
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {candidates.map((c) => c.name).join(" vs ")}
                    </p>
                  )}
                </div>
              </div>
            </button>
            {isOpen && candidates.length >= 2 && (
              <div className="border border-t-0 border-border rounded-b-lg overflow-hidden animate-fade-in p-3 bg-card space-y-3">
                <CandidateCard
                  candidate={candidates[0]}
                  userTopics={userTopics}
                  isActive={true}
                />
                <div className="flex items-center gap-3 px-2">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">vs</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <CandidateCard
                  candidate={candidates[1]}
                  userTopics={userTopics}
                  isActive={true}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

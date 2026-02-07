import { cn } from "@/lib/utils";
import type { BallotItem } from "@/types/ballot";
import { topicBorderColor } from "@/lib/topicColors";

interface BallotPaperProps {
  items: BallotItem[];
  activeIndex: number | null;
  onItemClick: (index: number) => void;
  onItemHover: (index: number | null) => void;
  sectionTitle?: string;
  sectionSubtitle?: string;
}

export default function BallotPaper({
  items,
  activeIndex,
  onItemClick,
  onItemHover,
  sectionTitle = "Official Sample Ballot",
  sectionSubtitle = "City of Pittsburgh • Primary Election — May 20, 2025",
}: BallotPaperProps) {
  const hasHover = activeIndex !== null;

  return (
    <div className="relative">
      {/* Stacked paper effect */}
      <div className="absolute inset-0 bg-card rounded-none shadow-lg transform rotate-[0.4deg] translate-x-1 translate-y-1 -z-10 border border-border/40" />
      <div className="absolute inset-0 bg-card rounded-none shadow-md transform -rotate-[0.3deg] translate-x-0.5 translate-y-0.5 -z-20 opacity-50 border border-border/30" />

      <div className="bg-card rounded-none shadow-xl border-2 border-foreground/20 overflow-hidden">
        {/* Top decorative border */}
        <div className="h-2 bg-primary" />

        {/* Ballot header */}
        <div className="px-6 py-5 md:px-10 md:py-6 text-center border-b-2 border-foreground/15">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-px bg-foreground/20" />
            <p className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground font-semibold">
              Commonwealth of Pennsylvania
            </p>
            <div className="w-12 h-px bg-foreground/20" />
          </div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground tracking-tight">
            {sectionTitle}
          </h2>
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1 font-medium">
            {sectionSubtitle}
          </p>
        </div>

        {/* Instructions */}
        <div className="px-6 py-2.5 md:px-10 bg-muted/40 border-b border-foreground/10 text-[11px] text-muted-foreground flex items-center justify-center gap-2">
          <span className="inline-block w-3.5 h-3.5 rounded-full border-[1.5px] border-foreground/30 flex-shrink-0" />
          <span className="uppercase tracking-wider font-medium">
            To vote, fill in the oval completely
          </span>
          <span className="inline-block w-3.5 h-3.5 rounded-full bg-foreground/70 flex-shrink-0" />
        </div>

        {/* Ballot items */}
        <div>
          {items.map((item, index) => {
            const dotColorStr = topicBorderColor(item.relatedTopics);
            const isActive = activeIndex === index;

            return (
              <button
                key={item.id}
                data-ballot-item={index}
                className={cn(
                  "w-full text-left px-6 py-4 md:px-10 md:py-5 transition-all duration-300 group cursor-pointer border-b border-foreground/8",
                  isActive
                    ? "bg-accent/8"
                    : hasHover
                      ? "opacity-40"
                      : "hover:bg-muted/30"
                )}
                onClick={() => onItemClick(index)}
                onMouseEnter={() => onItemHover(index)}
                onMouseLeave={() => onItemHover(null)}
              >
                <div className="flex items-start gap-3">
                  {/* Ballot oval */}
                  <div className="flex-shrink-0 mt-1">
                    <div
                      className={cn(
                        "w-5 h-[14px] rounded-[50%] border-[1.5px] transition-all duration-200 flex items-center justify-center",
                        isActive
                          ? "border-foreground/70 bg-foreground/70"
                          : "border-foreground/30 bg-transparent group-hover:border-foreground/50"
                      )}
                    >
                      {isActive && (
                        <svg className="w-2.5 h-2 text-card" viewBox="0 0 12 10" fill="none">
                          <path d="M1 5L4 8L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: dotColorStr }} />
                      <span className="text-[9px] uppercase tracking-[0.15em] font-bold text-muted-foreground">
                        {item.category === "office" ? "Elected Office" : item.category}
                      </span>
                    </div>
                    <h3
                      className={cn(
                        "font-display text-sm md:text-base font-semibold leading-snug transition-colors",
                        isActive ? "text-foreground" : "text-foreground/75"
                      )}
                    >
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                      {item.officialText}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Ballot footer */}
        <div className="px-6 py-3 md:px-10 border-t-2 border-foreground/15 bg-muted/30">
          <div className="flex items-center justify-between text-[9px] text-muted-foreground/50 uppercase tracking-[0.2em] font-semibold">
            <span>Sample — Not for Official Use</span>
            <span>Page 1 of 1</span>
          </div>
        </div>

        {/* Bottom decorative border */}
        <div className="h-2 bg-primary" />
      </div>
    </div>
  );
}

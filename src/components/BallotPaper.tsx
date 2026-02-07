import { cn } from "@/lib/utils";
import type { BallotItem } from "@/types/ballot";

interface BallotPaperProps {
  items: BallotItem[];
  activeIndex: number | null;
  onItemHover: (index: number | null) => void;
  onItemClick: (index: number) => void;
}

const categoryColors: Record<string, string> = {
  healthcare: "bg-civic-green",
  taxes: "bg-accent",
  environment: "bg-civic-blue",
  office: "bg-civic-slate",
  transit: "bg-civic-blue",
};

export default function BallotPaper({
  items,
  activeIndex,
  onItemHover,
  onItemClick,
}: BallotPaperProps) {
  return (
    <div className="relative">
      {/* Paper effect */}
      <div className="absolute inset-0 bg-card rounded-sm shadow-lg transform rotate-[0.3deg] -z-10" />
      <div className="absolute inset-0 bg-card rounded-sm shadow-md transform -rotate-[0.2deg] translate-x-0.5 -z-20 opacity-60" />

      <div className="bg-card rounded-sm shadow-xl border border-border/60 overflow-hidden">
        {/* Ballot header */}
        <div className="bg-primary px-6 py-5 md:px-8 md:py-6 text-center border-b-4 border-accent">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary-foreground/50 mb-1">
            Commonwealth of Pennsylvania
          </p>
          <h2 className="font-display text-xl md:text-2xl font-bold text-primary-foreground tracking-tight">
            Official Sample Ballot
          </h2>
          <p className="text-xs text-primary-foreground/60 mt-1">
            Allegheny County • General Election 2026
          </p>
        </div>

        {/* Instructions bar */}
        <div className="px-6 py-3 md:px-8 bg-muted/50 border-b border-border text-xs text-muted-foreground flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded-full border-2 border-foreground/30 flex-shrink-0" />
          <span>
            Click any item to see a personalized explanation →
          </span>
        </div>

        {/* Ballot items */}
        <div className="divide-y divide-border">
          {items.map((item, index) => {
            const dotColor = categoryColors[item.category] || "bg-civic-slate";
            const isActive = activeIndex === index;

            return (
              <button
                key={item.id}
                className={cn(
                  "w-full text-left px-6 py-4 md:px-8 md:py-5 transition-all duration-200 group cursor-pointer",
                  isActive
                    ? "bg-civic-gold-light/40"
                    : "hover:bg-muted/30"
                )}
                onMouseEnter={() => onItemHover(index)}
                onMouseLeave={() => onItemHover(activeIndex)}
                onClick={() => onItemClick(index)}
              >
                <div className="flex items-start gap-3">
                  {/* Ballot oval */}
                  <div className="flex-shrink-0 mt-1">
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center",
                        isActive
                          ? "border-accent bg-accent"
                          : "border-foreground/25 bg-transparent group-hover:border-accent/50"
                      )}
                    >
                      {isActive && (
                        <svg className="w-3 h-3 text-card" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={cn("w-2 h-2 rounded-full flex-shrink-0", dotColor)} />
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                        {item.category === "office" ? "Elected Office" : item.category}
                      </span>
                    </div>
                    <h3
                      className={cn(
                        "font-display text-base md:text-lg font-semibold leading-snug transition-colors",
                        isActive ? "text-foreground" : "text-foreground/80"
                      )}
                    >
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                      {item.officialText}
                    </p>
                  </div>

                  {/* Active indicator */}
                  <div
                    className={cn(
                      "hidden md:flex items-center transition-opacity duration-200",
                      isActive ? "opacity-100" : "opacity-0"
                    )}
                  >
                    <div className="w-8 h-px bg-accent" />
                    <div className="w-2 h-2 rounded-full bg-accent" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Ballot footer */}
        <div className="px-6 py-4 md:px-8 bg-muted/30 border-t border-border">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground/60 uppercase tracking-wider">
            <span>Sample — Not for Official Use</span>
            <span>Page 1 of 1</span>
          </div>
        </div>
      </div>
    </div>
  );
}

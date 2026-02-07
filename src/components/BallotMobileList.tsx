import type { BallotItem } from "@/types/ballot";
import BallotAnnotation from "@/components/BallotAnnotation";

interface BallotMobileListProps {
  items: BallotItem[];
  hoveredIndex: number | null;
  onToggleIndex: (index: number) => void;
}

export default function BallotMobileList({
  items,
  hoveredIndex,
  onToggleIndex,
}: BallotMobileListProps) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={item.id} className="space-y-0">
          <button
            className="w-full text-left px-4 py-3 bg-card border border-border rounded-t-lg"
            onClick={() => onToggleIndex(index)}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div
                  className={`w-4 h-3 rounded-[50%] border-[1.5px] flex items-center justify-center transition-all ${
                    hoveredIndex === index
                      ? "border-foreground/70 bg-foreground/70"
                      : "border-foreground/25"
                  }`}
                >
                  {hoveredIndex === index && (
                    <svg className="w-2 h-1.5 text-card" viewBox="0 0 12 10" fill="none">
                      <path d="M1 5L4 8L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  {item.category === "office" ? "Elected Office" : item.category}
                </p>
                <h3 className="font-display text-sm font-semibold text-foreground leading-snug">
                  {item.title}
                </h3>
              </div>
            </div>
          </button>
          {hoveredIndex === index && (
            <div className="border border-t-0 border-border rounded-b-lg overflow-hidden animate-fade-in">
              <BallotAnnotation item={item} isActive={true} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

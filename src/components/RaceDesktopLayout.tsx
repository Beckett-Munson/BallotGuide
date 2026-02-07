import type { BallotItem } from "@/types/ballot";
import { cn } from "@/lib/utils";
import { partyBorderColor } from "@/lib/topicColors";
import CandidateCard from "@/components/CandidateCard";

interface RaceDesktopLayoutProps {
  items: BallotItem[];
  hoveredIndex: number | null;
  onHoverIndex: (index: number | null) => void;
  userTopics: string[];
  /** Measured vertical center (px) of each ballot item relative to the container. */
  itemPositions?: number[];
}

export default function RaceDesktopLayout({
  items,
  hoveredIndex,
  onHoverIndex,
  userTopics,
  itemPositions,
}: RaceDesktopLayoutProps) {
  return (
    <>
      {items.map((item, index) => {
        const candidates = item.candidates || [];
        if (candidates.length < 2) return null;

        const isHighlighted = hoveredIndex === index;
        const hasSomeHover = hoveredIndex !== null;
        const topValue =
          itemPositions && itemPositions[index] != null
            ? `${itemPositions[index]}px`
            : `${((index + 0.5) / items.length) * 100}%`;
        const leftColor = partyBorderColor(candidates[0].party);
        const rightColor = partyBorderColor(candidates[1].party);

        return (
          <div key={`race-annotations-${item.id}`}>
            {/* Left candidate (candidate 0) — blue dot */}
            <div
              className={cn(
                "absolute transition-all duration-700 ease-in-out",
                hasSomeHover && !isHighlighted
                  ? "opacity-20 scale-[0.97]"
                  : "opacity-100 scale-100",
                isHighlighted && "z-10"
              )}
              style={{
                top: topValue,
                right: "calc(100% + 24px)",
                transform: `translateY(-50%) ${hasSomeHover && !isHighlighted ? "scale(0.97)" : "scale(1)"}`,
                width: "280px",
              }}
              onMouseEnter={() => onHoverIndex(index)}
              onMouseLeave={() => onHoverIndex(null)}
            >
              {/* Connector line — dot centered on ballot boundary */}
              <div
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 transition-opacity duration-700 ease-in-out",
                  hasSomeHover && !isHighlighted ? "opacity-20" : "opacity-100"
                )}
                style={{ left: "100%", width: "24px" }}
              >
                <div className="w-full h-px" style={{ backgroundColor: leftColor + "80" }} />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full right-0 translate-x-1/2"
                  style={{ backgroundColor: leftColor }}
                />
              </div>
              <CandidateCard
                candidate={candidates[0]}
                userTopics={userTopics}
                isActive={isHighlighted || !hasSomeHover}
                collapsed={!isHighlighted}
              />
            </div>

            {/* Right candidate (candidate 1) — red dot */}
            <div
              className={cn(
                "absolute transition-all duration-700 ease-in-out",
                hasSomeHover && !isHighlighted
                  ? "opacity-20 scale-[0.97]"
                  : "opacity-100 scale-100",
                isHighlighted && "z-10"
              )}
              style={{
                top: topValue,
                left: "calc(100% + 24px)",
                transform: `translateY(-50%) ${hasSomeHover && !isHighlighted ? "scale(0.97)" : "scale(1)"}`,
                width: "280px",
              }}
              onMouseEnter={() => onHoverIndex(index)}
              onMouseLeave={() => onHoverIndex(null)}
            >
              {/* Connector line — dot centered on ballot boundary */}
              <div
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 transition-opacity duration-700 ease-in-out",
                  hasSomeHover && !isHighlighted ? "opacity-20" : "opacity-100"
                )}
                style={{ right: "100%", width: "24px" }}
              >
                <div className="w-full h-px" style={{ backgroundColor: rightColor + "80" }} />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full left-0 -translate-x-1/2"
                  style={{ backgroundColor: rightColor }}
                />
              </div>
              <CandidateCard
                candidate={candidates[1]}
                userTopics={userTopics}
                isActive={isHighlighted || !hasSomeHover}
                collapsed={!isHighlighted}
              />
            </div>
          </div>
        );
      })}
    </>
  );
}

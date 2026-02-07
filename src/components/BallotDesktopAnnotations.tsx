import type { BallotItem } from "@/types/ballot";
import type { ItemPosition } from "@/hooks/useBallotItemPositions";
import { cn } from "@/lib/utils";
import { topicBorderColor } from "@/lib/topicColors";
import BallotAnnotation from "@/components/BallotAnnotation";

interface BallotDesktopAnnotationsProps {
  items: BallotItem[];
  hoveredIndex: number | null;
  onHoverIndex: (index: number | null) => void;
  positions: ItemPosition[];
}

export default function BallotDesktopAnnotations({
  items,
  hoveredIndex,
  onHoverIndex,
  positions,
}: BallotDesktopAnnotationsProps) {
  return (
    <>
      {items.map((item, index) => {
        const pos = positions[index];
        if (!pos) return null;

        const isLeft = index % 2 === 0;
        const isHighlighted = hoveredIndex === index;
        const hasSomeHover = hoveredIndex !== null;

        return (
          <div
            key={`annotation-${item.id}`}
            className={cn(
              "absolute transition-all duration-300",
              hasSomeHover && !isHighlighted
                ? "opacity-20 scale-[0.97]"
                : "opacity-100 scale-100",
              isHighlighted && "z-10"
            )}
            style={{
              top: `${pos.centerY}px`,
              ...(isLeft
                ? { right: "calc(100% + 24px)", transform: `translateY(-50%) ${hasSomeHover && !isHighlighted ? "scale(0.97)" : "scale(1)"}` }
                : { left: "calc(100% + 24px)", transform: `translateY(-50%) ${hasSomeHover && !isHighlighted ? "scale(0.97)" : "scale(1)"}` }),
              width: "280px",
            }}
            onMouseEnter={() => onHoverIndex(index)}
            onMouseLeave={() => onHoverIndex(null)}
          >
            {/* Connector line */}
            <div
              className={cn(
                "absolute top-1/2 -translate-y-1/2 transition-opacity duration-300",
                hasSomeHover && !isHighlighted ? "opacity-20" : "opacity-100"
              )}
              style={
                isLeft
                  ? { left: "100%", width: "24px" }
                  : { right: "100%", width: "24px" }
              }
            >
              <div
                className="w-full h-px"
                style={{ backgroundColor: topicBorderColor(item.relatedTopics) + "80" }}
              />
              <div
                className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${
                  isLeft ? "right-0" : "left-0"
                }`}
                style={{ backgroundColor: topicBorderColor(item.relatedTopics) }}
              />
            </div>
            <BallotAnnotation item={item} isActive={isHighlighted || !hasSomeHover} />
          </div>
        );
      })}
    </>
  );
}

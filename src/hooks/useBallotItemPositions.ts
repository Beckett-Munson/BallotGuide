import { useCallback, useEffect, useRef, useState } from "react";

export interface ItemPosition {
  top: number;
  centerY: number;
  height: number;
}

/**
 * Measures the vertical center of each ballot item relative to the ballot container.
 * Returns pixel-based positions for annotation alignment.
 */
export function useBallotItemPositions(itemCount: number) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const [positions, setPositions] = useState<ItemPosition[]>([]);

  const setItemRef = useCallback(
    (index: number) => (el: HTMLElement | null) => {
      itemRefs.current[index] = el;
    },
    []
  );

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const newPositions: ItemPosition[] = [];

    for (let i = 0; i < itemCount; i++) {
      const el = itemRefs.current[i];
      if (el) {
        const rect = el.getBoundingClientRect();
        const top = rect.top - containerRect.top;
        newPositions.push({
          top,
          centerY: top + rect.height / 2,
          height: rect.height,
        });
      }
    }

    setPositions(newPositions);
  }, [itemCount]);

  useEffect(() => {
    measure();

    const observer = new ResizeObserver(() => measure());
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [measure]);

  return { containerRef, setItemRef, positions, measure };
}

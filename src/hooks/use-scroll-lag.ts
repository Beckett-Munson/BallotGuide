import { useEffect, useState } from "react";

/**
 * Returns a vertical offset that lags behind scroll for a "suspended" effect.
 * When you scroll down, the offset is negative (element trails upward); when you scroll up, it trails downward.
 * @param smoothness 0–1; lower = more lag (slower catch-up)
 * @param strength multiplier for how far the element lags (pixels of visual lag)
 */
export function useScrollLag(smoothness = 0.07, strength = 0.4) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let rafId: number;
    let smoothed = typeof window !== "undefined" ? window.scrollY : 0;

    const tick = () => {
      const scrollY = window.scrollY;
      smoothed += (scrollY - smoothed) * smoothness;
      const lag = (smoothed - scrollY) * strength;
      setOffset(lag);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [smoothness, strength]);

  return offset;
}

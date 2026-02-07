import { useEffect, useState, useMemo } from "react";

/**
 * Gradually reveals `text` word-by-word when `enabled` flips to true.
 * Returns { visibleCount, words } so the caller can render the full text
 * (keeping layout stable) while only making typed words visible.
 *
 * @param text         Full string to type out
 * @param enabled      Start typing when true; reset when false
 * @param intervalMs   Delay between each batch of words (default 30ms)
 * @param wordsPerTick How many words to reveal each tick (default 2)
 */
export function useTypewriter(
  text: string,
  enabled: boolean,
  intervalMs = 30,
  wordsPerTick = 2,
) {
  const words = useMemo(() => text.split(" "), [text]);
  const [visibleCount, setVisibleCount] = useState(enabled ? words.length : 0);

  useEffect(() => {
    if (!enabled) {
      setVisibleCount(0);
      return;
    }

    // Reset and start typing
    setVisibleCount(0);
    let count = 0;

    const timer = setInterval(() => {
      count += wordsPerTick;
      if (count >= words.length) {
        count = words.length;
        clearInterval(timer);
      }
      setVisibleCount(count);
    }, intervalMs);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, enabled]);

  return { visibleCount, words, done: visibleCount >= words.length };
}

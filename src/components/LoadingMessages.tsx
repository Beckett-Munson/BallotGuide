import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const MESSAGES = [
  "Loading ballot questions…",
  "Finding your races…",
  "Personalizing by your topics…",
  "Pulling in sources…",
  "Almost ready…",
];

const FADE_DURATION_MS = 300;
const INTERVAL_MS = 4000;

export default function LoadingMessages() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const cycle = () => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % MESSAGES.length);
        setVisible(true);
      }, FADE_DURATION_MS);
    };
    const timer = setInterval(cycle, INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-[2rem] flex items-center justify-center px-4">
      <span
        className={cn(
          "text-sm text-muted-foreground/80 font-body transition-opacity duration-300",
          visible ? "opacity-100" : "opacity-0"
        )}
      >
        {MESSAGES[index]}
      </span>
    </div>
  );
}

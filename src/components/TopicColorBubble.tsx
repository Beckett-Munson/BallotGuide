import { useMemo } from "react";
import { TOPIC_COLORS, hsl, hslAlpha } from "@/lib/topicColors";

interface TopicColorBubbleProps {
  topicIds: string[];
}

export default function TopicColorBubble({ topicIds }: TopicColorBubbleProps) {
  const colors = useMemo(
    () => topicIds.map((id) => TOPIC_COLORS[id]).filter(Boolean),
    [topicIds]
  );

  const hasColors = colors.length > 0;

  // Build a conic-gradient with evenly distributed color stops
  const conicGradient = useMemo(() => {
    if (colors.length === 0) return "none";
    if (colors.length === 1) {
      return `radial-gradient(circle, ${hsl(colors[0])}, ${hslAlpha(colors[0], 0.6)})`;
    }
    const stops = colors.map((c, i) => {
      const start = (i / colors.length) * 360;
      const end = ((i + 1) / colors.length) * 360;
      return `${hsl(c)} ${start}deg ${end}deg`;
    });
    return `conic-gradient(from 0deg, ${stops.join(", ")})`;
  }, [colors]);

  // Secondary radial overlays for organic feel
  const radialOverlays = useMemo(() => {
    if (colors.length < 2) return [];
    return colors.map((c, i) => {
      const angle = (i / colors.length) * 360;
      const x = 50 + 25 * Math.cos((angle * Math.PI) / 180);
      const y = 50 + 25 * Math.sin((angle * Math.PI) / 180);
      return {
        background: `radial-gradient(circle at ${x}% ${y}%, ${hslAlpha(c, 0.8)} 0%, transparent 60%)`,
        animationDuration: `${4 + i * 1.5}s`,
      };
    });
  }, [colors]);

  return (
    <div className="flex items-center justify-center mt-8">
      <div
        className="relative w-16 h-16 rounded-full border-2 transition-all duration-700 ease-out overflow-hidden"
        style={{
          borderColor: hasColors
            ? hslAlpha(colors[0], 0.5)
            : "hsl(var(--border))",
          boxShadow: hasColors
            ? `0 0 24px 4px ${hslAlpha(colors[0], 0.3)}`
            : "none",
        }}
      >
        {hasColors && (
          <>
            {/* Base spinning conic gradient */}
            <div
              className="absolute inset-[-20%] rounded-full animate-[spin_8s_linear_infinite]"
              style={{
                background: conicGradient,
                filter: "blur(6px)",
              }}
            />

            {/* Radial overlays that pulse and counter-rotate for organic mixing */}
            {radialOverlays.map((overlay, i) => (
              <div
                key={i}
                className="absolute inset-[-10%] rounded-full"
                style={{
                  background: overlay.background,
                  animation: `spin ${overlay.animationDuration} linear infinite reverse, pulse-opacity ${overlay.animationDuration} ease-in-out infinite`,
                  filter: "blur(4px)",
                }}
              />
            ))}

            {/* Soft glow center for depth */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle at 40% 40%, rgba(255,255,255,0.25) 0%, transparent 60%)`,
              }}
            />
          </>
        )}
      </div>
      <span className="ml-3 text-sm text-muted-foreground">
        {topicIds.length === 0
          ? "Select topics to see your blend"
          : `${topicIds.length} topic${topicIds.length > 1 ? "s" : ""} selected`}
      </span>
    </div>
  );
}

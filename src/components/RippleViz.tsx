import { useMemo } from "react";
import { TOPIC_COLORS, hsl, hslAlpha } from "@/lib/topicColors";
import { pickDisplayNodes, getDerivedImpact, type IssueNode } from "@/lib/rippleTags";

// ---------------------------------------------------------------------------
// Layout constants (SVG user-space units)
// ---------------------------------------------------------------------------
const SIZE = 360;
const CX = SIZE / 2;
const CY = SIZE / 2;
const NODE_RING_R = 118;
const NODE_CIRCLE_R = 26;
const RIPPLE_MAX_R = 150;
const MAX_NODES = 10;

// ---------------------------------------------------------------------------
// CSS keyframes (injected once via <style>)
// ---------------------------------------------------------------------------
const KEYFRAMES = `
@keyframes rv-ripple {
  0%   { transform: scale(0); opacity: 0.35; }
  100% { transform: scale(1); opacity: 0;    }
}
@keyframes rv-node-pop {
  0%   { transform: scale(1);    }
  45%  { transform: scale(1.12); }
  100% { transform: scale(1.04); }
}
@keyframes rv-center-pulse {
  0%   { transform: scale(1);    opacity: 0.9; }
  50%  { transform: scale(1.06); opacity: 1;   }
  100% { transform: scale(1);    opacity: 0.9; }
}
`;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
interface RippleVizProps {
  policyTitle: string;
  activeNodeIds: string[];
  triggerKey: number;
  selectedNodeIds?: string[];
}

export default function RippleViz({
  policyTitle,
  activeNodeIds,
  triggerKey,
  selectedNodeIds = [],
}: RippleVizProps) {
  const displayNodes = useMemo(
    () => pickDisplayNodes(activeNodeIds, selectedNodeIds, MAX_NODES),
    [activeNodeIds, selectedNodeIds],
  );

  const derivedImpact = useMemo(
    () => getDerivedImpact(activeNodeIds),
    [activeNodeIds],
  );

  const nodeCount = displayNodes.length;
  const triggered = triggerKey > 0;

  return (
    <div
      className="mx-auto select-none"
      style={{ width: "100%", maxWidth: SIZE, aspectRatio: "1 / 1" }}
    >
      <style>{KEYFRAMES}</style>

      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width="100%"
        height="100%"
        aria-label={`Ripple visualization for ${policyTitle}`}
      >
        {/* ---- glow filter ---- */}
        <defs>
          <filter id="rv-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ---- subtle background circle ---- */}
        <circle
          cx={CX}
          cy={CY}
          r={RIPPLE_MAX_R + 20}
          fill="hsl(var(--muted) / 0.35)"
          stroke="hsl(var(--border))"
          strokeWidth={0.75}
        />

        {/* ---- ripple rings (re-keyed on triggerKey to restart) ---- */}
        {triggered &&
          [0, 1, 2].map((i) => (
            <circle
              key={`ripple-${triggerKey}-${i}`}
              cx={CX}
              cy={CY}
              r={RIPPLE_MAX_R}
              fill="none"
              stroke="hsl(var(--accent))"
              strokeWidth={1.5}
              style={{
                transformOrigin: `${CX}px ${CY}px`,
                animation: `rv-ripple 1.2s ease-out ${i * 250}ms forwards`,
              }}
            />
          ))}

        {/* ---- center text ---- */}
        <foreignObject
          x={CX - 65}
          y={CY - 28}
          width={130}
          height={56}
          style={
            triggered
              ? { transformOrigin: `${CX}px ${CY}px`, animation: "rv-center-pulse 0.6s ease-out" }
              : undefined
          }
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              textAlign: "center",
              lineHeight: 1.3,
              padding: "0 2px",
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "hsl(var(--foreground))",
                fontFamily: "var(--font-display, 'Playfair Display', Georgia, serif)",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {policyTitle}
            </span>
            {derivedImpact && (
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 500,
                  color: "hsl(var(--accent))",
                  marginTop: 2,
                }}
              >
                Derived: {derivedImpact}
              </span>
            )}
          </div>
        </foreignObject>

        {/* ---- node ring ---- */}
        {displayNodes.map((node, i) => (
          <NodeDot
            key={node.id}
            node={node}
            index={i}
            total={nodeCount}
            isActive={activeNodeIds.includes(node.id)}
            isSelected={selectedNodeIds.includes(node.id)}
            triggered={triggered}
            triggerKey={triggerKey}
          />
        ))}
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Individual node
// ---------------------------------------------------------------------------
interface NodeDotProps {
  node: IssueNode;
  index: number;
  total: number;
  isActive: boolean;
  isSelected: boolean;
  triggered: boolean;
  triggerKey: number;
}

function NodeDot({ node, index, total, isActive, isSelected, triggered, triggerKey }: NodeDotProps) {
  const angle = (2 * Math.PI * index) / total - Math.PI / 2;
  const nx = CX + NODE_RING_R * Math.cos(angle);
  const ny = CY + NODE_RING_R * Math.sin(angle);
  const color = TOPIC_COLORS[node.id];

  const fillAlpha = isActive ? 0.22 : 0.08;
  const strokeAlpha = isActive ? 0.8 : isSelected ? 0.45 : 0.18;
  const strokeW = isActive ? 2 : 1;
  const baseOpacity = isActive ? 1 : isSelected ? 0.88 : 0.62;

  const popStyle: React.CSSProperties | undefined =
    isActive && triggered
      ? {
          transformOrigin: `${nx}px ${ny}px`,
          animation: `rv-node-pop 0.55s ease-out 350ms both`,
        }
      : { transformOrigin: `${nx}px ${ny}px` };

  return (
    <g
      key={`${node.id}-${triggerKey}`}
      style={popStyle}
      opacity={baseOpacity}
      filter={isActive && triggered ? "url(#rv-glow)" : undefined}
    >
      <title>{node.tooltip}</title>

      {/* background circle */}
      <circle
        cx={nx}
        cy={ny}
        r={NODE_CIRCLE_R}
        fill={color ? hslAlpha(color, fillAlpha) : `hsla(220,15%,35%,${fillAlpha})`}
        stroke={color ? hslAlpha(color, strokeAlpha) : "transparent"}
        strokeWidth={strokeW}
      />

      {/* emoji */}
      <text
        x={nx}
        y={ny - 4}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={17}
        style={{ pointerEvents: "none" }}
      >
        {node.emoji}
      </text>

      {/* label */}
      <text
        x={nx}
        y={ny + 14}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={7.5}
        fontWeight={isActive ? 700 : 400}
        fill={color ? hsl(color) : "hsl(var(--foreground))"}
        style={{ pointerEvents: "none" }}
      >
        {node.label}
      </text>
    </g>
  );
}

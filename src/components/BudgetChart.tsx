import { useState, useCallback } from "react";
import { PieChart, Pie, Cell, Sector, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import oconnorBudget from "../../scripts/output-oconnor-budget.json";
import morenoBudget from "../../scripts/output-moreno-budget.json";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const TOTAL_BUDGET = 1_054_610_722;

interface BudgetSlice {
  id: string;
  label: string;
  percentage: number;
  color: string;
  description: string;
}

const BASE_SLICES: BudgetSlice[] = [
  {
    id: "health_welfare",
    label: "Health & Welfare",
    percentage: 38.6,
    color: "#e57373",
    description:
      "Funds public health programs, mental health services, substance abuse treatment, child welfare, and social assistance programs across Allegheny County. This is the largest share of the county budget.",
  },
  {
    id: "public_safety",
    label: "Public Safety",
    percentage: 29.56,
    color: "#5c6bc0",
    description:
      "Covers the county police department, 911 emergency center, district attorney's office, courts, county jail, and emergency management services.",
  },
  {
    id: "general_government",
    label: "General Government",
    percentage: 8.59,
    color: "#78909c",
    description:
      "Supports county administration, elected officials' offices, human resources, IT systems, legal services, and day-to-day government operations.",
  },
  {
    id: "debt_service",
    label: "Debt Service",
    percentage: 7.05,
    color: "#ab47bc",
    description:
      "Pays interest and principal on county bonds used to finance capital projects like infrastructure upgrades, new facilities, and major equipment purchases.",
  },
  {
    id: "public_works",
    label: "Public Works & Facilities",
    percentage: 5.59,
    color: "#26a69a",
    description:
      "Maintains county buildings, parks, roads and bridges under county jurisdiction, and funds public infrastructure repair and improvement projects.",
  },
  {
    id: "transportation",
    label: "Transportation",
    percentage: 4.53,
    color: "#42a5f5",
    description:
      "Funds the county's contribution to Port Authority transit operations, paratransit services for residents with disabilities, and county road maintenance.",
  },
  {
    id: "education",
    label: "Education",
    percentage: 3.03,
    color: "#66bb6a",
    description:
      "Supports the Community College of Allegheny County (CCAC), the county library system, and educational outreach and workforce development programs.",
  },
  {
    id: "culture_recreation",
    label: "Culture & Recreation",
    percentage: 2.75,
    color: "#ffa726",
    description:
      "Funds county parks, recreational facilities, trail systems, cultural institutions, and community programs that serve residents across the county.",
  },
  {
    id: "economic_development",
    label: "Economic Development",
    percentage: 0.3,
    color: "#ffca28",
    description:
      "Supports business attraction incentives, workforce development grants, small business assistance, and economic revitalization initiatives in underserved areas.",
  },
];

const CATEGORY_ID_BY_LABEL = Object.fromEntries(
  BASE_SLICES.map((slice) => [slice.label, slice.id]),
);

// ---------------------------------------------------------------------------
// Mayor-projected budget adjustments
// ---------------------------------------------------------------------------

interface BudgetCitation {
  title: string;
  url: string;
}

interface BudgetSourceCategory {
  category: string;
  text: string;
  projectedChange: string;
  citations: BudgetCitation[];
}

interface BudgetSource {
  candidate: string;
  categories: BudgetSourceCategory[];
}

interface BudgetAdjustment {
  percentage: number;
  projectedChange: string;
  text: string;
  citations: BudgetCitation[];
}

interface MayorBudget {
  id: string;
  name: string;
  party: "D" | "R";
  summary: string;
  adjustments: Record<string, BudgetAdjustment>;
}

function parseProjectedChange(value: string): number {
  if (!value) return 0;
  const parsed = Number.parseFloat(value.replace("%", ""));
  return Number.isNaN(parsed) ? 0 : parsed;
}

function buildAdjustments(source: BudgetSource) {
  return source.categories.reduce<Record<string, BudgetAdjustment>>((acc, entry) => {
    const id = CATEGORY_ID_BY_LABEL[entry.category];
    if (!id) return acc;
    const base = BASE_SLICES.find((slice) => slice.id === id)?.percentage ?? 0;
    const delta = parseProjectedChange(entry.projectedChange);
    acc[id] = {
      percentage: base + delta,
      projectedChange: entry.projectedChange,
      text: entry.text,
      citations: entry.citations ?? [],
    };
    return acc;
  }, {});
}

const MAYORS: MayorBudget[] = [
  {
    id: "oconnor",
    name: "Corey O'Connor",
    party: "D",
    summary:
      "Prioritizes social services, transit investment, and downtown revitalization while moderating public safety spending toward prevention programs.",
    adjustments: buildAdjustments(oconnorBudget as BudgetSource),
  },
  {
    id: "moreno",
    name: "Tony Moreno",
    party: "R",
    summary:
      "Emphasizes law enforcement expansion and fiscal discipline, cutting administrative overhead and redirecting savings toward public safety and roads.",
    adjustments: buildAdjustments(morenoBudget as BudgetSource),
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDollars(amount: number): string {
  if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(2)}B`;
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  return `$${amount.toLocaleString()}`;
}

function getChartData(mayor: MayorBudget | null) {
  return BASE_SLICES.map((slice) => {
    const adjustment = mayor ? mayor.adjustments[slice.id] : undefined;
    const pct = adjustment?.percentage ?? slice.percentage;
    return {
      ...slice,
      percentage: pct,
      value: pct, // recharts uses this for sizing
      amount: Math.round((pct / 100) * TOTAL_BUDGET),
      mayorText: adjustment?.text ?? "",
      projectedChange: adjustment?.projectedChange ?? "",
      citations: adjustment?.citations ?? [],
    };
  });
}

// ---------------------------------------------------------------------------
// Recharts active shape renderer
// ---------------------------------------------------------------------------

function renderActiveShape(props: any) {
  const {
    cx, cy, innerRadius, outerRadius,
    startAngle, endAngle, fill, payload,
  } = props;

  return (
    <g>
      {/* Expanded slice */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 2}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      {/* Outer accent ring */}
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 12}
        outerRadius={outerRadius + 15}
        fill={fill}
      />
      {/* Center text */}
      <text
        x={cx}
        y={cy - 14}
        textAnchor="middle"
        fill="hsl(var(--foreground))"
        fontSize={13}
        fontWeight={700}
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        {payload.label}
      </text>
      <text x={cx} y={cy + 6} textAnchor="middle" fill="hsl(var(--foreground))" fontSize={20} fontWeight={800}>
        {payload.percentage.toFixed(1)}%
      </text>
      <text x={cx} y={cy + 24} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize={11}>
        {formatDollars(payload.amount)}
      </text>
    </g>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function BudgetChart() {
  const [selectedMayor, setSelectedMayor] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [pinnedIndex, setPinnedIndex] = useState<number | null>(null);

  const mayor = MAYORS.find((m) => m.id === selectedMayor) ?? null;
  const data = getChartData(mayor);

  const handleMayorToggle = useCallback((id: string) => {
    setSelectedMayor((prev) => (prev === id ? null : id));
    setActiveIndex(null);
  }, []);

  const onPieEnter = useCallback((_: any, index: number) => {
    setActiveIndex(index);
  }, []);

  const displayIndex = pinnedIndex ?? activeIndex;
  const activeSlice = displayIndex !== null ? data[displayIndex] : null;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <h3 className="font-display text-lg font-semibold text-foreground">
          Allegheny County Budget — {mayor ? `${mayor.name}'s Projected Changes` : "2024 Actual"}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Total: {formatDollars(TOTAL_BUDGET)}
          {mayor && (
            <span className="ml-2 text-accent font-semibold">
              Showing projected reallocation under {mayor.name}
            </span>
          )}
        </p>
      </div>

      {/* Main layout */}
      <div className="flex flex-col md:flex-row">
        {/* Left: Pie chart */}
        <div className="flex-1 min-w-0 px-2 pb-2">
          <div style={{ width: "100%", height: 340 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius="42%"
                  outerRadius="72%"
                  paddingAngle={1.5}
                  activeIndex={activeIndex ?? undefined}
                  activeShape={renderActiveShape}
                  onMouseEnter={onPieEnter}
                  onMouseLeave={() => {
                    if (pinnedIndex === null) {
                      setActiveIndex(null);
                    }
                  }}
                  onClick={(_, idx) =>
                    setPinnedIndex((prev) => {
                      const next = prev === idx ? null : idx;
                      setActiveIndex(next);
                      return next;
                    })
                  }
                  isAnimationActive
                  animationDuration={600}
                  animationEasing="ease-in-out"
                >
                  {data.map((entry) => (
                    <Cell
                      key={entry.id}
                      fill={entry.color}
                      stroke="hsl(var(--card))"
                      strokeWidth={2}
                      style={{ cursor: "pointer", outline: "none" }}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Compact legend */}
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 px-4 pb-3">
            {data.map((entry, idx) => (
              <button
                key={entry.id}
                onClick={() =>
                  setPinnedIndex((prev) => {
                    const next = prev === idx ? null : idx;
                    setActiveIndex(next);
                    return next;
                  })
                }
                className={cn(
                  "flex items-center gap-1.5 text-[11px] transition-opacity",
                  displayIndex !== null && displayIndex !== idx ? "opacity-40" : "opacity-100",
                )}
              >
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-foreground/80">{entry.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Mayor toggles + detail */}
        <div className="md:w-[320px] shrink-0 border-t md:border-t-0 md:border-l border-border px-5 py-4 flex flex-col gap-4">
          {/* Mayor toggles */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              How would each mayor change this?
            </p>
            <div className="flex flex-col gap-2">
              {MAYORS.map((m) => {
                const isActive = selectedMayor === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => handleMayorToggle(m.id)}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-2.5 rounded-lg border-2 text-left transition-all duration-200",
                      isActive
                        ? "shadow-sm"
                        : "border-border bg-background hover:border-muted-foreground/30",
                    )}
                    style={
                      isActive
                        ? {
                            borderColor: m.party === "D" ? "#5c6bc0" : "#e57373",
                            backgroundColor: m.party === "D" ? "rgba(92,107,192,0.08)" : "rgba(229,115,115,0.08)",
                          }
                        : undefined
                    }
                  >
                    <span
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0",
                        m.party === "D" ? "bg-[#5c6bc0]" : "bg-[#e57373]",
                      )}
                    >
                      {m.party}
                    </span>
                    <div className="min-w-0">
                      <span className="block text-sm font-semibold text-foreground leading-tight">
                        {m.name}
                      </span>
                      <span className="block text-[11px] text-muted-foreground leading-tight mt-0.5 truncate">
                        {isActive ? "Click again to reset to 2024" : m.party === "D" ? "Democrat" : "Republican"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            {mayor && (
              <p className="text-xs text-muted-foreground leading-relaxed mt-2.5">
                {mayor.summary}
              </p>
            )}
          </div>

          {/* Selected slice detail */}
          <div className="flex-1 min-h-0">
            {activeSlice ? (
              <div className="animate-fade-in">
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: activeSlice.color }}
                  />
                  <h4 className="font-display text-sm font-semibold text-foreground leading-tight">
                    {activeSlice.label}
                  </h4>
                </div>

                {/* Percentage + change */}
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-xl font-bold text-foreground">
                    {activeSlice.percentage.toFixed(1)}%
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatDollars(activeSlice.amount)}
                  </span>
                  {mayor && activeSlice.projectedChange && (() => {
                    const isUp = activeSlice.projectedChange.startsWith("+");
                    const isDown = activeSlice.projectedChange.startsWith("-");
                    return (
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          isUp ? "text-green-600" : isDown ? "text-red-500" : "text-muted-foreground",
                        )}
                      >
                        {activeSlice.projectedChange}
                      </span>
                    );
                  })()}
                </div>

                <p className="text-xs text-foreground/80 leading-relaxed">
                  {mayor && activeSlice.mayorText ? activeSlice.mayorText : activeSlice.description}
                </p>

                {mayor && activeSlice.citations.length > 0 && (
                  <ul className="mt-2 space-y-1.5">
                    {activeSlice.citations.map((citation) => (
                      <li key={citation.url}>
                        <a
                          href={citation.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-accent font-medium hover:underline"
                        >
                          {citation.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground/60 pt-2">
                Click or hover a chart slice to see details.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

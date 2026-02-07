import { cn } from "@/lib/utils";

export type BallotTab = "questions" | "races";

interface BallotTabBarProps {
  activeTab: BallotTab;
  onTabChange: (tab: BallotTab) => void;
}

const TABS: { id: BallotTab; label: string; sublabel: string }[] = [
  { id: "questions", label: "Special Election Questions", sublabel: "City of Pittsburgh" },
  { id: "races", label: "Active Races", sublabel: "Allegheny County" },
];

export default function BallotTabBar({ activeTab, onTabChange }: BallotTabBarProps) {
  return (
    <div className="flex rounded-lg border-2 border-border bg-card overflow-hidden shadow-sm">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex-1 px-4 py-3 text-center transition-all duration-300 relative",
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:bg-muted/50"
            )}
          >
            <span className="block font-display text-sm font-semibold leading-tight">
              {tab.label}
            </span>
            <span
              className={cn(
                "block text-[10px] uppercase tracking-wider mt-0.5",
                isActive ? "text-primary-foreground/70" : "text-muted-foreground/60"
              )}
            >
              {tab.sublabel}
            </span>
          </button>
        );
      })}
    </div>
  );
}

import { cn } from "@/lib/utils";

export type BallotSection = "races" | "questions";

interface BallotSectionTabsProps {
  active: BallotSection;
  onChange: (section: BallotSection) => void;
}

const TABS: { id: BallotSection; label: string; sublabel: string }[] = [
  { id: "races", label: "Active Races", sublabel: "General Election" },
  { id: "questions", label: "Special Election", sublabel: "Ballot Questions" },
];

export default function BallotSectionTabs({ active, onChange }: BallotSectionTabsProps) {
  return (
    <div className="flex bg-muted/60 rounded-lg p-1 border border-border gap-1">
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex-1 px-4 py-2.5 rounded-md text-center transition-all duration-200 relative",
              isActive
                ? "bg-card shadow-sm border border-border/50"
                : "hover:bg-card/50"
            )}
          >
            <span
              className={cn(
                "block text-sm font-semibold font-display transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {tab.label}
            </span>
            <span
              className={cn(
                "block text-[10px] uppercase tracking-wider transition-colors",
                isActive ? "text-accent" : "text-muted-foreground/60"
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

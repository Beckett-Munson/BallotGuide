import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Vote, ArrowLeft, BookOpen } from "lucide-react";
import type { UserProfile, PersonalizedBallot } from "@/types/ballot";
import { generatePersonalizedBallot } from "@/data/mockBallotData";
import BallotTabBar, { type BallotTab } from "@/components/BallotTabBar";
import BallotDesktopSection from "@/components/BallotDesktopSection";
import BallotMobileSection from "@/components/BallotMobileSection";
import TopicExplanation from "@/components/TopicExplanation";
import { TOPIC_COLORS, hsl, hslAlpha } from "@/lib/topicColors";

export default function Ballot() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [ballot, setBallot] = useState<PersonalizedBallot | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<BallotTab>("questions");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayedTab, setDisplayedTab] = useState<BallotTab>("questions");
  const prevTabRef = useRef<BallotTab>("questions");

  useEffect(() => {
    const stored = sessionStorage.getItem("voterProfile");
    if (!stored) {
      navigate("/");
      return;
    }
    const parsed: UserProfile = JSON.parse(stored);
    setProfile(parsed);
    setBallot(generatePersonalizedBallot(parsed));
  }, [navigate]);

  const handleTabChange = (newTab: BallotTab) => {
    if (newTab === activeTab || isTransitioning) return;
    prevTabRef.current = activeTab;
    setActiveTab(newTab);
    setIsTransitioning(true);
    setHoveredIndex(null);

    // After exit animation, swap content and play enter animation
    setTimeout(() => {
      setDisplayedTab(newTab);
      // Small delay to let the new content mount before animating in
      requestAnimationFrame(() => {
        setIsTransitioning(false);
      });
    }, 350);
  };

  if (!ballot || !profile) return null;

  // Determine scroll direction: questions→races = scroll up, races→questions = scroll down
  const goingUp = activeTab === "races";
  const exitDirection = goingUp ? "-translate-y-8" : "translate-y-8";
  const enterDirection = goingUp ? "translate-y-8" : "-translate-y-8";

  const currentItems = displayedTab === "questions" ? ballot.ballotItems : ballot.raceItems;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <nav className="sticky top-0 z-50 bg-primary/95 backdrop-blur-sm border-b border-primary-foreground/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Vote className="w-5 h-5 text-accent" />
            <span className="font-display text-lg font-bold text-primary-foreground">
              BallotGuide
            </span>
          </div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Start over
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Greeting */}
        <header className="mb-8 md:mb-12 text-center max-w-3xl mx-auto">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2 leading-tight">
            {ballot.greeting}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            {ballot.personalizedSummary}
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {profile.topics.map((t) => {
              const color = TOPIC_COLORS[t];
              return (
                <span
                  key={t}
                  className="px-3 py-1 text-xs font-semibold rounded-full capitalize"
                  style={{
                    backgroundColor: color ? hslAlpha(color, 0.15) : undefined,
                    color: color ? hsl(color) : undefined,
                    border: `1px solid ${color ? hslAlpha(color, 0.3) : "transparent"}`,
                  }}
                >
                  {t.replace("_", " ")}
                </span>
              );
            })}
          </div>
        </header>

        {/* Tab Bar */}
        <div className="max-w-[520px] mx-auto mb-8">
          <BallotTabBar activeTab={activeTab} onTabChange={handleTabChange} />
        </div>

        {/* Animated ballot content */}
        <div className="overflow-hidden">
          <div
            className="transition-all duration-350 ease-in-out"
            style={{
              transform: isTransitioning ? `translateY(${exitDirection === "-translate-y-8" ? "-2rem" : "2rem"})` : "translateY(0)",
              opacity: isTransitioning ? 0 : 1,
              transitionDuration: "350ms",
            }}
          >
            {/* Desktop */}
            <section className="mb-16 hidden md:block">
              <BallotDesktopSection
                items={currentItems}
                hoveredIndex={hoveredIndex}
                onHoverChange={setHoveredIndex}
              />
            </section>

            {/* Mobile */}
            <section className="mb-16 md:hidden">
              <BallotMobileSection items={currentItems} />
            </section>
          </div>
        </div>

        {/* Topic Education */}
        {ballot.topicExplanations.length > 0 && (
          <section className="mb-16 max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="w-5 h-5 text-accent" />
              <h2 className="font-display text-2xl font-semibold text-foreground">
                Understanding Your Issues
              </h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Deep-dive into how the topics you care about intersect with items on your ballot.
            </p>
            <div className="space-y-3">
              {ballot.topicExplanations.map((topic) => (
                <TopicExplanation key={topic.topic} topic={topic} />
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="border-t border-border pt-8 pb-16 text-center max-w-lg mx-auto">
          <p className="text-sm text-muted-foreground">
            This is a mock ballot for educational purposes only. All information
            is based on publicly available sources and does not constitute
            endorsement of any candidate or position.
          </p>
          <p className="text-xs text-muted-foreground/60 mt-3">
            Allegheny County, Pennsylvania • ZIP {profile.zipCode}
          </p>
        </footer>
      </main>
    </div>
  );
}

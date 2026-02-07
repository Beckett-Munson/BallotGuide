import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Vote, ArrowLeft, BookOpen } from "lucide-react";
import type { UserProfile, PersonalizedBallot } from "@/types/ballot";
import { generatePersonalizedBallot } from "@/data/mockBallotData";
import BallotPaper from "@/components/BallotPaper";
import TopicExplanation from "@/components/TopicExplanation";
import BallotSectionTabs, { type BallotSection } from "@/components/BallotSectionTabs";
import BallotDesktopAnnotations from "@/components/BallotDesktopAnnotations";
import BallotMobileList from "@/components/BallotMobileList";
import RaceDesktopLayout from "@/components/RaceDesktopLayout";
import RaceMobileList from "@/components/RaceMobileList";
import { cn } from "@/lib/utils";
import { TOPIC_COLORS, hsl, hslAlpha } from "@/lib/topicColors";

export default function Ballot() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [ballot, setBallot] = useState<PersonalizedBallot | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<BallotSection>("questions");
  const [animState, setAnimState] = useState<"idle" | "exit" | "enter">("idle");
  const [animDirection, setAnimDirection] = useState<"up" | "down">("up");
  const ballotContainerRef = useRef<HTMLDivElement>(null);
  const [itemPositions, setItemPositions] = useState<number[]>([]);

  /** Measure the vertical center of each ballot item relative to the container. */
  const measureItemPositions = useCallback(() => {
    const container = ballotContainerRef.current;
    if (!container) return;
    const items = container.querySelectorAll<HTMLElement>("[data-ballot-item]");
    if (items.length === 0) return;
    const containerRect = container.getBoundingClientRect();
    const positions = Array.from(items).map((el) => {
      const rect = el.getBoundingClientRect();
      return rect.top + rect.height / 2 - containerRect.top;
    });
    setItemPositions(positions);
  }, []);

  // Re-measure whenever the section or ballot data changes
  useLayoutEffect(() => {
    measureItemPositions();
  }, [activeSection, ballot, measureItemPositions]);

  // Also re-measure on window resize
  useEffect(() => {
    window.addEventListener("resize", measureItemPositions);
    return () => window.removeEventListener("resize", measureItemPositions);
  }, [measureItemPositions]);

  useEffect(() => {
    const stored = sessionStorage.getItem("voterProfile");
    if (!stored) {
      navigate("/");
      return;
    }
    const parsed: UserProfile = JSON.parse(stored);
    setProfile(parsed);

    generatePersonalizedBallot(parsed)
      .then((result) => setBallot(result))
      .catch((err) => {
        console.error("Failed to generate personalized ballot:", err);
      });
  }, [navigate]);

  const handleSectionChange = (section: BallotSection) => {
    if (section === activeSection || animState !== "idle") return;

    // Races are "above" questions on the ballot paper
    const direction = section === "races" ? "up" : "down";
    setAnimDirection(direction);
    setHoveredIndex(null);

    // Exit animation
    setAnimState("exit");
    setTimeout(() => {
      setActiveSection(section);
      setAnimState("enter");
      setTimeout(() => {
        setAnimState("idle");
      }, 400);
    }, 300);
  };

  if (!ballot || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Vote className="w-8 h-8 text-accent mx-auto mb-3 animate-pulse" />
          <p className="text-muted-foreground text-sm">Generating your personalized ballot…</p>
        </div>
      </div>
    );
  }
  const userTopics = Object.keys(profile.issues);

  const currentItems = activeSection === "questions" ? ballot.ballotItems : ballot.raceItems;
  const sectionTitle = activeSection === "questions"
    ? "Special Election Questions"
    : "Active Races";
  const sectionSubtitle = activeSection === "questions"
    ? "City of Pittsburgh • Primary Election — May 20, 2025"
    : "Pittsburgh & Allegheny County • General Election — Nov. 4, 2025";
  const isRaces = activeSection === "races";

  // Animation classes
  const getAnimClass = () => {
    if (animState === "idle") return "translate-y-0 opacity-100";
    if (animState === "exit") {
      return animDirection === "up"
        ? "-translate-y-8 opacity-0"
        : "translate-y-8 opacity-0";
    }
    if (animState === "enter") {
      return "translate-y-0 opacity-100";
    }
    return "";
  };

  const getInitialClass = () => {
    if (animState === "enter") {
      return animDirection === "up"
        ? "animate-slide-from-below"
        : "animate-slide-from-above";
    }
    return "";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Floating Start over button */}
      <button
        onClick={() => navigate("/")}
        className="fixed top-4 right-4 z-50 flex items-center gap-1.5 px-3 py-2 text-sm bg-background/90 backdrop-blur-sm border border-border rounded-lg text-foreground/70 hover:text-foreground hover:bg-background transition-colors shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Start over
      </button>

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
            {userTopics.map((t) => {
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

        {/* Section tabs */}
        <div className="max-w-[520px] mx-auto mb-6">
          <BallotSectionTabs active={activeSection} onChange={handleSectionChange} />
        </div>

        {/* Desktop: Centered ballot with annotations */}
        <section className="mb-16 hidden md:block">
          <div
            ref={ballotContainerRef}
            className={cn(
              "relative max-w-[520px] mx-auto transition-all duration-300 ease-in-out",
              animState === "exit" && (animDirection === "up" ? "-translate-y-8 opacity-0" : "translate-y-8 opacity-0"),
              animState === "enter" && "animate-ballot-enter",
              animState === "idle" && "translate-y-0 opacity-100"
            )}
            style={animState === "enter" ? {
              "--enter-from": animDirection === "up" ? "2rem" : "-2rem",
            } as React.CSSProperties : undefined}
          >
            <BallotPaper
              items={currentItems}
              activeIndex={hoveredIndex}
              onItemClick={setHoveredIndex}
              onItemHover={setHoveredIndex}
              sectionTitle={sectionTitle}
              sectionSubtitle={sectionSubtitle}
            />

            {isRaces ? (
              <RaceDesktopLayout
                items={currentItems}
                hoveredIndex={hoveredIndex}
                onHoverIndex={setHoveredIndex}
                userTopics={userTopics}
              />
            ) : (
              <BallotDesktopAnnotations
                items={currentItems}
                hoveredIndex={hoveredIndex}
                onHoverIndex={setHoveredIndex}
                itemPositions={itemPositions}
              />
            )}
          </div>
        </section>

        {/* Mobile: stacked with inline annotations */}
        <section className="mb-16 md:hidden">
          <div
            className={cn(
              "transition-all duration-300 ease-in-out",
              animState === "exit" && (animDirection === "up" ? "-translate-y-8 opacity-0" : "translate-y-8 opacity-0"),
              animState === "enter" && "animate-ballot-enter",
              animState === "idle" && "translate-y-0 opacity-100"
            )}
            style={animState === "enter" ? {
              "--enter-from": animDirection === "up" ? "2rem" : "-2rem",
            } as React.CSSProperties : undefined}
          >
            {isRaces ? (
              <RaceMobileList
                items={currentItems}
                hoveredIndex={hoveredIndex}
                onToggleIndex={(index) => setHoveredIndex(hoveredIndex === index ? null : index)}
                userTopics={userTopics}
              />
            ) : (
              <BallotMobileList
                items={currentItems}
                hoveredIndex={hoveredIndex}
                onToggleIndex={(index) => setHoveredIndex(hoveredIndex === index ? null : index)}
              />
            )}
          </div>
        </section>

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

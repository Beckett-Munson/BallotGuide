import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Vote, ArrowLeft, BookOpen, BarChart3, Map, ExternalLink } from "lucide-react";
import type { UserProfile, PersonalizedBallot, BallotItem } from "@/types/ballot";
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
import BudgetChart from "@/components/BudgetChart";
import TownMap from "@/components/TownMap";
import TopicColorBubble from "@/components/TopicColorBubble";
import LoadingMessages from "@/components/LoadingMessages";
import termAnnotations from "@/data/termAnnotations.json";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

type TermAnnotation = {
  tag: string;
  blurb: string;
  citations: { title: string; url: string; source?: string }[];
};

const TERM_PHRASE =
  "Pittsburgh Home Rule Charter, Article One, Home Rule Powers - Definitions";

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
  const [ballotRevealed, setBallotRevealed] = useState(false);

  useEffect(() => {
    if (ballot && profile) {
      const t = setTimeout(() => setBallotRevealed(true), 150);
      return () => clearTimeout(t);
    } else {
      setBallotRevealed(false);
    }
  }, [ballot, profile]);

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
    const loadingTopicIds = profile ? Object.keys(profile.issues) : [];
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <TopicColorBubble
            topicIds={loadingTopicIds}
            hideLabel
            pulse
            size="xl"
          />
          <LoadingMessages />
        </div>
      </div>
    );
  }

  const userTopics = Object.keys(profile.issues);
  const loadingTopicIds = Object.keys(profile.issues);

  const currentItems = activeSection === "questions" ? ballot.ballotItems : ballot.raceItems;
  const sectionTitle = activeSection === "questions"
    ? "Special Election Questions"
    : "Active Races";
  const sectionSubtitle = activeSection === "questions"
    ? "City of Pittsburgh • Primary Election"
    : "Pittsburgh & Allegheny County • General Election";
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

  const renderOfficialText = (item: BallotItem) => {
    const termData = (termAnnotations as Record<string, TermAnnotation>)[TERM_PHRASE];
    if (!termData || !item.officialText.includes(TERM_PHRASE)) {
      return item.officialText;
    }

    const parts = item.officialText.split(TERM_PHRASE);

    return (
      <span>
        {parts.map((part, idx) => (
          <span key={`${item.id}-part-${idx}`}>
            {part}
            {idx < parts.length - 1 && (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="underline decoration-dotted underline-offset-4 text-civic-blue hover:text-civic-blue/80 transition-colors"
                    aria-label="Define Pittsburgh Home Rule Charter term"
                  >
                    {TERM_PHRASE}
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" side="bottom" className="w-80">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{termData.tag}</Badge>
                    <span className="text-xs text-muted-foreground">Click outside to close</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{termData.blurb}</p>
                  {termData.citations.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Source
                      </p>
                      <ul className="space-y-1">
                        {termData.citations.map((cite, i) => (
                          <li key={`term-cite-${i}`}>
                            <a
                              href={cite.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-xs text-civic-blue hover:underline"
                            >
                              <ExternalLink className="w-3 h-3 flex-shrink-0" />
                              <span>
                                {cite.title}
                                {cite.source && (
                                  <span className="text-muted-foreground"> — {cite.source}</span>
                                )}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            )}
          </span>
        ))}
      </span>
    );
  };

  return (
    <>
      {/* Loading overlay: fades out when ballot is ready */}
      <div
        className={cn(
          "fixed inset-0 z-40 flex flex-col items-center justify-center bg-background transition-opacity duration-500 ease-out",
          ballotRevealed ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
      >
        <div className="flex flex-col items-center gap-6">
          <TopicColorBubble
            topicIds={loadingTopicIds}
            hideLabel
            pulse
            size="xl"
          />
          <LoadingMessages />
        </div>
      </div>

      {/* Ballot content: fades in as bubble fades out */}
      <div
        className={cn(
          "min-h-screen bg-background transition-opacity duration-500 ease-out",
          ballotRevealed ? "opacity-100" : "opacity-0"
        )}
      >
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
              renderOfficialText={renderOfficialText}
            />

            {isRaces ? (
              <RaceDesktopLayout
                items={currentItems}
                hoveredIndex={hoveredIndex}
                onHoverIndex={setHoveredIndex}
                userTopics={userTopics}
                itemPositions={itemPositions}
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

        {/* County Budget Visualization */}
        <section className="mb-16 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-5 h-5 text-accent" />
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Follow the Money
            </h2>
          </div>
          <p className="text-muted-foreground mb-6">
            See how Allegheny County spends its $1.05 billion budget and how each candidate would shift priorities.
            Click any slice to learn more.
          </p>
          <BudgetChart />
        </section>

        {/* Interactive Town Map */}
        <section className="mb-16 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <Map className="w-5 h-5 text-accent" />
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Your Neighborhood, Your Ballot
            </h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Explore how ballot items affect everyday places in your community. Click on a feature to learn more.
          </p>
          <Suspense
            fallback={
              <div className="h-[520px] rounded-xl border border-border bg-muted flex items-center justify-center">
                <p className="text-sm text-muted-foreground animate-pulse">Loading 3D map…</p>
              </div>
            }
          >
            <TownMap interestTopics={userTopics} />
          </Suspense>
        </section>

        {/* Topic Education */}
        {ballot.topicExplanations.length > 0 && (
          <section className="mb-16 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="w-5 h-5 text-accent" />
              <h2 className="font-display text-2xl font-semibold text-foreground">
                Understanding Your Issues
              </h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Read more about how the topics you care about are reflected in your local ballot.
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
    </>
  );
}

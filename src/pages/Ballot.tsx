import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Vote, ArrowLeft, BookOpen } from "lucide-react";
import type { UserProfile, PersonalizedBallot } from "@/types/ballot";
import { generatePersonalizedBallot } from "@/data/mockBallotData";
import BallotPaper from "@/components/BallotPaper";
import BallotAnnotation from "@/components/BallotAnnotation";
import TopicExplanation from "@/components/TopicExplanation";
import { cn } from "@/lib/utils";

export default function Ballot() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [ballot, setBallot] = useState<PersonalizedBallot | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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

  if (!ballot || !profile) return null;

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
            {profile.topics.map((t) => (
              <span
                key={t}
                className="px-3 py-1 bg-civic-gold-light text-accent text-xs font-semibold rounded-full capitalize"
              >
                {t.replace("_", " ")}
              </span>
            ))}
          </div>
        </header>

        {/* Desktop: Centered ballot with all annotations always visible */}
        <section className="mb-16 hidden md:block">
          <div className="relative max-w-[520px] mx-auto">
            <BallotPaper
              items={ballot.ballotItems}
              activeIndex={hoveredIndex}
              onItemClick={setHoveredIndex}
              onItemHover={setHoveredIndex}
            />

            {/* All annotations always visible, dimmed when not hovered */}
            {ballot.ballotItems.map((item, index) => {
              const isLeft = index % 2 === 0;
              const isHighlighted = hoveredIndex === index;
              const hasSomeHover = hoveredIndex !== null;

              return (
                <div
                  key={`annotation-${index}`}
                  className={cn(
                    "absolute transition-all duration-300",
                    hasSomeHover && !isHighlighted
                      ? "opacity-20 scale-[0.97]"
                      : "opacity-100 scale-100",
                    isHighlighted && "z-10"
                  )}
                  style={{
                    top: `${((index + 0.5) / ballot.ballotItems.length) * 100}%`,
                    ...(isLeft
                      ? { right: "calc(100% + 24px)", transform: `translateY(-50%) ${hasSomeHover && !isHighlighted ? "scale(0.97)" : "scale(1)"}` }
                      : { left: "calc(100% + 24px)", transform: `translateY(-50%) ${hasSomeHover && !isHighlighted ? "scale(0.97)" : "scale(1)"}` }),
                    width: "280px",
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Connector line */}
                  <div
                    className={cn(
                      "absolute top-1/2 -translate-y-1/2 transition-opacity duration-300",
                      hasSomeHover && !isHighlighted ? "opacity-20" : "opacity-100"
                    )}
                    style={
                      isLeft
                        ? { left: "100%", width: "24px" }
                        : { right: "100%", width: "24px" }
                    }
                  >
                    <div className="w-full h-px bg-accent/50" />
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent ${
                        isLeft ? "right-0" : "left-0"
                      }`}
                    />
                  </div>
                  <BallotAnnotation item={item} isActive={isHighlighted || !hasSomeHover} />
                </div>
              );
            })}
          </div>
        </section>

        {/* Mobile: stacked with inline annotations */}
        <section className="mb-16 md:hidden space-y-3">
          {ballot.ballotItems.map((item, index) => (
            <div key={item.id} className="space-y-0">
              <button
                className="w-full text-left px-4 py-3 bg-card border border-border rounded-t-lg"
                onClick={() =>
                  setHoveredIndex(hoveredIndex === index ? null : index)
                }
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <div
                      className={`w-4 h-3 rounded-[50%] border-[1.5px] flex items-center justify-center transition-all ${
                        hoveredIndex === index
                          ? "border-foreground/70 bg-foreground/70"
                          : "border-foreground/25"
                      }`}
                    >
                      {hoveredIndex === index && (
                        <svg className="w-2 h-1.5 text-card" viewBox="0 0 12 10" fill="none">
                          <path d="M1 5L4 8L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                      {item.category === "office" ? "Elected Office" : item.category}
                    </p>
                    <h3 className="font-display text-sm font-semibold text-foreground leading-snug">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </button>
              {hoveredIndex === index && (
                <div className="border border-t-0 border-border rounded-b-lg overflow-hidden animate-fade-in">
                  <BallotAnnotation item={item} isActive={true} />
                </div>
              )}
            </div>
          ))}
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

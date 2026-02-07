import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Vote, ArrowLeft, BookOpen } from "lucide-react";
import type { UserProfile, PersonalizedBallot } from "@/types/ballot";
import { generatePersonalizedBallot } from "@/data/mockBallotData";
import BallotPaper from "@/components/BallotPaper";
import BallotAnnotation from "@/components/BallotAnnotation";
import TopicExplanation from "@/components/TopicExplanation";

export default function Ballot() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [ballot, setBallot] = useState<PersonalizedBallot | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

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
        {/* Greeting - compact */}
        <header className="mb-8 md:mb-10 text-center max-w-3xl mx-auto">
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

        {/* Ballot + Annotations Layout */}
        <section className="mb-16">
          {/* Desktop: side-by-side */}
          <div className="hidden md:grid md:grid-cols-[1fr,340px] lg:grid-cols-[1fr,400px] gap-6 items-start">
            {/* Ballot paper */}
            <div>
              <BallotPaper
                items={ballot.ballotItems}
                activeIndex={activeIndex}
                onItemHover={setActiveIndex}
                onItemClick={setActiveIndex}
              />
            </div>

            {/* Annotation sidebar */}
            <div className="sticky top-20">
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1 mb-2">
                  Personalized Annotations
                </h3>
                {activeIndex !== null && ballot.ballotItems[activeIndex] && (
                  <div className="animate-fade-in" key={activeIndex}>
                    <BallotAnnotation
                      item={ballot.ballotItems[activeIndex]}
                      isActive={true}
                    />
                  </div>
                )}
                {activeIndex === null && (
                  <div className="p-4 border border-dashed border-border rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">
                      Click or hover over a ballot item to see your personalized annotation
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile: stacked with inline annotations */}
          <div className="md:hidden space-y-3">
            {ballot.ballotItems.map((item, index) => (
              <div key={item.id} className="space-y-0">
                {/* Mini ballot row */}
                <button
                  className="w-full text-left px-4 py-3 bg-card border border-border rounded-t-lg"
                  onClick={() =>
                    setActiveIndex(activeIndex === index ? null : index)
                  }
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                          activeIndex === index
                            ? "border-accent bg-accent"
                            : "border-foreground/25"
                        }`}
                      >
                        {activeIndex === index && (
                          <svg className="w-2.5 h-2.5 text-card" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                {/* Annotation below */}
                {activeIndex === index && (
                  <div className="border border-t-0 border-border rounded-b-lg overflow-hidden animate-fade-in">
                    <BallotAnnotation item={item} isActive={true} />
                  </div>
                )}
              </div>
            ))}
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

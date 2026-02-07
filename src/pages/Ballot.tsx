import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Vote, ArrowLeft, BookOpen, FileCheck } from "lucide-react";
import type { UserProfile, PersonalizedBallot } from "@/types/ballot";
import { generatePersonalizedBallot } from "@/data/mockBallotData";
import BallotItem from "@/components/BallotItem";
import TopicExplanation from "@/components/TopicExplanation";

export default function Ballot() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [ballot, setBallot] = useState<PersonalizedBallot | null>(null);

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
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
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

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Greeting */}
        <header className="mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3 leading-tight">
            {ballot.greeting}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            {ballot.personalizedSummary}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
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

        {/* Ballot Items */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <FileCheck className="w-5 h-5 text-accent" />
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Your Mock Ballot
            </h2>
          </div>
          <div className="space-y-4">
            {ballot.ballotItems.map((item, i) => (
              <BallotItem key={item.id} item={item} index={i} />
            ))}
          </div>
        </section>

        {/* Topic Education */}
        {ballot.topicExplanations.length > 0 && (
          <section className="mb-16">
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
        <footer className="border-t border-border pt-8 pb-16 text-center">
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            This is a mock ballot for educational purposes only. All information
            is based on publicly available sources and does not constitute
            endorsement of any candidate or position. Always verify information
            with official sources before voting.
          </p>
          <p className="text-xs text-muted-foreground/60 mt-3">
            Allegheny County, Pennsylvania • ZIP {profile.zipCode}
          </p>
        </footer>
      </main>
    </div>
  );
}

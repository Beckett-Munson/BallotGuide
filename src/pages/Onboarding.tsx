import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart, DollarSign, Leaf, Globe, GraduationCap, Home,
  Briefcase, Users, Shield, Scale, Landmark, Train,
  Droplets, Baby, Wifi, ArrowRight, Vote, MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserProfile } from "@/types/ballot";
import { useCyclingPlaceholder } from "@/hooks/use-cycling-placeholder";
import { TOPIC_COLORS, hsl, hslAlpha } from "@/lib/topicColors";
import TopicColorBubble from "@/components/TopicColorBubble";
import KeywordData from '../data/keywords.json';
import axios from "axios";

const TOPICS = [
  { id: "healthcare", label: "Healthcare", icon: Heart },
  { id: "taxes", label: "Taxes", icon: DollarSign },
  { id: "environment", label: "Environment", icon: Leaf },
  { id: "foreign_policy", label: "Foreign Policy", icon: Globe },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "housing", label: "Housing", icon: Home },
  { id: "jobs", label: "Jobs & Economy", icon: Briefcase },
  { id: "civil_rights", label: "Civil Rights", icon: Scale },
  { id: "public_safety", label: "Public Safety", icon: Shield },
  { id: "transit", label: "Transportation", icon: Train },
  { id: "government", label: "Government Reform", icon: Landmark },
  { id: "family", label: "Family & Children", icon: Baby },
  { id: "water", label: "Water & Utilities", icon: Droplets },
  { id: "immigration", label: "Immigration", icon: Users },
  { id: "technology", label: "Technology", icon: Wifi },
];

export default function Onboarding() {

  type KeywordEntry = {
    id: string;
    keywords: string[];
  };

  const keywordData = KeywordData as KeywordEntry[];
  const navigate = useNavigate();
  const placeholder = useCyclingPlaceholder(3000);
  const [profile, setProfile] = useState<UserProfile>({
    age: 0,
    issues: {},
    aboutYou: "",
    zipCode: "",
  });
  const issueIds = Object.keys(profile.issues);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [bubbleRect, setBubbleRect] = useState<DOMRect | null>(null);
  const [bubbleCentered, setBubbleCentered] = useState(false);
  const [bubblePulsing, setBubblePulsing] = useState(false);

  useEffect(() => {
    if (!isTransitioning || !bubbleRect) return;
    // Start movement on next frame
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setBubbleCentered(true));
    });
    // Start pulsing after the 1.6s move completes so it matches the Ballot loading bubble
    const pulseTimer = setTimeout(() => setBubblePulsing(true), 1650);
    return () => { cancelAnimationFrame(id); clearTimeout(pulseTimer); };
  }, [isTransitioning, bubbleRect]);

  const toggleTopic = (id: string) => {
    setProfile((prev) => {
      const nextIssues = { ...prev.issues };

      if (nextIssues[id]) {
        delete nextIssues[id];
      } else {
        const found = KeywordData.find((x) => x.id === id);
        nextIssues[id] = found?.keywords ?? [];
      }

      return { ...prev, issues: nextIssues };
    });
  };

const canSubmit =
  Object.keys(profile.issues).length > 0 && profile.zipCode.length === 5 && profile.aboutYou.trim().length > 0;

  // call to backend with prompt
  const getAnnotations = async ({
  age,
  district,
  issues,
  notes,
}: {
  age: number;
  district: string;
  issues: Record<string, string[]>;
  notes: string;
}) => {
  try {
    const prompt = `
User Profile:
Age: ${age}
District: ${district}

Selected Issues:
${Object.keys(issues).join(", ")}

Keywords by Issue (dictionary format):
${JSON.stringify(issues, null, 2)}

Additional Context:
${notes}

Task:
Fetch legislations related to the user.
`;

    const response = await axios.post(
      "http://localhost:5001/annotations",
      { prompt },
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );

    console.log("LLM Response:", response.data);
  } catch (error) {
    console.error("Error generating annotations:", error);
  }
};

  const handleSubmit = () => {
    sessionStorage.setItem("voterProfile", JSON.stringify(profile));

    const rect = bubbleRef.current?.getBoundingClientRect();
    if (rect) {
      setBubbleRect(rect);
      setIsTransitioning(true);
      // Store when the spin animation started so the Ballot loading bubble can sync
      sessionStorage.setItem("bubbleAnimStart", String(Date.now()));
      setTimeout(() => navigate("/ballot"), 2200);
    } else {
      navigate("/ballot");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Topic bubble: fixed top-right */}
      {!isTransitioning && (
        <div className="fixed top-6 right-6 z-30">
          <TopicColorBubble
            ref={bubbleRef}
            topicIds={issueIds}
            hideLabel
          />
        </div>
      )}

      {/* Transition overlay: bubble moves to center and grows while page fades */}
      {isTransitioning && bubbleRect && (() => {
        const endSize = 128;
        return (
        <div className="fixed inset-0 z-50 bg-background" aria-hidden>
          <div
            style={{
              position: "fixed",
              left: bubbleCentered ? "50%" : bubbleRect.left,
              top: bubbleCentered ? "calc(50% - 28px)" : bubbleRect.top,
              width: bubbleCentered ? endSize : bubbleRect.width,
              height: bubbleCentered ? endSize : bubbleRect.height,
              transform: bubbleCentered ? "translate(-50%, -50%)" : "none",
              transition: "left 1.6s cubic-bezier(0.25,0.1,0.25,1), top 1.6s cubic-bezier(0.25,0.1,0.25,1), width 1.6s cubic-bezier(0.25,0.1,0.25,1), height 1.6s cubic-bezier(0.25,0.1,0.25,1), transform 1.6s cubic-bezier(0.25,0.1,0.25,1)",
            }}
          >
            <TopicColorBubble
              topicIds={issueIds}
              hideLabel
              fillContainer
              pulse={bubblePulsing}
              className="!m-0 w-full h-full"
            />
          </div>
        </div>
        );
      })()}

      {/* Page content — fades out while bubble moves to center */}
      <div
        className={cn(
          "transition-opacity duration-[1.6s] ease-out",
          isTransitioning && "opacity-0 pointer-events-none"
        )}
      >
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="relative max-w-3xl mx-auto px-6 pt-16 pb-14 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Vote className="w-8 h-8 text-accent" />
            <span className="font-display text-2xl font-bold tracking-tight text-primary">
              BallotGuide
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 leading-tight text-secondary-foreground">
            Your Personalized
            <br />
            Ballot Guide
          </h1>
          <p className="text-lg max-w-xl mx-auto font-body text-secondary-foreground">
            Clear, unbiased explanations of every local ballot item in your
            county.
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-primary">
            <Shield className="w-4 h-4" />
            <span>Non-partisan • Source-verified • Privacy-first</span>
          </div>
        </div>
      </header>

      {/* Single-page form */}
      <main className="max-w-2xl mx-auto px-6 pb-16">
        {/* Tell us about yourself */}
        <section className="mb-6">
          <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
            Tell us about yourself
          </h2>
          <p className="text-muted-foreground mb-4">
            Share anything that helps us personalize your guide, like your job,
             concerns, or goals. 
          </p>
          <div className="relative">
            <textarea
              value={profile.aboutYou}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, aboutYou: e.target.value }))
              }
              placeholder=" "
              rows={4}
              maxLength={500}
              className="w-full px-4 py-3 rounded-lg border-2 border-border bg-card text-foreground placeholder:text-transparent focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all text-sm font-body leading-relaxed resize-none"
            />
            {!profile.aboutYou && (
              <div
                className={cn(
                  "absolute inset-0 px-4 py-3 pointer-events-none text-sm font-body leading-relaxed text-muted-foreground/40 transition-opacity duration-300",
                  placeholder.visible ? "opacity-100" : "opacity-0"
                )}
              >
                {placeholder.text}
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-right">
            {profile.aboutYou.length}/500
          </p>
        </section>

        {/* Topics */}
        <section className="mb-10">
          <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
            What matters to you?
          </h2>
          <p className="text-muted-foreground mb-6">
            Select topics to see how they are reflected in your local ballot.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {TOPICS.map(({ id, label, icon: Icon }) => {
              const selected = Boolean(profile.issues[id]);
              const color = TOPIC_COLORS[id];
              return (
                <button
                  key={id}
                  onClick={() => toggleTopic(id)}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-200 text-left",
                    selected
                      ? "shadow-sm"
                      : "border-border bg-card hover:border-accent/40"
                  )}
                  style={
                    selected && color
                      ? {
                          borderColor: hslAlpha(color, 0.5),
                          backgroundColor: hslAlpha(color, 0.1),
                        }
                      : undefined
                  }
                >
                  <Icon
                    className="w-5 h-5 flex-shrink-0"
                    style={
                      selected && color
                        ? { color: hsl(color) }
                        : undefined
                    }
                  />
                  <span
                    className={cn(
                      "font-medium text-sm",
                      selected ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ZIP Code */}
        <section className="mb-10">
          <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
            Your ZIP code
          </h2>
          <p className="text-muted-foreground mb-4">
            We use this to identify the specific ballot in your county.
          </p>
          <div className="flex items-center gap-3">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                inputMode="numeric"
                maxLength={5}
                value={profile.zipCode}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 5);
                  setProfile({ ...profile, zipCode: val });
                }}
                placeholder="15213"
                className="pl-10 pr-4 py-3 w-40 text-lg font-display font-semibold tracking-widest border-2 border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              />
            </div>
          </div>
        </section>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200",
              canSubmit
                ? "bg-primary text-primary-foreground hover:opacity-90 shadow-sm"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            View My Ballot
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
      </div>
    </div>
  );
}

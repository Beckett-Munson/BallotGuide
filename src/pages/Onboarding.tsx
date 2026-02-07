import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart, DollarSign, Leaf, Globe, GraduationCap, Home,
  Briefcase, Users, Shield, Scale, Landmark, Train,
  Droplets, Baby, Wifi, ArrowRight, Vote, MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserProfile } from "@/types/ballot";
import { useCyclingPlaceholder } from "@/hooks/use-cycling-placeholder";

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
  const navigate = useNavigate();
  const placeholder = useCyclingPlaceholder(5000);
  const [profile, setProfile] = useState<UserProfile>({
    topics: [],
    aboutYou: "",
    zipCode: "",
  });

  const toggleTopic = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      topics: prev.topics.includes(id)
        ? prev.topics.filter((t) => t !== id)
        : [...prev.topics, id],
    }));
  };

  const canSubmit = profile.topics.length > 0 && profile.zipCode.length === 5;

  const handleSubmit = () => {
    sessionStorage.setItem("voterProfile", JSON.stringify(profile));
    navigate("/ballot");
  };

  return (
    <div className="min-h-screen bg-background">
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
            Voter Guide
          </h1>
          <p className="text-lg max-w-xl mx-auto font-body text-secondary-foreground">
            Get clear, unbiased explanations of every ballot item in Allegheny
            County — tailored to what matters most to you.
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-primary">
            <Shield className="w-4 h-4" />
            <span>Non-partisan • Source-verified • Privacy-first</span>
          </div>
        </div>
      </header>

      {/* Single-page form */}
      <main className="max-w-2xl mx-auto px-6 pb-16">
        {/* Topics */}
        <section className="mb-10">
          <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
            What issues matter to you?
          </h2>
          <p className="text-muted-foreground mb-6">
            Select all topics you'd like personalized guidance on.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {TOPICS.map(({ id, label, icon: Icon }) => {
              const selected = profile.topics.includes(id);
              return (
                <button
                  key={id}
                  onClick={() => toggleTopic(id)}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-200 text-left",
                    selected
                      ? "border-accent bg-civic-gold-light shadow-sm"
                      : "border-border bg-card hover:border-accent/40"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 flex-shrink-0",
                      selected ? "text-accent" : "text-muted-foreground"
                    )}
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

        {/* Tell us about yourself */}
        <section className="mb-10">
          <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
            Tell us about yourself
          </h2>
          <p className="text-muted-foreground mb-4">
            Share anything that helps us personalize your guide — your job,
            family situation, concerns, or goals. (Optional)
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
                e.g. {placeholder.text}
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-right">
            {profile.aboutYou.length}/500
          </p>
        </section>

        {/* ZIP Code */}
        <section className="mb-10">
          <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
            Your ZIP code
          </h2>
          <p className="text-muted-foreground mb-4">
            We use this to identify your specific ballot in Allegheny County.
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
            <span className="text-xs text-muted-foreground">
              Allegheny County, PA
            </span>
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
  );
}

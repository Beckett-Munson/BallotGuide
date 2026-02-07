import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  DollarSign,
  Leaf,
  Globe,
  GraduationCap,
  Home,
  ArrowRight,
  Vote,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserProfile } from "@/types/ballot";
import heroImage from "@/assets/hero-civic.jpg";

const TOPICS = [
  { id: "healthcare", label: "Healthcare", icon: Heart },
  { id: "taxes", label: "Taxes", icon: DollarSign },
  { id: "environment", label: "Environment", icon: Leaf },
  { id: "foreign_policy", label: "Foreign Policy", icon: Globe },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "housing", label: "Housing", icon: Home },
];

const AGE_RANGES = ["18–24", "25–34", "35–44", "45–54", "55–64", "65+"];
const EMPLOYMENT_TYPES = [
  "Employed full-time",
  "Employed part-time",
  "Self-employed",
  "Unemployed",
  "Retired",
];
const FAMILY_STATUSES = [
  "Single, no children",
  "Single parent",
  "Married, no children",
  "Married with children",
  "Other",
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>({
    topics: [],
    ageRange: "",
    employmentType: "",
    familyStatus: "",
    isVeteran: false,
    isStudent: false,
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

  const canProceed = () => {
    if (step === 0) return profile.topics.length > 0;
    if (step === 1)
      return profile.ageRange && profile.employmentType && profile.familyStatus;
    if (step === 2) return profile.zipCode.length === 5;
    return false;
  };

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      // Navigate to ballot page with profile
      sessionStorage.setItem("voterProfile", JSON.stringify(profile));
      navigate("/ballot");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Civic engagement illustration"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/80 to-background" />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 pt-16 pb-20 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Vote className="w-8 h-8 text-accent" />
            <span className="font-display text-2xl font-bold text-primary-foreground tracking-tight">
              BallotGuide
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4 leading-tight">
            Your Personalized
            <br />
            Voter Guide
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto font-body">
            Get clear, unbiased explanations of every ballot item in Allegheny
            County — tailored to what matters most to you.
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-primary-foreground/60">
            <Shield className="w-4 h-4" />
            <span>Non-partisan • Source-verified • Privacy-first</span>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="max-w-2xl mx-auto px-6 -mt-4">
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((s) => (
            <div
              key={s}
              className={cn(
                "h-1.5 rounded-full flex-1 transition-all duration-500",
                s <= step ? "bg-accent" : "bg-border"
              )}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Step {step + 1} of 3
        </p>
      </div>

      {/* Form */}
      <main className="max-w-2xl mx-auto px-6 py-10">
        {/* Step 0: Topics */}
        {step === 0 && (
          <div className="animate-fade-in">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
              What issues matter to you?
            </h2>
            <p className="text-muted-foreground mb-8">
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
          </div>
        )}

        {/* Step 1: Demographics */}
        {step === 1 && (
          <div className="animate-fade-in space-y-6">
            <div>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
                Tell us about yourself
              </h2>
              <p className="text-muted-foreground mb-8">
                This helps us personalize how ballot items may affect you.
              </p>
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Age Range
              </label>
              <div className="flex flex-wrap gap-2">
                {AGE_RANGES.map((age) => (
                  <button
                    key={age}
                    onClick={() => setProfile({ ...profile, ageRange: age })}
                    className={cn(
                      "px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                      profile.ageRange === age
                        ? "border-accent bg-civic-gold-light text-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-accent/40"
                    )}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>

            {/* Employment */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Employment Status
              </label>
              <div className="flex flex-wrap gap-2">
                {EMPLOYMENT_TYPES.map((emp) => (
                  <button
                    key={emp}
                    onClick={() =>
                      setProfile({ ...profile, employmentType: emp })
                    }
                    className={cn(
                      "px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                      profile.employmentType === emp
                        ? "border-accent bg-civic-gold-light text-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-accent/40"
                    )}
                  >
                    {emp}
                  </button>
                ))}
              </div>
            </div>

            {/* Family */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Family Status
              </label>
              <div className="flex flex-wrap gap-2">
                {FAMILY_STATUSES.map((fam) => (
                  <button
                    key={fam}
                    onClick={() =>
                      setProfile({ ...profile, familyStatus: fam })
                    }
                    className={cn(
                      "px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                      profile.familyStatus === fam
                        ? "border-accent bg-civic-gold-light text-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-accent/40"
                    )}
                  >
                    {fam}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.isVeteran}
                  onChange={(e) =>
                    setProfile({ ...profile, isVeteran: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                />
                <span className="text-sm text-foreground">I am a veteran</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.isStudent}
                  onChange={(e) =>
                    setProfile({ ...profile, isStudent: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                />
                <span className="text-sm text-foreground">
                  I am a student
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Step 2: ZIP Code */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
              Your ZIP code
            </h2>
            <p className="text-muted-foreground mb-8">
              We use this to identify your specific ballot in Allegheny County.
            </p>
            <input
              type="text"
              inputMode="numeric"
              maxLength={5}
              value={profile.zipCode}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 5);
                setProfile({ ...profile, zipCode: val });
              }}
              placeholder="e.g. 15213"
              className="w-full max-w-xs px-5 py-4 text-2xl font-display font-semibold tracking-widest text-center border-2 border-border rounded-xl bg-card text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
            />
            <p className="text-xs text-muted-foreground mt-3">
              Must be an Allegheny County, PA ZIP code
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10">
          {step > 0 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back
            </button>
          ) : (
            <div />
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200",
              canProceed()
                ? "bg-primary text-primary-foreground hover:opacity-90 shadow-sm"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            {step === 2 ? "View My Ballot" : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  DollarSign,
  Leaf,
  Globe,
  GraduationCap,
  Home,
  Briefcase,
  Users,
  Medal,
  BookOpen,
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

const EMPLOYMENT_TYPES = [
  { id: "full-time", label: "Employed full-time", icon: Briefcase },
  { id: "part-time", label: "Employed part-time", icon: Briefcase },
  { id: "self-employed", label: "Self-employed", icon: Briefcase },
  { id: "unemployed", label: "Unemployed", icon: Briefcase },
  { id: "retired", label: "Retired", icon: Briefcase },
];

const FAMILY_STATUSES = [
  { id: "single", label: "Single, no children", icon: Users },
  { id: "single-parent", label: "Single parent", icon: Users },
  { id: "married-no-kids", label: "Married, no children", icon: Users },
  { id: "married-kids", label: "Married with children", icon: Users },
  { id: "other", label: "Other", icon: Users },
];

const EXTRA_IDENTIFIERS = [
  { id: "veteran", label: "I am a veteran", icon: Medal },
  { id: "student", label: "I am a student", icon: BookOpen },
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

  const toggleExtra = (id: string) => {
    if (id === "veteran") {
      setProfile((prev) => ({ ...prev, isVeteran: !prev.isVeteran }));
    } else if (id === "student") {
      setProfile((prev) => ({ ...prev, isStudent: !prev.isStudent }));
    }
  };

  const isExtraSelected = (id: string) => {
    if (id === "veteran") return profile.isVeteran;
    if (id === "student") return profile.isStudent;
    return false;
  };

  const canProceed = () => {
    if (step === 0) return profile.topics.length > 0 && profile.employmentType && profile.familyStatus;
    if (step === 1) return profile.zipCode.length === 5;
    return false;
  };

  const handleNext = () => {
    if (step < 1) {
      setStep(step + 1);
    } else {
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
          {[0, 1].map((s) => (
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
          Step {step + 1} of 2
        </p>
      </div>

      {/* Form */}
      <main className="max-w-2xl mx-auto px-6 py-10">
        {/* Step 0: Combined Topics + About You */}
        {step === 0 && (
          <div className="animate-fade-in space-y-10">
            {/* Topics */}
            <div>
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
            </div>

            {/* Employment */}
            <div>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
                Tell us about yourself
              </h2>
              <p className="text-muted-foreground mb-6">
                This helps us personalize how ballot items may affect you.
              </p>

              <label className="block text-sm font-semibold text-foreground mb-3">
                Employment Status
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {EMPLOYMENT_TYPES.map(({ id, label, icon: Icon }) => {
                  const selected = profile.employmentType === label;
                  return (
                    <button
                      key={id}
                      onClick={() => setProfile({ ...profile, employmentType: label })}
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

            {/* Family */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Family Status
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {FAMILY_STATUSES.map(({ id, label, icon: Icon }) => {
                  const selected = profile.familyStatus === label;
                  return (
                    <button
                      key={id}
                      onClick={() => setProfile({ ...profile, familyStatus: label })}
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

            {/* Extra identifiers */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Anything else?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {EXTRA_IDENTIFIERS.map(({ id, label, icon: Icon }) => {
                  const selected = isExtraSelected(id);
                  return (
                    <button
                      key={id}
                      onClick={() => toggleExtra(id)}
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
          </div>
        )}

        {/* Step 1: ZIP Code */}
        {step === 1 && (
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
            {step === 1 ? "View My Ballot" : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
}

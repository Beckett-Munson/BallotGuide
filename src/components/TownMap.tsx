import { Canvas } from "@react-three/fiber";
import { ChevronDown, ExternalLink, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import TownMapScene from "@/features/town-map/TownMapScene";
import { CITY_SCENARIOS, type CityId } from "@/features/town-map/cities";
import type { CityPolicyAnnotation } from "@/features/town-map/types";
import { filterAnnotationsByTopics } from "@/features/town-map/utils";
import { TOPIC_COLORS, hsl, hslAlpha } from "@/lib/topicColors";
import { cn } from "@/lib/utils";

interface TownMapProps {
  cityId?: CityId;
  interestTopics?: string[];
}

const DEFAULT_CITY_ID: CityId = "pittsburgh";

function getTopicOrder(annotations: CityPolicyAnnotation[]): string[] {
  return Array.from(new Set(annotations.map((annotation) => annotation.topic)));
}

function getInitialTopics(interestTopics: string[] | undefined, availableTopics: string[]): string[] {
  if (!interestTopics || interestTopics.length === 0) {
    return availableTopics;
  }

  const preferred = interestTopics.filter((topic) => availableTopics.includes(topic));
  return preferred.length > 0 ? preferred : availableTopics;
}

function TopicButton({
  topic,
  selected,
  onToggle,
}: {
  topic: string;
  selected: boolean;
  onToggle: (topic: string) => void;
}) {
  const color = TOPIC_COLORS[topic];

  return (
    <button
      type="button"
      onClick={() => onToggle(topic)}
      className="rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize transition-colors"
      style={{
        borderColor: color ? hslAlpha(color, selected ? 0.55 : 0.35) : undefined,
        background: selected && color ? hslAlpha(color, 0.18) : "transparent",
        color: color ? hsl(color) : undefined,
      }}
    >
      {topic.replace("_", " ")}
    </button>
  );
}

function PolicyImpactPanel({
  annotation,
  onClose,
}: {
  annotation: CityPolicyAnnotation;
  onClose: () => void;
}) {
  const color = TOPIC_COLORS[annotation.topic];
  const [showCitations, setShowCitations] = useState(false);

  useEffect(() => {
    setShowCitations(false);
  }, [annotation.id]);

  return (
    <div className="absolute bottom-4 left-4 right-4 z-10 rounded-xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur-sm md:left-auto md:w-96">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Close details"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="mb-2 pr-6">
        <span
          className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
          style={{
            backgroundColor: color ? hslAlpha(color, 0.15) : undefined,
            color: color ? hsl(color) : undefined,
          }}
        >
          {annotation.topic.replace("_", " ")}
        </span>
      </div>

      <h4 className="mb-1 pr-6 font-display text-sm font-semibold text-foreground">
        {annotation.title}
      </h4>
      <p className="mb-2 text-sm leading-relaxed text-foreground/90">{annotation.text}</p>
      <p className="mb-3 text-xs text-muted-foreground">
        Highlighted building: {annotation.highlightedBuilding}
      </p>

      {annotation.citations.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => setShowCitations((value) => !value)}
            className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
            style={{ color: color ? hsl(color) : undefined }}
          >
            <span>{showCitations ? "Hide Citations" : "See Citations"}</span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform duration-300",
                showCitations && "rotate-180",
              )}
            />
          </button>

          <div
            className={cn(
              "overflow-hidden transition-all duration-500 ease-in-out",
              showCitations ? "mt-3 max-h-56 opacity-100" : "max-h-0 opacity-0",
            )}
          >
            <ul className="space-y-1.5 border-t border-border/60 pt-3">
              {annotation.citations.map((citation) => (
                <li key={citation.url}>
                  <a
                    href={citation.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start gap-1.5 text-xs hover:underline"
                    style={{ color: color ? hsl(color) : undefined }}
                  >
                    <ExternalLink className="mt-0.5 h-3 w-3 flex-shrink-0" />
                    <span>{citation.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default function TownMap({ cityId = DEFAULT_CITY_ID, interestTopics = [] }: TownMapProps) {
  const scenario = CITY_SCENARIOS[cityId];
  const topicOrder = useMemo(() => getTopicOrder(scenario.annotations), [scenario.annotations]);

  const [activeTopics, setActiveTopics] = useState<string[]>(() =>
    getInitialTopics(interestTopics, topicOrder),
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setActiveTopics(getInitialTopics(interestTopics, topicOrder));
  }, [interestTopics, topicOrder]);

  const visibleAnnotations = useMemo(
    () => filterAnnotationsByTopics(scenario.annotations, activeTopics),
    [scenario.annotations, activeTopics],
  );

  useEffect(() => {
    if (selectedId && !visibleAnnotations.some((annotation) => annotation.id === selectedId)) {
      setSelectedId(null);
    }
  }, [selectedId, visibleAnnotations]);

  const selectedAnnotation =
    visibleAnnotations.find((annotation) => annotation.id === selectedId) ?? null;

  const toggleTopic = (topic: string) => {
    setActiveTopics((current) =>
      current.includes(topic) ? current.filter((value) => value !== topic) : [...current, topic],
    );
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-muted/40">
      <div className="border-b border-border bg-background/70 px-3 py-3 backdrop-blur-sm">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-background px-2 py-1 font-semibold text-foreground">
            {scenario.city.name}
          </span>
          <span className="text-muted-foreground">
            Model source:{" "}
            {scenario.city.model.sourceUrl ? (
              <a
                href={scenario.city.model.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-foreground underline underline-offset-2"
              >
                {scenario.city.model.sourceName}
              </a>
            ) : (
              scenario.city.model.sourceName
            )}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {topicOrder.map((topic) => (
            <TopicButton
              key={topic}
              topic={topic}
              selected={activeTopics.includes(topic)}
              onToggle={toggleTopic}
            />
          ))}
        </div>
      </div>

      <div className="relative h-[520px]">
        <Canvas
          camera={{
            position: scenario.city.camera.position,
            fov: scenario.city.camera.fov,
          }}
          shadows
          gl={{ antialias: true }}
          onPointerMissed={() => setSelectedId(null)}
        >
          <TownMapScene
            city={scenario.city}
            annotations={visibleAnnotations}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </Canvas>

        {visibleAnnotations.length === 0 && (
          <div className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center">
            <div className="rounded-xl border border-border bg-background/90 px-4 py-3 text-sm text-muted-foreground shadow-md backdrop-blur-sm">
              Select at least one topic to drop interactive policy markers into the city.
            </div>
          </div>
        )}

        {!selectedAnnotation && visibleAnnotations.length > 0 && (
          <div className="pointer-events-none absolute bottom-3 left-0 right-0 text-center">
            <span className="rounded-full bg-background/75 px-3 py-1 text-[11px] text-muted-foreground shadow-sm backdrop-blur-sm">
              Click a marker to see how that policy touches a specific place.
            </span>
          </div>
        )}

        {selectedAnnotation && (
          <PolicyImpactPanel annotation={selectedAnnotation} onClose={() => setSelectedId(null)} />
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { ChevronDown, ExternalLink, FileText } from "lucide-react";
import type { BallotItem as BallotItemType } from "@/types/ballot";
import { cn } from "@/lib/utils";
import termAnnotations from "@/data/termAnnotations.json";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface BallotItemProps {
  item: BallotItemType;
  index: number;
}

const categoryLabels: Record<string, { label: string; className: string }> = {
  healthcare: { label: "Healthcare", className: "bg-civic-green-light text-civic-green" },
  taxes: { label: "Taxes & Revenue", className: "bg-civic-gold-light text-accent" },
  environment: { label: "Environment", className: "bg-civic-blue-light text-civic-blue" },
  office: { label: "Elected Office", className: "bg-secondary text-foreground" },
  transit: { label: "Transit", className: "bg-civic-blue-light text-civic-blue" },
};

type TermAnnotation = {
  tag: string;
  blurb: string;
  citations: { title: string; url: string; source?: string }[];
};

const TERM_PHRASE =
  "Pittsburgh Home Rule Charter, Article One, Home Rule Powers - Definitions";

function renderOfficialText(item: BallotItemType) {
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
                  <span className="text-xs text-muted-foreground">Tap to close</span>
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
}

export default function BallotItem({ item, index }: BallotItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const category = categoryLabels[item.category] || categoryLabels.office;

  const hasCitations = item.expand.citations.length > 0;

  return (
    <article
      className="group border border-border rounded-lg bg-card overflow-hidden transition-shadow duration-300 hover:shadow-md"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <span
              className={cn(
                "inline-block px-3 py-1 text-xs font-semibold rounded-full mb-3",
                category.className
              )}
            >
              {category.label}
            </span>
            <h3 className="text-xl md:text-2xl font-display font-semibold text-foreground leading-tight">
              {item.title}
            </h3>
          </div>
        </div>

        {/* Official text */}
        <div className="mb-5 p-4 bg-muted rounded-md border-l-4 border-accent">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Official Ballot Text
            </span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">
            {renderOfficialText(item)}
          </p>
        </div>

        {/* Annotation */}
        <div className="mb-5">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-accent mb-2">
            What this means for you
          </h4>
          <p className="text-base text-foreground/85 leading-relaxed">{item.annotation}</p>
        </div>

        {/* Show sources button */}
        {hasCitations && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm font-semibold text-civic-blue hover:text-civic-blue/80 transition-colors"
            aria-expanded={isExpanded}
          >
            <span>{isExpanded ? "Hide sources" : "Show sources"}</span>
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform duration-300",
                isExpanded && "rotate-180"
              )}
            />
          </button>
        )}
      </div>

      {/* Expanded sources */}
      {hasCitations && (
        <div
          className={cn(
            "overflow-hidden transition-all duration-500 ease-in-out",
            isExpanded ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="px-6 pb-6 md:px-8 md:pb-8 border-t border-border pt-5">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Sources
            </h4>
            <ul className="space-y-2">
              {item.expand.citations.map((cite, i) => (
                <li key={i}>
                  <a
                    href={cite.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-civic-blue hover:underline group/link"
                  >
                    <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
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
        </div>
      )}
    </article>
  );
}

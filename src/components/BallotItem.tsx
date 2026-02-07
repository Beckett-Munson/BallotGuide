import { useState } from "react";
import { ChevronDown, ExternalLink, MessageCircle, FileText } from "lucide-react";
import type { BallotItem as BallotItemType } from "@/types/ballot";
import { cn } from "@/lib/utils";

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

export default function BallotItem({ item, index }: BallotItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const category = categoryLabels[item.category] || categoryLabels.office;

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
          <p className="text-sm text-foreground leading-relaxed">{item.officialText}</p>
        </div>

        {/* Annotation */}
        <div className="mb-5">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-accent mb-2">
            What this means for you
          </h4>
          <p className="text-base text-foreground/85 leading-relaxed">{item.annotation}</p>
        </div>

        {/* Expand button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-semibold text-civic-blue hover:text-civic-blue/80 transition-colors"
          aria-expanded={isExpanded}
        >
          <span>{isExpanded ? "Show less" : "Learn more"}</span>
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform duration-300",
              isExpanded && "rotate-180"
            )}
          />
        </button>
      </div>

      {/* Expanded content */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-500 ease-in-out",
          isExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-6 pb-6 md:px-8 md:pb-8 border-t border-border pt-5 space-y-5">
          {/* News summary */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Recent Coverage
            </h4>
            <p className="text-sm text-foreground/80 leading-relaxed">{item.expand.newsSummary}</p>
          </div>

          {/* Citations */}
          <div>
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
                      {cite.title}{" "}
                      <span className="text-muted-foreground">— {cite.source}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Chatbot prompt */}
          <div className="p-4 bg-civic-blue-light rounded-lg border border-civic-blue/10">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="w-4 h-4 text-civic-blue" />
              <span className="text-xs font-semibold uppercase tracking-wider text-civic-blue">
                Ask a follow-up
              </span>
            </div>
            <p className="text-sm text-foreground/70 italic">"{item.expand.chatbotPrompt}"</p>
          </div>
        </div>
      </div>
    </article>
  );
}

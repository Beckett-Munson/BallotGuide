/**
 * Issue node definitions and tag/keyword matching for the Ripple visualization.
 *
 * IDs match the existing onboarding topic IDs used in the codebase
 * (e.g. "jobs" not "jobs_economy", "transit" not "transportation").
 * Aliases allow the backend to send either form.
 */

export interface IssueNode {
  id: string;
  label: string;
  emoji: string;
  keywords: string[];
  tooltip: string;
  aliases: string[];
}

export const ISSUE_NODES: IssueNode[] = [
  {
    id: "healthcare",
    label: "Healthcare",
    emoji: "🏥",
    keywords: ["health", "healthcare", "hospital", "insurance", "medicaid", "medicare", "mental health", "clinic"],
    tooltip: "Policies affecting healthcare access, insurance, and medical services.",
    aliases: ["healthcare", "health"],
  },
  {
    id: "taxes",
    label: "Taxes",
    emoji: "💰",
    keywords: ["tax", "taxes", "property tax", "income tax", "sales tax", "parcel", "rate", "millage", "assessment", "levy"],
    tooltip: "Measures affecting tax rates, assessments, and public revenue.",
    aliases: ["taxes", "tax"],
  },
  {
    id: "environment",
    label: "Environment",
    emoji: "🌱",
    keywords: ["climate", "emissions", "pollution", "renewable", "green", "sustainability", "carbon", "environment"],
    tooltip: "Environmental protection, climate policy, and sustainability efforts.",
    aliases: ["environment", "climate"],
  },
  {
    id: "foreign_policy",
    label: "Foreign Policy",
    emoji: "🌍",
    keywords: ["foreign", "international", "sanctions", "treaty", "aid", "war", "defense abroad", "diplomacy"],
    tooltip: "Foreign affairs, international relationships, and global policy.",
    aliases: ["foreign_policy", "foreign policy"],
  },
  {
    id: "education",
    label: "Education",
    emoji: "🎓",
    keywords: ["school", "teacher", "students", "education", "classroom", "district", "tuition", "university", "curriculum"],
    tooltip: "Schools, educational funding, and student-related policies.",
    aliases: ["education"],
  },
  {
    id: "housing",
    label: "Housing",
    emoji: "🏠",
    keywords: ["housing", "rent", "renter", "home", "affordable", "units", "mortgage", "eviction", "zoning", "development"],
    tooltip: "Housing affordability, zoning, and residential development.",
    aliases: ["housing"],
  },
  {
    id: "jobs",
    label: "Jobs & Economy",
    emoji: "💼",
    keywords: ["jobs", "wages", "employment", "economy", "small business", "inflation", "industry", "labor", "workforce"],
    tooltip: "Employment, wages, economic growth, and business policy.",
    aliases: ["jobs", "jobs_economy", "jobs & economy"],
  },
  {
    id: "civil_rights",
    label: "Civil Rights",
    emoji: "⚖️",
    keywords: ["civil rights", "discrimination", "protected class", "equal", "equity", "rights", "minority", "gender", "race"],
    tooltip: "Anti-discrimination protections, equity, and civil liberties.",
    aliases: ["civil_rights", "civil rights"],
  },
  {
    id: "public_safety",
    label: "Public Safety",
    emoji: "🛡️",
    keywords: ["public safety", "police", "fire", "emergency", "crime", "violence", "911", "jail", "courts"],
    tooltip: "Law enforcement, emergency services, and community safety.",
    aliases: ["public_safety", "public safety"],
  },
  {
    id: "transit",
    label: "Transportation",
    emoji: "🚍",
    keywords: ["transit", "bus", "rail", "commute", "station", "transportation", "roads", "traffic", "bike", "walk"],
    tooltip: "Public transit, roads, infrastructure, and commuter services.",
    aliases: ["transit", "transportation"],
  },
  {
    id: "government",
    label: "Gov. Reform",
    emoji: "🏛️",
    keywords: ["governance", "charter", "reform", "oversight", "audit", "ethics", "term limits", "ballot process", "transparency"],
    tooltip: "Government structure, transparency, and democratic reform.",
    aliases: ["government", "government_reform", "government reform"],
  },
  {
    id: "family",
    label: "Family",
    emoji: "👨‍👩‍👧",
    keywords: ["children", "family", "childcare", "parent", "kids", "youth", "pregnancy", "maternal"],
    tooltip: "Family services, childcare, parenting, and youth programs.",
    aliases: ["family", "family_children", "family & children"],
  },
  {
    id: "water",
    label: "Water & Util.",
    emoji: "💧",
    keywords: ["water", "utilities", "sewer", "pipes", "infrastructure", "power", "electric", "gas", "billing", "rates"],
    tooltip: "Water systems, sewer infrastructure, and utility services.",
    aliases: ["water", "water_utilities", "water & utilities"],
  },
  {
    id: "immigration",
    label: "Immigration",
    emoji: "🧭",
    keywords: ["immigration", "migrant", "visa", "asylum", "border", "citizenship", "refugee", "deportation"],
    tooltip: "Immigration enforcement, refugee policy, and citizenship.",
    aliases: ["immigration"],
  },
  {
    id: "technology",
    label: "Technology",
    emoji: "💻",
    keywords: ["technology", "data", "privacy", "ai", "surveillance", "cyber", "broadband", "internet", "software"],
    tooltip: "Digital privacy, broadband, AI policy, and tech regulation.",
    aliases: ["technology", "tech"],
  },
];

// ---------------------------------------------------------------------------
// Lookup maps
// ---------------------------------------------------------------------------

const aliasToId = new Map<string, string>();
for (const node of ISSUE_NODES) {
  aliasToId.set(node.id.toLowerCase(), node.id);
  aliasToId.set(node.label.toLowerCase(), node.id);
  for (const alias of node.aliases) {
    aliasToId.set(alias.toLowerCase(), node.id);
  }
}

const nodeById = new Map(ISSUE_NODES.map((n) => [n.id, n]));

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Determine which issue nodes should be highlighted for a given answer.
 *
 * 1. If backendTags are provided, map them to node IDs (case-insensitive).
 * 2. Otherwise fall back to keyword matching on the answer text.
 */
export function getActiveNodeIds(
  answerText: string,
  backendTags?: string[],
): string[] {
  if (backendTags && backendTags.length > 0) {
    const ids = new Set<string>();
    for (const tag of backendTags) {
      const id = aliasToId.get(tag.toLowerCase().trim());
      if (id) ids.add(id);
    }
    if (ids.size > 0) return [...ids];
    // fall through to keyword matching if nothing mapped
  }

  const lower = answerText.toLowerCase();
  const matched: string[] = [];
  for (const node of ISSUE_NODES) {
    if (node.keywords.some((kw) => lower.includes(kw))) {
      matched.push(node.id);
    }
  }
  return matched;
}

/** "Cost of Living" derived impact — shown when >=2 of these are active. */
const COST_OF_LIVING_IDS = new Set(["housing", "taxes", "transit", "water"]);

export function getDerivedImpact(activeNodeIds: string[]): string | null {
  const count = activeNodeIds.filter((id) => COST_OF_LIVING_IDS.has(id)).length;
  return count >= 2 ? "Cost of Living" : null;
}

/**
 * Pick which nodes to display (max `limit`).
 * Priority: selectedNodeIds → activeNodeIds → stable default order.
 */
export function pickDisplayNodes(
  activeNodeIds: string[],
  selectedNodeIds: string[],
  limit = 10,
): IssueNode[] {
  const seen = new Set<string>();
  const result: IssueNode[] = [];

  const add = (id: string) => {
    if (seen.size >= limit || seen.has(id)) return;
    const node = nodeById.get(id);
    if (node) {
      seen.add(id);
      result.push(node);
    }
  };

  // 1. Selected (user's onboarding choices)
  selectedNodeIds.forEach(add);
  // 2. Active this turn
  activeNodeIds.forEach(add);
  // 3. Fill with default order
  ISSUE_NODES.forEach((n) => add(n.id));

  return result;
}

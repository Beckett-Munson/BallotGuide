/**
 * ONE-TIME script: generates cited candidate topic blurbs from Pinecone + LLM.
 *
 * Usage (from project root):
 *   npx tsx scripts/generate-candidate-blurbs.ts
 *
 * Output → scripts/generated-blurbs.json  (paste into mockBallotData.ts)
 */

import { config } from "dotenv";
config(); // load .env

import { Pinecone } from "@pinecone-database/pinecone";
import { Dedalus } from "dedalus-labs";
import { writeFileSync } from "fs";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const PINECONE_API_KEY = process.env.VITE_PINECONE_API_KEY!;
const PINECONE_INDEX  = process.env.VITE_PINECONE_INDEX_NAME!;
const DEDALUS_API_KEY = process.env.VITE_DEDALUS_API_KEY!;
const MODEL           = process.env.DEFAULT_MODEL ?? "anthropic/claude-sonnet-4-5";
const NAMESPACES      = ["legislation", "legal-code"];
const EMBEDDING_MODEL = "llama-text-embed-v2";

if (!PINECONE_API_KEY || !PINECONE_INDEX || !DEDALUS_API_KEY) {
  console.error("Missing VITE_PINECONE_API_KEY, VITE_PINECONE_INDEX_NAME, or VITE_DEDALUS_API_KEY in .env");
  process.exit(1);
}

const pc      = new Pinecone({ apiKey: PINECONE_API_KEY });
const dedalus = new Dedalus({ apiKey: DEDALUS_API_KEY });

// ---------------------------------------------------------------------------
// Race data (copied from mockBallotData.ts for standalone execution)
// ---------------------------------------------------------------------------

interface CandidateInput {
  name: string;
  party: string;
  bio: string;
  topics: string[]; // topic keys this candidate has blurbs for
}

interface RaceInput {
  id: string;
  title: string;
  officialText: string;
  candidates: CandidateInput[];
}

const RACES: RaceInput[] = [
  {
    id: "race-mayor",
    title: "Mayor of Pittsburgh",
    officialText: "Vote for one candidate for Mayor of the City of Pittsburgh. The mayor serves a four-year term as the chief executive officer of the city.",
    candidates: [
      { name: "Corey O'Connor", party: "D", bio: "Former City Council member and son of the late Mayor Bob O'Connor. Won the Democratic primary defeating incumbent Ed Gainey.", topics: ["jobs", "housing", "public_safety", "taxes", "environment", "transit", "government", "water", "civil_rights", "education"] },
      { name: "Tony Moreno", party: "R", bio: "Former Pittsburgh police officer and 2021 mayoral candidate. Running on a law-and-order platform.", topics: ["jobs", "housing", "public_safety", "taxes", "environment", "transit", "government", "water", "civil_rights", "education"] },
    ],
  },
  {
    id: "race-superior-court",
    title: "Pennsylvania Superior Court",
    officialText: "Vote for one candidate for Judge of the Superior Court of Pennsylvania. The Superior Court hears criminal appeals and family court cases involving private entities. Justices serve 10-year terms.",
    candidates: [
      { name: "Brandon Neuman", party: "D", bio: "Washington County judge with experience on the Court of Common Pleas.", topics: ["civil_rights", "public_safety", "government", "jobs", "family"] },
      { name: "Maria Battista", party: "R", bio: "Legal consultant with a conservative judicial philosophy.", topics: ["civil_rights", "public_safety", "government", "jobs", "family"] },
    ],
  },
  {
    id: "race-commonwealth-court",
    title: "Pennsylvania Commonwealth Court",
    officialText: "Vote for one candidate for Judge of the Commonwealth Court of Pennsylvania. The Commonwealth Court hears civil and regulatory appeals involving public entities. Judges serve 10-year terms.",
    candidates: [
      { name: "Stella Tsai", party: "D", bio: "Sitting Common Pleas judge in Philadelphia with experience in elections and zoning cases.", topics: ["government", "taxes", "housing", "environment", "civil_rights"] },
      { name: "Matt Wolford", party: "R", bio: "Attorney with a focus on regulatory and business law.", topics: ["government", "taxes", "housing", "environment", "civil_rights"] },
    ],
  },
  {
    id: "race-sheriff",
    title: "Allegheny County Sheriff",
    officialText: "Vote for one candidate for Sheriff of Allegheny County. The Sheriff handles warrants, fugitive pursuit, court security, prisoner transport, and sheriff's sales.",
    candidates: [
      { name: "Kevin Kraus", party: "D", bio: "Incumbent sheriff since 2021. Served for decades in the Pittsburgh Bureau of Police.", topics: ["public_safety", "government", "immigration", "civil_rights"] },
      { name: "Brian Weismantle", party: "R", bio: "Veteran of the Pittsburgh Bureau of Police with decades of law enforcement experience.", topics: ["public_safety", "government", "immigration", "civil_rights"] },
    ],
  },
  {
    id: "race-council-at-large",
    title: "Allegheny County Council — At Large",
    officialText: "Vote for one candidate for Allegheny County Council At-Large seat. Council members serve four-year terms on the 15-member legislative body that passes the county budget and enacts ordinances.",
    candidates: [
      { name: "Mike Embrescia", party: "R", bio: "Appointed to the at-large seat after a vacancy. Comes from a business background.", topics: ["government", "taxes", "housing", "jobs", "public_safety"] },
      { name: "Alex Rose", party: "I", bio: "Left-leaning independent whose candidacy survived a legal challenge to the PA Supreme Court.", topics: ["government", "taxes", "housing", "jobs", "public_safety", "transit"] },
    ],
  },
];

// ---------------------------------------------------------------------------
// Pinecone helpers
// ---------------------------------------------------------------------------

async function embed(texts: string[]): Promise<number[][]> {
  const res = await pc.inference.embed({
    model: EMBEDDING_MODEL,
    inputs: texts,
    parameters: { inputType: "query", truncate: "END" },
  });
  return res.data.map((d: any) => d.values);
}

interface PineconeHit {
  id: string;
  text: string;
  score: number;
  title: string;
  url: string;
}

async function queryPinecone(query: string, topK = 6): Promise<PineconeHit[]> {
  const [embedding] = await embed([query]);
  const index = pc.index(PINECONE_INDEX);
  const all: PineconeHit[] = [];

  for (const ns of NAMESPACES) {
    const res = await index.query({
      vector: embedding,
      topK,
      includeMetadata: true,
      ...(ns ? { namespace: ns } : {}),
    } as any);

    for (const m of res.matches ?? []) {
      const meta: any = m.metadata ?? {};
      all.push({
        id: m.id,
        text: meta.text ?? "",
        score: m.score ?? 0,
        title: meta.title ?? m.id,
        url: meta.url ?? "",
      });
    }
  }

  // Deduplicate by id, sort by score
  const seen = new Set<string>();
  return all
    .filter((h) => {
      if (seen.has(h.id)) return false;
      seen.add(h.id);
      return true;
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

// ---------------------------------------------------------------------------
// LLM generation
// ---------------------------------------------------------------------------

interface GeneratedBlurb {
  topic: string;
  text: string;
  sourceIndices: number[];
}

async function generateBlurbs(
  race: RaceInput,
  candidate: CandidateInput,
  hits: PineconeHit[]
): Promise<GeneratedBlurb[]> {
  // Build context with numbered sources
  let context = `**Race: ${race.title}**\n${race.officialText}\n`;
  context += `\n**Candidate: ${candidate.name} (${candidate.party})**\n${candidate.bio}\n`;

  if (hits.length > 0) {
    context += "\n**Related Legislation & Local Sources (numbered):**\n";
    for (let i = 0; i < hits.length; i++) {
      const h = hits[i];
      context += `\n--- [Source ${i + 1}] ${h.title}${h.url ? ` (${h.url})` : ""} ---\n${h.text}\n`;
    }
  }

  const systemPrompt = `You are a neutral, nonpartisan political analyst. Your job is to generate short, cited annotations explaining a candidate's likely positions on specific issues.

You MUST return ONLY valid JSON — no markdown, no code fences, no extra text.

Use ONLY the provided race context and legislative sources. Do NOT use outside knowledge or invent facts. If a source doesn't clearly support the topic, you may write a general factual annotation about the candidate's stance based on the race description, but still try to cite at least one source.

For each topic listed below, produce a JSON object with:
- "topic": the topic key exactly as given
- "text": 2-3 SHORT sentences in plain, everyday language. Explain what this candidate's election would likely mean for this issue. Be direct and conversational, not legalistic.
- "sourceIndices": array of [Source N] numbers from the context that support this annotation. Only use indices that exist in the context.

Topics to annotate: ${candidate.topics.join(", ")}

Return a JSON array of objects. One object per topic. NEVER return an empty array.`;

  const response = await dedalus.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: context },
    ],
    temperature: 0.3,
  });

  let content = (response as any).choices[0].message.content ?? "";
  content = content.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "");

  try {
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed)) throw new Error("not array");
    return parsed as GeneratedBlurb[];
  } catch (e) {
    console.error(`  ⚠️ Parse error for ${candidate.name}:`, (e as Error).message);
    console.error("  Raw content:", content.slice(0, 300));
    return [];
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

interface OutputBlurb {
  text: string;
  citations: { title: string; url: string }[];
}

interface OutputCandidate {
  name: string;
  topicBlurbs: Record<string, OutputBlurb>;
}

interface OutputRace {
  raceId: string;
  candidates: OutputCandidate[];
}

async function main() {
  const results: OutputRace[] = [];

  for (const race of RACES) {
    console.log(`\n🏛️  ${race.title}`);

    // Query Pinecone once per race
    const query = `${race.title} ${race.officialText}`;
    console.log("  📡 Querying Pinecone…");
    const hits = await queryPinecone(query);
    console.log(`  📄 ${hits.length} sources retrieved`);

    const outCandidates: OutputCandidate[] = [];

    for (const candidate of race.candidates) {
      console.log(`  👤 ${candidate.name} (${candidate.party}) — ${candidate.topics.length} topics`);
      const blurbs = await generateBlurbs(race, candidate, hits);
      console.log(`     ✅ ${blurbs.length} blurbs generated`);

      const topicBlurbs: Record<string, OutputBlurb> = {};
      for (const b of blurbs) {
        const citations = b.sourceIndices
          .map((i) => hits[i - 1]) // 1-based → 0-based
          .filter((h): h is PineconeHit => h != null && h.url !== "")
          .map((h) => ({ title: h.title, url: h.url }));

        topicBlurbs[b.topic] = { text: b.text, citations };
      }

      outCandidates.push({ name: candidate.name, topicBlurbs });
    }

    results.push({ raceId: race.id, candidates: outCandidates });
  }

  const outPath = "scripts/generated-blurbs.json";
  writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\n✅ Written to ${outPath}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});

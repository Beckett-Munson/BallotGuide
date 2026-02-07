/**
 * ONE-TIME script: runs 3 LLM prompts against Pinecone context.
 *
 * Usage (from project root):
 *   npx tsx scripts/generate-three-prompts.ts
 *
 * Outputs:
 *   scripts/output-home-rule-charter.json
 *   scripts/output-oconnor-budget.json
 *   scripts/output-moreno-budget.json
 */

import { config } from "dotenv";
config();

import { Pinecone } from "@pinecone-database/pinecone";
import { Dedalus } from "dedalus-labs";
import { writeFileSync } from "fs";

// ---------------------------------------------------------------------------
// Config (reused from generate-candidate-blurbs.ts)
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
// Pinecone helpers (same as generate-candidate-blurbs.ts)
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

async function queryPinecone(query: string, topK = 8): Promise<PineconeHit[]> {
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

/** Build a numbered context block from Pinecone hits */
function buildContext(hits: PineconeHit[]): string {
  if (hits.length === 0) return "(No sources retrieved)";
  let ctx = "**Related Legislation & Sources (numbered):**\n";
  for (let i = 0; i < hits.length; i++) {
    const h = hits[i];
    ctx += `\n--- [Source ${i + 1}] ${h.title}${h.url ? ` (${h.url})` : ""} ---\n${h.text}\n`;
  }
  return ctx;
}

/** Resolve sourceIndices from LLM output to real citations */
function resolveCitations(indices: number[], hits: PineconeHit[]): { title: string; url: string }[] {
  return indices
    .map((i) => hits[i - 1])
    .filter((h): h is PineconeHit => h != null && h.url !== "")
    .map((h) => ({ title: h.title, url: h.url }));
}

/** Call LLM and parse JSON response */
async function callLLM(system: string, user: string): Promise<any> {
  const response = await dedalus.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.3,
  });

  let content = (response as any).choices[0].message.content ?? "";
  content = content.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "");

  try {
    return JSON.parse(content);
  } catch {
    console.error("  ⚠️ Failed to parse JSON, returning raw text");
    return { raw: content };
  }
}

// ---------------------------------------------------------------------------
// Budget categories shared by prompts 2 & 3
// ---------------------------------------------------------------------------

const BUDGET_CATEGORIES = [
  "Health & Welfare",
  "Public Safety",
  "General Government",
  "Debt Service",
  "Public Works & Facilities",
  "Transportation",
  "Education",
  "Culture & Recreation",
  "Economic Development",
];

// ---------------------------------------------------------------------------
// Prompt 1: Home Rule Charter
// ---------------------------------------------------------------------------

async function runPrompt1() {
  console.log("\n📜 Prompt 1: Pittsburgh Home Rule Charter, Article One");
  console.log("  📡 Querying Pinecone…");
  const hits = await queryPinecone("Pittsburgh Home Rule Charter Article One Home Rule Powers Definitions", 8);
  console.log(`  📄 ${hits.length} sources retrieved`);

  const context = buildContext(hits);

  const system = `You are a neutral, nonpartisan policy analyst. Your job is to explain legislation clearly.

You MUST return ONLY valid JSON — no markdown, no code fences, no extra text.

Use ONLY the provided legislative context. Do NOT use outside knowledge or invent facts.

Return a JSON object with:
- "text": A clear 3-5 sentence explanation of what the Pittsburgh Home Rule Charter, Article One, Home Rule Powers - Definitions is, what it covers, and why it matters. Use plain everyday language.
- "sourceIndices": array of [Source N] numbers from the context that support your explanation.`;

  const user = `${context}\n\nQuestion: What is the Pittsburgh Home Rule Charter, Article One, Home Rule Powers - Definitions?`;

  console.log("  🤖 Calling LLM…");
  const result = await callLLM(system, user);

  const output = {
    prompt: "What is the Pittsburgh Home Rule Charter, Article One, Home Rule Powers - Definitions?",
    text: result.text ?? result.raw ?? "",
    citations: resolveCitations(result.sourceIndices ?? [], hits),
  };

  writeFileSync("scripts/output-home-rule-charter.json", JSON.stringify(output, null, 2));
  console.log("  ✅ Written to scripts/output-home-rule-charter.json");
}

// ---------------------------------------------------------------------------
// Prompt 2 & 3: Mayor budget impact
// ---------------------------------------------------------------------------

async function runBudgetPrompt(
  candidateName: string,
  candidateBio: string,
  outputFile: string,
) {
  console.log(`\n💰 Budget prompt: ${candidateName}`);
  console.log("  📡 Querying Pinecone…");
  const hits = await queryPinecone(
    `${candidateName} Mayor Pittsburgh budget spending fiscal policy departments`,
    8,
  );
  console.log(`  📄 ${hits.length} sources retrieved`);

  const context = buildContext(hits);

  const system = `You are a neutral, nonpartisan fiscal analyst for Allegheny County / Pittsburgh.

You MUST return ONLY valid JSON — no markdown, no code fences, no extra text.

Use the provided legislative context and the candidate's known positions. Be grounded — if the context doesn't support a specific claim, say the impact is unclear rather than speculating.

The current 2024 Allegheny County budget is $1,054,610,722 with these allocations:
- Health & Welfare: 38.60%
- Public Safety: 29.56%
- General Government: 8.59%
- Debt Service: 7.05%
- Public Works & Facilities: 5.59%
- Transportation: 4.53%
- Education: 3.03%
- Culture & Recreation: 2.75%
- Economic Development: 0.30%

Return a JSON array with one object per category. Each object must have:
- "category": the category name exactly as listed
- "text": 2-3 sentences explaining how this candidate's election would likely impact spending in this category. Plain language.
- "projectedChange": a string like "+0.5%" or "-1.2%" or "0%" representing the estimated percentage point change. Be realistic — total changes should roughly net to zero.
- "sourceIndices": array of [Source N] numbers that support this projection. If no source directly supports it, use an empty array.`;

  const user = `${context}\n\n**Candidate:** ${candidateName}\n${candidateBio}\n\nHow will the election of ${candidateName} as mayor impact spending in each of the following budget categories?\n${BUDGET_CATEGORIES.map((c) => `- ${c}`).join("\n")}`;

  console.log("  🤖 Calling LLM…");
  const result = await callLLM(system, user);

  let output: any;
  if (Array.isArray(result)) {
    output = {
      prompt: `How will the election of ${candidateName} as mayor impact the budget?`,
      candidate: candidateName,
      categories: result.map((item: any) => ({
        category: item.category,
        text: item.text,
        projectedChange: item.projectedChange,
        citations: resolveCitations(item.sourceIndices ?? [], hits),
      })),
    };
  } else {
    output = { prompt: `Budget impact for ${candidateName}`, raw: result };
  }

  writeFileSync(outputFile, JSON.stringify(output, null, 2));
  console.log(`  ✅ Written to ${outputFile}`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  await runPrompt1();

  await runBudgetPrompt(
    "Corey O'Connor",
    "Former City Council member and son of the late Mayor Bob O'Connor. Won the Democratic primary defeating incumbent Ed Gainey. Prioritizes downtown revitalization, community policing, green infrastructure, and transit investment. Positions himself as fiscally moderate.",
    "scripts/output-oconnor-budget.json",
  );

  await runBudgetPrompt(
    "Tony Moreno",
    "Former Pittsburgh police officer and 2021 mayoral candidate. Running on a law-and-order platform. Proposes reducing city taxes and fees, expanding police presence, cutting bureaucracy, and taking a business-friendly approach to regulation.",
    "scripts/output-moreno-budget.json",
  );

  console.log("\n✅ All 3 prompts complete.");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});

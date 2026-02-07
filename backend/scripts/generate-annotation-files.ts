import fs from 'fs/promises';
import path from 'path';
import * as dotenv from 'dotenv';
import { Dedalus } from 'dedalus-labs';
import { initPinecone, getPineconeService } from '../src/services/PineconeService';

dotenv.config();

const DEDALUS_API_KEY = process.env.DEDALUS_API_KEY || process.env.ANTHROPIC_API_KEY || '';
const MODEL = process.env.DEFAULT_MODEL || 'anthropic/claude-sonnet-4-5';
const PINECONE_API_KEY = process.env.PINECONE_API_KEY || '';
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || '';

if (!DEDALUS_API_KEY) {
  console.error('Missing DEDALUS_API_KEY or ANTHROPIC_API_KEY in environment.');
  process.exit(1);
}

if (!PINECONE_API_KEY || !PINECONE_INDEX_NAME) {
  console.error('Missing PINECONE_API_KEY or PINECONE_INDEX_NAME in environment.');
  process.exit(1);
}

initPinecone(PINECONE_API_KEY, PINECONE_INDEX_NAME);

const dedalus = new Dedalus({ apiKey: DEDALUS_API_KEY });

const OUTPUT_DIR = path.resolve(__dirname, '../data/generated');

const CATEGORY_LIST = [
  'Health & Welfare',
  'Public Safety',
  'General Government',
  'Debt Service',
  'Public Works & Facilities',
  'Transportation',
  'Education',
  'Culture & Recreation',
  'Economic Development',
] as const;

const prompts = [
  {
    id: 'pittsburgh_home_rule_charter',
    filename: 'pittsburgh_home_rule_charter.json',
    prompt: 'What is the Pittsburgh Home Rule Charter, Article One, Home Rule Powers - Definitions?',
    type: 'blurb' as const,
  },
  {
    id: 'corey_o_connor_budget_impact',
    filename: 'corey_o_connor_budget_impact.json',
    prompt: `How will the election of Corey O' Connor as mayor impact the budget use in the following categories?: ${CATEGORY_LIST.join(
      ', '
    )}`,
    type: 'budget' as const,
  },
  {
    id: 'tory_moreno_budget_impact',
    filename: 'tory_moreno_budget_impact.json',
    prompt: `How will the election of Tory Moreno as mayor impact the budget use in the following categories?: ${CATEGORY_LIST.join(
      ', '
    )}`,
    type: 'budget' as const,
  },
];

type Source = {
  index: number;
  title: string;
  url: string;
  excerpt: string;
};

type BlurbResult = {
  blurb: string;
  citations: number[];
};

type BudgetCategoryResult = {
  explanation: string;
  projectedChangePercent: number;
  direction: 'increase' | 'decrease' | 'no_change';
  citations: number[];
};

type BudgetResult = {
  categories: Record<string, BudgetCategoryResult>;
};

function coerceToJson(content: string): any {
  const trimmed = content
    .replace(/^```(?:json)?\s*\n?/i, '')
    .replace(/\n?```\s*$/i, '')
    .trim();
  try {
    return JSON.parse(trimmed);
  } catch (err) {
    throw new Error(`Model did not return valid JSON. Received: ${trimmed.slice(0, 500)}`);
  }
}

function mapCitations(citations: number[], sources: Source[]): { title: string; url: string }[] {
  const byIndex = new Map(sources.map((s) => [s.index, s]));
  return (citations || [])
    .map((idx) => byIndex.get(idx))
    .filter(Boolean)
    .map((source) => ({ title: source!.title, url: source!.url }));
}

function normalizeBudgetResult(raw: any): BudgetResult {
  const categories: Record<string, BudgetCategoryResult> = {};

  for (const category of CATEGORY_LIST) {
    const entry = raw?.categories?.[category];
    if (!entry) {
      categories[category] = {
        explanation: 'Insufficient sourced evidence in provided materials.',
        projectedChangePercent: 0,
        direction: 'no_change',
        citations: [],
      };
      continue;
    }

    const projected = Number(entry.projectedChangePercent);
    let direction: BudgetCategoryResult['direction'] = entry.direction;
    if (direction !== 'increase' && direction !== 'decrease' && direction !== 'no_change') {
      if (projected > 0) direction = 'increase';
      else if (projected < 0) direction = 'decrease';
      else direction = 'no_change';
    }

    categories[category] = {
      explanation: String(entry.explanation || 'Insufficient sourced evidence in provided materials.'),
      projectedChangePercent: Number.isFinite(projected) ? projected : 0,
      direction,
      citations: Array.isArray(entry.citations) ? entry.citations : [],
    };
  }

  return { categories };
}

async function retrieveSources(query: string): Promise<Source[]> {
  const pinecone = getPineconeService();
  if (!pinecone) {
    return [];
  }

  const results = await pinecone.query(query, 6);
  return results
    .filter((match) => match.metadata?.url)
    .map((match, idx) => ({
      index: idx + 1,
      title: match.metadata?.title || match.id,
      url: match.metadata?.url || '',
      excerpt: (match.text || '').slice(0, 400),
    }));
}

function buildSourceBlock(sources: Source[]): string {
  if (sources.length === 0) {
    return 'No sources available.';
  }
  return sources
    .map((s) => `Source ${s.index}: ${s.title}\nURL: ${s.url}\nExcerpt: ${s.excerpt}`)
    .join('\n\n');
}

async function generateBlurb(prompt: string, sources: Source[]): Promise<BlurbResult> {
  const system = `You are a neutral policy analyst. Return ONLY valid JSON.\n\nUse ONLY the provided sources. Do not use outside knowledge. If sources are insufficient, say so.`;

  const user = `Question:\n${prompt}\n\nSources:\n${buildSourceBlock(sources)}\n\nReturn JSON with this exact shape:\n{\n  "blurb": "2-5 sentence plain-English answer.",\n  "citations": [1,2]\n}\n\nRules:\n- citations must be a list of source numbers used.\n- If sources are insufficient, set blurb to "Insufficient sourced evidence in provided materials." and citations to [].`;

  const response = await dedalus.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    temperature: 0.2,
  });

  const content = response.choices[0].message.content || '';
  const parsed = coerceToJson(content) as BlurbResult;

  return {
    blurb: parsed.blurb || 'Insufficient sourced evidence in provided materials.',
    citations: Array.isArray(parsed.citations) ? parsed.citations : [],
  };
}

async function generateBudget(prompt: string, sources: Source[]): Promise<BudgetResult> {
  const system = `You are a neutral policy analyst. Return ONLY valid JSON.\n\nUse ONLY the provided sources. Do not use outside knowledge. If sources are insufficient, say so.`;

  const user = `Question:\n${prompt}\n\nSources:\n${buildSourceBlock(sources)}\n\nReturn JSON with this exact shape:\n{\n  "categories": {\n    "Health & Welfare": {\n      "explanation": "1-3 sentences.",\n      "projectedChangePercent": 2.5,\n      "direction": "increase",\n      "citations": [1,2]\n    }\n  }\n}\n\nRules:\n- Include ALL of these categories exactly as keys: ${CATEGORY_LIST.join(', ')}.\n- projectedChangePercent must be a number (negative for decrease).\n- direction must be one of: increase, decrease, no_change.\n- citations must be a list of source numbers used.\n- If sources are insufficient for a category, set explanation to "Insufficient sourced evidence in provided materials.", projectedChangePercent to 0, direction to "no_change", citations to [].`;

  const response = await dedalus.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    temperature: 0.2,
  });

  const content = response.choices[0].message.content || '';
  const parsed = coerceToJson(content) as BudgetResult;

  return normalizeBudgetResult(parsed);
}

async function writeOutput(filename: string, payload: unknown) {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const fullPath = path.join(OUTPUT_DIR, filename);
  await fs.writeFile(fullPath, JSON.stringify(payload, null, 2), 'utf-8');
}

async function main() {
  for (const item of prompts) {
    console.log(`Generating: ${item.id}`);
    const sources = await retrieveSources(item.prompt);

    if (item.type === 'blurb') {
      const result = await generateBlurb(item.prompt, sources);
      const output = {
        prompt: item.prompt,
        generatedAt: new Date().toISOString(),
        blurb: result.blurb,
        citations: mapCitations(result.citations, sources),
      };
      await writeOutput(item.filename, output);
      continue;
    }

    const result = await generateBudget(item.prompt, sources);
    const categories: Record<string, any> = {};

    for (const [category, data] of Object.entries(result.categories)) {
      categories[category] = {
        explanation: data.explanation,
        projectedChangePercent: data.projectedChangePercent,
        direction: data.direction,
        citations: mapCitations(data.citations, sources),
      };
    }

    const output = {
      prompt: item.prompt,
      generatedAt: new Date().toISOString(),
      categories,
    };

    await writeOutput(item.filename, output);
  }

  console.log(`Done. Files written to ${OUTPUT_DIR}`);
}

main().catch((err) => {
  console.error('Failed to generate annotation files:', err);
  process.exit(1);
});

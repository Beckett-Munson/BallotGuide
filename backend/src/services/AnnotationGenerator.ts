import { Dedalus } from 'dedalus-labs';
import { UserDemographics, Annotation, AnnotationSchema, RetrievalContext } from '../types';
import { policyRetriever } from './GraphRetriever';

export class AnnotationGenerator {
  private dedalus: Dedalus;
  private model: string;

  constructor(apiKey: string, model: string = 'anthropic/claude-sonnet-4-5') {
    this.dedalus = new Dedalus({ apiKey });
    this.model = model;
  }

  async generateAnnotation(
    policyId: string,
    demographics?: UserDemographics
  ): Promise<Annotation> {
    const context = await policyRetriever.retrieveContext(policyId, demographics);
    const prompt = this.buildAnnotationPrompt(policyId, context, demographics);

    try {
      const response = await this.dedalus.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: this.getSystemPrompt() },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
      });

      let content = response.choices[0].message.content ?? '';
content = content
  .replace(/^```(?:json)?\s*\n?/i, '')
  .replace(/\n?```\s*$/i, '');

let partialAnnotation: any;
try {
  partialAnnotation = JSON.parse(content);
} catch {
  console.error("Model returned non-JSON:", content.slice(0, 1500));
  throw new Error("Model did not return valid JSON");
}

const annotation = {
  ...partialAnnotation,
  policyId,
  generatedAt: new Date().toISOString(),
};

const parsed = AnnotationSchema.safeParse(annotation);
if (!parsed.success) {
  console.error("Zod validation failed:", parsed.error.flatten());
  console.error("Annotation object was:", annotation);
  throw new Error("Model returned JSON that did not match schema");
}

return parsed.data;

    } catch (error: any) {
      console.error('Annotation generation failed:', error?.message || String(error));
      throw new Error(error?.message || `Failed to generate annotation for policy ${policyId}`);
    }
  }

  private getSystemPrompt(): string {
    return `You are a neutral policy analyst. Your ONLY job is to return a JSON object.

You MUST return ONLY valid JSON—no markdown, no code fences, no extra text.

Use ONLY the provided policy text and retrieved materials. Do NOT use outside knowledge or invent facts/sources.

YOUR OUTPUT must be exactly this structure:

{
  "tags": ["tag1", "tag2", "tag3"],
  "howThisAffectsUser": "1-3 sentences explaining how this policy affects the user based on their demographics and interests.",
  "links": [
    { "title": "Source title", "url": "https://authoritative-url" },
    { "title": "Another source", "url": "https://url" }
  ]
}

RULES:
- tags: List of descriptive tags reflecting concrete impacts. Use as many as relevant.
- howThisAffectsUser: 1-3 sentences. When user demographics are provided, briefly mention something specific about them (e.g. location, occupation, interests) so the explanation feels personalized—then explain how the policy affects them. Quote the policy where relevant. No speculation.
- links: take the exat link from the policy text and return it in the url field. Do not make anything up. 

Return ONLY the JSON object.`;
  }
  
  

  private buildAnnotationPrompt(
    policyId: string,
    context: RetrievalContext,
    demographics?: UserDemographics
  ): string {
    let prompt = `**Full Policy Text:**
${context.policyText}
`;

    if (context.semanticMatches.length > 0) {
      prompt += `\n**Full Text of Related Policy Matches:**\n`;
      context.semanticMatches.forEach((m, i) => {
        prompt += `\n--- Match ${i + 1}: [${m.metadata?.title || m.id}] ---\n${m.text}\n`;
      });
    }

    if (demographics) {
      prompt += `\n**User Demographics:**
${this.formatDemographics(demographics)}
`;
    }

    prompt += `\nReturn the JSON annotation for this policy.`;

    return prompt;
  }

  private formatDemographics(demographics: UserDemographics): string {
    const parts: string[] = [];

    if (demographics.age) parts.push(`Age: ${demographics.age}`);
    if (demographics.zipCode) parts.push(`Location: ${demographics.zipCode}`);
    if (demographics.income) parts.push(`Income level: ${demographics.income}`);
    if (demographics.occupation) parts.push(`Occupation: ${demographics.occupation}`);
    if (demographics.education) parts.push(`Education: ${demographics.education}`);
    if (demographics.interests && demographics.interests.length > 0) {
      parts.push(`Interests: ${demographics.interests.join(', ')}`);
    }

    return parts.join('\n');
  }
}

export const annotationGenerator = (apiKey: string, model?: string) =>
  new AnnotationGenerator(apiKey, model);

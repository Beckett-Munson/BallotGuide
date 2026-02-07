import { Dedalus } from 'dedalus-labs';
import { ChatMessage, UserDemographics, Annotation, RetrievalContext } from '../types';
import { policyRetriever } from './GraphRetriever';

interface ChatContext {
  policyId: string;
  annotation?: Annotation;
  demographics?: UserDemographics;
}

export class ChatService {
  private dedalus: Dedalus;
  private model: string;
  private conversationHistory: Map<string, ChatMessage[]> = new Map();

  constructor(apiKey: string, model: string = 'anthropic/claude-sonnet-4-5') {
    this.dedalus = new Dedalus({ apiKey });
    this.model = model;
  }

  async chat(
    sessionId: string,
    userMessage: string,
    context: ChatContext
  ): Promise<{ message: string; context: string[] }> {
    const history = this.conversationHistory.get(sessionId) || [];

    const retrievalContext = await policyRetriever.retrieveContext(
      context.policyId,
      context.demographics
    );

    const systemPrompt = this.buildSystemPrompt(context, retrievalContext);

    history.push({ role: 'user', content: userMessage });

    try {
      const response = await this.dedalus.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...history,
        ],
        temperature: 0.5,
        stream: false,
      });

      const assistantMessage = response.choices[0].message.content;

      history.push({ role: 'assistant', content: assistantMessage });

      if (history.length > 20) {
        history.splice(0, history.length - 20);
      }
      this.conversationHistory.set(sessionId, history);

      const contextSources = this.extractContextSources(retrievalContext);

      return {
        message: assistantMessage,
        context: contextSources,
      };
    } catch (error) {
      console.error('Chat failed:', error);
      throw new Error('Failed to generate chat response');
    }
  }

  private buildSystemPrompt(context: ChatContext, retrievalContext: RetrievalContext): string {
    let prompt = `You are a helpful assistant answering questions about a ballot measure/policy.

**Policy Information:**
${retrievalContext.policyText}
`;

    if (retrievalContext.semanticMatches.length > 0) {
      prompt += `\n**Related Content from Other Policies:**\n`;
      prompt += retrievalContext.semanticMatches
        .map(m => `- [${m.metadata?.title || m.id}]: ${m.text.substring(0, 200)}...`)
        .join('\n');
      prompt += '\n';
    }

    if (context.annotation) {
      prompt += `\n**Previous Annotation:**
Tags: ${context.annotation.tags.join(', ')}
How this affects user: ${context.annotation.howThisAffectsUser}
`;
    }

    if (context.demographics) {
      prompt += `\n**User Demographics:**
Age: ${context.demographics.age || 'Not provided'}
Occupation: ${context.demographics.occupation || 'Not provided'}
Location: ${context.demographics.zipCode || 'Not provided'}
`;
    }

    prompt += `\n**Guidelines:**
- Answer questions factually and objectively
- Reference the policy text and related content when relevant
- Personalize responses to the user's demographics when appropriate
- If you don't know something, say so - don't make up information
- Keep responses concise but informative
- Maintain a helpful, non-partisan tone`;

    return prompt;
  }

  private extractContextSources(context: RetrievalContext): string[] {
    const sources: string[] = ['Policy text'];

    if (context.semanticMatches.length > 0) {
      const titles = context.semanticMatches.map(m => m.metadata?.title || m.id);
      sources.push(...new Set(titles));
    }

    return sources;
  }

  clearHistory(sessionId: string): void {
    this.conversationHistory.delete(sessionId);
  }

  getHistory(sessionId: string): ChatMessage[] {
    return this.conversationHistory.get(sessionId) || [];
  }
}

export const chatService = (apiKey: string, model?: string) =>
  new ChatService(apiKey, model);

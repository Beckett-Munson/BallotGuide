import { z } from 'zod';

// User Demographics Schema
export const UserDemographicsSchema = z.object({
  age: z.number().optional(),
  zipCode: z.string().optional(),
  income: z.string().optional(),
  occupation: z.string().optional(),
  education: z.string().optional(),
  interests: z.array(z.string()).optional(),
});

export type UserDemographics = z.infer<typeof UserDemographicsSchema>;

// Policy/Ballot Item Schema
export const PolicySchema = z.object({
  id: z.string(),
  title: z.string(),
  fullText: z.string(),
  type: z.enum(['proposition', 'measure', 'referendum', 'initiative']),
  jurisdiction: z.string(),
});

export type Policy = z.infer<typeof PolicySchema>;

// Annotation Schema (what the LLM generates)
export const AnnotationSchema = z.object({
  policyId: z.string(),
  tags: z.array(z.string()),
  howThisAffectsUser: z.string(),
  links: z.array(
    z.object({
      title: z.string(),
      url: z.string().url(),
    })
  ),
  generatedAt: z.string(),
});

export type Annotation = z.infer<typeof AnnotationSchema>;

// Chat Message Schema
export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

// API Request/Response Types
export interface AnnotateRequest {
  policyId: string;
  demographics?: UserDemographics;
}

export interface AnnotateResponse {
  annotation: Annotation;
  processingTimeMs: number;
}

export interface ChatRequest {
  policyId: string;
  messages: ChatMessage[];
  demographics?: UserDemographics;
}

export interface ChatResponse {
  message: string;
  context: string[];
  processingTimeMs: number;
}

// Retrieval Context (Pinecone-based)
export interface SemanticMatch {
  id: string;
  text: string;
  score: number;
  metadata?: Record<string, any>;
}

export interface RetrievalContext {
  policyText: string;
  semanticMatches: SemanticMatch[];
}

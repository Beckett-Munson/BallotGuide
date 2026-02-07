import express, { Request, Response } from 'express';
import {
  AnnotateRequest,
  AnnotateResponse,
  ChatRequest,
  ChatResponse,
  UserDemographicsSchema
} from '../types';
import { AnnotationGenerator } from '../services/AnnotationGenerator';
import { ChatService } from '../services/ChatService';
import { policyRetriever } from '../services/GraphRetriever';
import { getBallotPolicies } from '../data/ballotPolicies';

const router = express.Router();

let annotationGenerator: AnnotationGenerator;
let chatService: ChatService;

export function initializeServices(apiKey: string, model?: string) {
  annotationGenerator = new AnnotationGenerator(apiKey, model);
  chatService = new ChatService(apiKey, model);
}

/**
 * POST /api/annotate
 */
router.post('/annotate', async (req: Request, res: Response) => {
  const startTime = Date.now();

  try {
    const { policyId, demographics }: AnnotateRequest = req.body;

    if (!policyId) {
      return res.status(400).json({ error: 'policyId is required' });
    }

    let validatedDemographics;
    if (demographics) {
      const result = UserDemographicsSchema.safeParse(demographics);
      if (!result.success) {
        return res.status(400).json({
          error: 'Invalid demographics',
          details: result.error.errors
        });
      }
      validatedDemographics = result.data;
    }

    const annotation = await annotationGenerator.generateAnnotation(
      policyId,
      validatedDemographics
    );

    const processingTimeMs = Date.now() - startTime;

    const response: AnnotateResponse = {
      annotation,
      processingTimeMs,
    };

    res.json(response);
  } catch (error: any) {
    console.error('Annotation error:', error);
    res.status(500).json({
      error: 'Failed to generate annotation',
      message: error.message
    });
  }
});

/**
 * POST /api/chat
 */
router.post('/chat', async (req: Request, res: Response) => {
  const startTime = Date.now();

  try {
    const { policyId, messages, demographics }: ChatRequest = req.body;

    if (!policyId || !messages || messages.length === 0) {
      return res.status(400).json({ error: 'policyId and messages are required' });
    }

    const userMessage = messages[messages.length - 1];
    if (userMessage.role !== 'user') {
      return res.status(400).json({ error: 'Last message must be from user' });
    }

    const sessionId = `${policyId}-${req.ip}`;

    let annotation;
    try {
      annotation = await annotationGenerator.generateAnnotation(policyId, demographics);
    } catch (error) {
      console.warn('Could not fetch annotation for chat context:', error);
    }

    const result = await chatService.chat(sessionId, userMessage.content, {
      policyId,
      annotation,
      demographics,
    });

    const processingTimeMs = Date.now() - startTime;

    const response: ChatResponse = {
      message: result.message,
      context: result.context,
      processingTimeMs,
    };

    res.json(response);
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Failed to process chat',
      message: error.message
    });
  }
});

/**
 * GET /api/policies
 */
router.get('/policies', async (req: Request, res: Response) => {
  try {
    const policies = await policyRetriever.getAllPolicies();
    res.json({ policies });
  } catch (error: any) {
    console.error('Failed to fetch policies:', error);
    res.status(500).json({
      error: 'Failed to fetch policies',
      message: error.message
    });
  }
});

/**
 * GET /api/policies/search
 */
router.get('/policies/search', async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    const policies = await policyRetriever.searchPolicies(q);
    res.json({ policies, query: q });
  } catch (error: any) {
    console.error('Search failed:', error);
    res.status(500).json({
      error: 'Failed to search policies',
      message: error.message
    });
  }
});

/**
 * POST /api/legislation/fetch
 * Fetches legislation relevant to user profile, issues, keywords, and notes
 */
router.post('/legislation/fetch', async (req: Request, res: Response) => {
  try {
    const { age, district, issues = [], issueKeywordMap = {}, notes = '' } = req.body;

    const keywordParts = Object.entries(issueKeywordMap).flatMap(([issue, keywords]) =>
      Array.isArray(keywords) ? keywords : [String(keywords)]
    );
    const queryParts = [
      ...(issues as string[]),
      ...keywordParts,
      district && String(district),
      notes && String(notes),
    ].filter(Boolean);
    const query = queryParts.join(' ');

    if (!query.trim()) {
      return res.status(400).json({ error: 'At least one of issues, issueKeywordMap, district, or notes is required' });
    }

    const policies = await policyRetriever.searchPolicies(query);
    res.json({ policies, query });
  } catch (error: any) {
    console.error('Legislation fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch legislation',
      message: error.message,
    });
  }
});

/**
 * GET /api/ballot-policies
 * Returns hardcoded ballot policies (q1, q2, q3, p1, p2) for the frontend
 */
router.get('/ballot-policies', (req: Request, res: Response) => {
  try {
    const policies = getBallotPolicies();
    res.json({ policies });
  } catch (error: any) {
    console.error('Failed to fetch ballot policies:', error);
    res.status(500).json({
      error: 'Failed to fetch ballot policies',
      message: error.message,
    });
  }
});

/**
 * GET /api/health
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      annotationGenerator: !!annotationGenerator,
      chatService: !!chatService,
    }
  });
});

export default router;

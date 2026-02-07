import { getPineconeService } from './PineconeService';
import { getPolicyTextForId } from '../data/ballotPolicies';
import { UserDemographics, RetrievalContext } from '../types';

/** Derive document ID from vector id (e.g. "pa-statute-t11-chunk42" -> "pa-statute-t11") */
function getDocumentId(vectorId: string): string {
  const match = vectorId.match(/^(.+?)(?:[-_]chunk\d+)?$/);
  return match ? match[1] : vectorId;
}

/** Extract chunk index from vector id for sorting (e.g. "pa-statute-t11-chunk42" -> 42) */
function getChunkIndex(vectorId: string): number {
  const match = vectorId.match(/[-_]chunk(\d+)$/);
  return match ? parseInt(match[1], 10) : 0;
}

export class PolicyRetriever {
  /**
   * Retrieve relevant context for a policy using Pinecone semantic search.
   * Schema: vectors have id (e.g. pa-statute-t11-chunk42), metadata: text, title, type, url, source, tags, summary
   */
  async retrieveContext(
    policyId: string,
    demographics?: UserDemographics
  ): Promise<RetrievalContext> {
    // Check hardcoded ballot policies first (q1, q2, q3, p1, p2)
    const hardcodedText = getPolicyTextForId(policyId);
    if (hardcodedText) {
      const pinecone = getPineconeService();
      let semanticMatches: RetrievalContext['semanticMatches'] = [];
      if (pinecone) {
        let searchQuery = hardcodedText.substring(0, 500);
        if (demographics) {
          const parts: string[] = [];
          if (demographics.occupation) parts.push(demographics.occupation);
          if (demographics.interests?.length) parts.push(demographics.interests.join(', '));
          if (demographics.income) parts.push(`${demographics.income} income`);
          if (parts.length > 0) searchQuery += ` Relevant to: ${parts.join(', ')}`;
        }
        const results = await pinecone.query(searchQuery, 5);
        semanticMatches = results.map((m) => ({
          id: m.id,
          text: m.text,
          score: m.score,
          metadata: { title: m.metadata?.title, type: m.metadata?.type, jurisdiction: m.metadata?.source, url: m.metadata?.url },
        }));
      }
      return { policyText: hardcodedText, semanticMatches };
    }

    // Otherwise fetch from Pinecone
    const pinecone = getPineconeService();
    if (!pinecone) {
      throw new Error('Pinecone is not initialized');
    }

    const results = await pinecone.query(policyId, 30);

    const policyChunks = results.filter(
      (r) => r.id.startsWith(policyId + '-chunk') || r.id.startsWith(policyId + '_chunk') || r.id === policyId
    );

    const chunksToUse = policyChunks.length > 0 ? policyChunks : results;

    if (chunksToUse.length === 0) {
      throw new Error(`No content found for ${policyId}`);
    }

    const sortedChunks = [...chunksToUse].sort(
      (a, b) => getChunkIndex(a.id) - getChunkIndex(b.id)
    );
    const policyText = sortedChunks.map((c) => c.text).filter(Boolean).join('\n\n');

    // Build demographic-aware query for related content
    let searchQuery = policyText.substring(0, 500) || policyId;
    if (demographics) {
      const parts: string[] = [];
      if (demographics.occupation) parts.push(demographics.occupation);
      if (demographics.interests?.length) parts.push(demographics.interests.join(', '));
      if (demographics.income) parts.push(`${demographics.income} income`);
      if (parts.length > 0) {
        searchQuery += ` Relevant to: ${parts.join(', ')}`;
      }
    }

    // Find related content from other documents (exclude current doc's chunks)
    const docIdPrefix = policyChunks.length > 0 ? policyId : '';
    const semanticMatches = await pinecone.findRelatedChunks(searchQuery, docIdPrefix, 5);

    return {
      policyText,
      semanticMatches: semanticMatches.map((m) => ({
        id: m.id,
        text: m.text,
        score: m.score,
        metadata: {
          title: m.metadata?.title,
          type: m.metadata?.type,
          jurisdiction: m.metadata?.source,
          url: m.metadata?.url,
        },
      })),
    };
  }

  /**
   * Search for policies by semantic similarity
   */
  async searchPolicies(query: string): Promise<Array<{ id: string; title: string; type: string; jurisdiction: string }>> {
    const pinecone = getPineconeService();
    if (!pinecone) {
      return [];
    }

    const results = await pinecone.query(query, 15);

    // Deduplicate by document ID (derived from vector id)
    const seen = new Set<string>();
    const policies: Array<{ id: string; title: string; type: string; jurisdiction: string }> = [];

    for (const result of results) {
      const docId = getDocumentId(result.id);
      if (!seen.has(docId)) {
        seen.add(docId);
        policies.push({
          id: docId,
          title: result.metadata?.title || docId,
          type: result.metadata?.type || 'document',
          jurisdiction: result.metadata?.source || '',
        });
      }
    }

    return policies;
  }

  /**
   * Get all policies (returns unique documents from Pinecone)
   */
  async getAllPolicies(): Promise<Array<{ id: string; title: string; type: string; jurisdiction: string }>> {
    return this.searchPolicies('legal statute legislation policy');
  }
}

export const policyRetriever = new PolicyRetriever();

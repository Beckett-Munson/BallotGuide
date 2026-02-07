import { Pinecone } from '@pinecone-database/pinecone';
import { Policy } from '../types';

/** Matches the Pinecone schema: text, title, type, url, source, tags, summary */
export interface PineconeVectorMetadata {
  text?: string;
  title?: string;
  type?: string;
  date?: string;
  url?: string;
  source?: string;
  tags?: string[];
  summary?: string;
}

export class PineconeService {
  private pc: Pinecone;
  private indexName: string;
  private embeddingModel = 'llama-text-embed-v2';
  private namespaces: string[];

  constructor(apiKey: string, indexName: string, namespaces: string[] = ['legislation', 'legal-code']) {
    this.pc = new Pinecone({ apiKey });
    this.indexName = indexName;
    this.namespaces = namespaces.length > 0 ? namespaces : ['legislation', 'legal-code'];
  }

  private getIndex() {
    return this.pc.index(this.indexName);
  }

  private chunkText(text: string, maxChars = 2000): string[] {
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
    const chunks: string[] = [];
    let current = '';

    for (const para of paragraphs) {
      if (current.length + para.length + 2 > maxChars && current.length > 0) {
        chunks.push(current.trim());
        current = '';
      }
      current += (current ? '\n\n' : '') + para;
    }
    if (current.trim().length > 0) {
      chunks.push(current.trim());
    }
    if (chunks.length === 0) {
      chunks.push(text.trim());
    }

    return chunks;
  }

  private async embed(texts: string[], inputType: 'passage' | 'query'): Promise<number[][]> {
    const response = await this.pc.inference.embed({
      model: this.embeddingModel,
      inputs: texts,
      parameters: { inputType, truncate: 'END' },
    });
    return response.data.map((item: any) => item.values);
  }

  async upsertPolicy(policy: Policy): Promise<void> {
    const chunks = this.chunkText(policy.fullText);
    const embeddings = await this.embed(chunks, 'passage');

    const index = this.getIndex();
    const vectors = chunks.map((chunk, i) => ({
      id: `${policy.id}_chunk_${i}`,
      values: embeddings[i],
      metadata: {
        policyId: policy.id,
        title: policy.title,
        chunkIndex: i,
        text: chunk,
        type: policy.type,
        jurisdiction: policy.jurisdiction,
      },
    }));

    const batchSize = 100;
    for (let i = 0; i < vectors.length; i += batchSize) {
      await index.upsert({ records: vectors.slice(i, i + batchSize) });
    }

    console.log(`Upserted ${vectors.length} chunks for policy ${policy.id}`);
  }

  async query(
    queryText: string,
    topK = 5,
    filter?: Record<string, any>
  ): Promise<Array<{ id: string; text: string; score: number; metadata: PineconeVectorMetadata }>> {
    const [queryEmbedding] = await this.embed([queryText], 'query');

    const index = this.getIndex();
    const queryOptions: any = {
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
    };
    if (filter) {
      queryOptions.filter = filter;
    }

    const allMatches: Array<{ id: string; text: string; score: number; metadata: PineconeVectorMetadata }> = [];

    for (const ns of this.namespaces) {
      const options = { ...queryOptions };
      if (ns && ns.length > 0) options.namespace = ns;

      const response = await index.query(options);

      const mapped = (response.matches || []).map((match: any) => {
        const meta = match.metadata || match.fields || {};
        const vectorId = match.id || match._id || '';
        return {
          id: vectorId,
          text: meta.text || '',
          score: match.score ?? 0,
          metadata: meta as PineconeVectorMetadata,
        };
      });
      allMatches.push(...mapped);
    }

    const seen = new Set<string>();
    const deduped = allMatches.filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });

    return deduped
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  /** Get chunks, optionally excluding those belonging to a document (by id prefix) */
  async findRelatedChunks(
    queryText: string,
    excludeIdPrefix: string,
    topK = 5
  ): Promise<Array<{ id: string; text: string; score: number; metadata: PineconeVectorMetadata }>> {
    const results = await this.query(queryText, topK * 2);
    const filtered = results.filter((r) => !r.id.startsWith(excludeIdPrefix));
    return filtered.slice(0, topK);
  }
}

let instance: PineconeService | null = null;

export function initPinecone(apiKey: string, indexName: string): PineconeService {
  instance = new PineconeService(apiKey, indexName);
  return instance;
}

export function getPineconeService(): PineconeService | null {
  return instance;
}

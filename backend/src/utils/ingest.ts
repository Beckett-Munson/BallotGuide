import dotenv from 'dotenv';
import { Policy } from '../types';
import { initPinecone } from '../services/PineconeService';
import * as fs from 'fs/promises';

dotenv.config();

/**
 * Load policies from JSON file and upsert to Pinecone
 */
export async function ingestPolicies(filePath: string): Promise<void> {
  const pineconeApiKey = process.env.PINECONE_API_KEY;
  const pineconeIndexName = process.env.PINECONE_INDEX_NAME;

  if (!pineconeApiKey || !pineconeIndexName) {
    throw new Error('PINECONE_API_KEY and PINECONE_INDEX_NAME must be set');
  }

  const pinecone = initPinecone(pineconeApiKey, pineconeIndexName);

  console.log(`Loading policies from ${filePath}...`);

  const fileContent = await fs.readFile(filePath, 'utf-8');
  const policies: Policy[] = JSON.parse(fileContent);

  console.log(`Found ${policies.length} policies to ingest`);

  for (let i = 0; i < policies.length; i++) {
    const policy = policies[i];
    console.log(`\n[${i + 1}/${policies.length}] Processing: ${policy.id} - ${policy.title}`);

    try {
      await pinecone.upsertPolicy(policy);
      console.log(`Successfully upserted ${policy.id}`);
    } catch (error: any) {
      console.error(`Failed to upsert ${policy.id}:`, error.message);
    }
  }

  console.log('\nIngestion complete!');
}

// CLI interface
if (require.main === module) {
  const command = process.argv[2];
  const filePath = process.argv[3];

  if (command === 'ingest' && filePath) {
    ingestPolicies(filePath)
      .then(() => {
        console.log('\nDone!');
        process.exit(0);
      })
      .catch(error => {
        console.error('\nIngestion failed:', error);
        process.exit(1);
      });
  } else {
    console.log(`
Usage:
  npm run ingest <path-to-policies.json>  - Ingest policies into Pinecone

Example:
  npm run ingest ./data/seed_policies.json
    `);
    process.exit(1);
  }
}

/**
 * Quick terminal test for ChatService.
 * Usage (from backend/): npx tsx src/test-chat.ts [question]
 * Example: npx tsx src/test-chat.ts "What does this measure do?"
 */
import "dotenv/config";
import { initPinecone } from "./services/PineconeService";
import { ChatService } from "./services/ChatService";

const apiKey = process.env.DEDALUS_API_KEY || process.env.ANTHROPIC_API_KEY;
const policyId = process.env.TEST_POLICY_ID || "q1";
const question = process.argv.slice(2).join(" ") || "What is this ballot measure about?";

if (!apiKey) {
  console.error("Set DEDALUS_API_KEY or ANTHROPIC_API_KEY in .env");
  process.exit(1);
}

const pineconeKey = process.env.PINECONE_API_KEY;
const pineconeIndex = process.env.PINECONE_INDEX_NAME;
if (pineconeKey && pineconeIndex) {
  initPinecone(pineconeKey, pineconeIndex);
} else {
  console.error("Set PINECONE_API_KEY and PINECONE_INDEX_NAME in .env for RAG.");
  process.exit(1);
}

const chat = new ChatService(apiKey, process.env.DEFAULT_MODEL || undefined);

async function main() {
  console.log("Asking:", question);
  console.log("Policy ID:", policyId);
  console.log("---");
  const result = await chat.chat("test-session", policyId, question);
  console.log("Answer:", result.answer);
  console.log("Citations:", result.citations.length);
  result.citations.forEach((c, i) => console.log(`  ${i + 1}. ${c.title} (score ${c.score.toFixed(2)})`));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

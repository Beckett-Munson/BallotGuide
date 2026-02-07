/**
 * Test script for AnnotationGenerator.
 *
 * Run from the project root:
 *   npx tsx src/services/testAnnotationGenerator.ts
 *
 * Requires a .env file at the project root with:
 *   VITE_DEDALUS_API_KEY=...
 *   VITE_PINECONE_API_KEY=...
 *   VITE_PINECONE_INDEX_NAME=...
 */

import * as dotenv from "dotenv";
dotenv.config();

import { AnnotationGenerator } from "./AnnotationGenerator";
import type { UserProfile, Policy } from "../types/ballot";

// ---- Config from env ----

const DEDALUS_API_KEY = process.env.VITE_DEDALUS_API_KEY ?? "";
const PINECONE_API_KEY = process.env.VITE_PINECONE_API_KEY ?? "";
const PINECONE_INDEX_NAME = process.env.VITE_PINECONE_INDEX_NAME ?? "";

if (!DEDALUS_API_KEY || !PINECONE_API_KEY || !PINECONE_INDEX_NAME) {
  console.error(
    "Missing environment variables. Make sure .env contains:\n" +
      "  VITE_DEDALUS_API_KEY\n" +
      "  VITE_PINECONE_API_KEY\n" +
      "  VITE_PINECONE_INDEX_NAME\n"
  );
  process.exit(1);
}

// ---- Example data ----

const exampleProfile: UserProfile = {
  age: 22,
  zipCode: "15213",
  aboutYou: "I am a college student at the University of Pittsburgh interested in local government.",
  issues: {
    housing: ["rent", "affordable housing", "student housing"],
    water: ["public utilities", "water quality", "sewer"],
    "local government": ["city charter", "elections", "non-discrimination"],
  },
};

const examplePolicies: Policy[] = [
  {
    id: "q1",
    title: "Non-Discrimination in City Business and Foreign State Affiliations Amendment",
    question:
      'Shall the Pittsburgh Home Rule Charter, Article One, Home Rule Powers - Definitions, be supplemented by adding a new Section, "105. Local Governance", by prohibiting the discrimination on the basis of race, religion, ancestry, sex, sexual orientation, age, gender identity or expression, disability, place of birth, national origin or association or affiliation with any nation or foreign state in conducting business of the City?',
  },
  {
    id: "q2",
    title: "Public Ownership of Water and Sewer Systems",
    question:
      "Shall the Pittsburgh Home Rule Charter be amended and supplemented by adding a new Article 11: RIGHT TO PUBLIC OWNERSHIP OF POTABLE WATER SYSTEMS, WASTEWATER SYSTEM, AND STORM SEWER SYSTEMS, which restricts the lease and/or sale of the City's water and sewer system to private entities?",
  },
  {
    id: "q3",
    title: "Prohibit the Use of the Charter Amendment Process to Add Duties Beyond the Scope of City Authority",
    question:
      'Shall the Pittsburgh Home Rule Charter, Article One, Home Rule Powers - Definitions, be supplemented by adding a new section, "104. Amendments to Charter", by prohibiting the use of the Home Rule Charter Amendment process to add duties or obligations beyond the lawful scope of the city\'s authority?',
  },
];

// ---- Run ----

async function main() {
  console.log("🔧 Initialising AnnotationGenerator…\n");

  const generator = new AnnotationGenerator({
    pineconeApiKey: PINECONE_API_KEY,
    pineconeIndexName: PINECONE_INDEX_NAME,
    dedalusApiKey: DEDALUS_API_KEY,
  });

  console.log(
    `📋 Generating annotations for ${examplePolicies.length} policies…\n`
  );

  const startTime = Date.now();

  const response = await generator.getAllAnnotations(
    exampleProfile,
    examplePolicies
  );

  const elapsed = Date.now() - startTime;

  console.log(`✅ Done in ${(elapsed / 1000).toFixed(1)}s\n`);
  console.log("─".repeat(60));

  for (const [policyId, annotations] of Object.entries(response)) {
    console.log(`\n📄 Policy: ${policyId}`);
    if (annotations.length === 0) {
      console.log("   (no relevant annotations)");
      continue;
    }
    for (const ann of annotations) {
      console.log(`\n   🏷  Issue: ${ann.issues.join(", ") || "(none)"}`);
      console.log(`   📝 ${ann.annotation}`);
      if (ann.citations.length > 0) {
        console.log(`   🔗 Citations:`);
        for (const c of ann.citations) {
          console.log(`      - ${c.title}: ${c.url}`);
        }
      }
    }
    console.log("\n" + "─".repeat(60));
  }
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});

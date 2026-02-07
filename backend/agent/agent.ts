import Dedalus, { DedalusRunner } from 'dedalus-labs';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  const client = new Dedalus({
    apiKey: process.env.DEDALUS_API_KEY
  });

  const runner = new DedalusRunner(client);

  const result = await runner.run({
    input: `Based on the scraped information here,

    {
  "id": "pgh-housing-trust-2025",
  "title": "Pittsburgh Affordable Housing Trust Fund Expansion",
  "summary": "One-sentence plain English summary",
  "full_text": "The entire bill text, sections and all",
  "category": "housing",
  "topics": ["affordable-housing", "property-tax"],
  "affects": ["renters", "students", "low-income"],
  "references": [
    {
      "id": "pgh-ord-2018-housing",
      "title": "Original ordinance name",
      "summary": "What it does",
      "relationship": "AMENDS"
    }
  ],
  "geographic_scope": ["pittsburgh", "15213"],
  "estimated_impacts": {
    "renters": "Projected $50-150/mo reduction in qualifying units",
    "students": "More affordable options near campus"
  }
}
    
    from these government legislations and policies, 
    come up with annotations based on these topics that are important to me as a teacher
    at an elementary school: buying houses`,
    model: 'openai/gpt-4.1',
    stream: false,
    mcpServers: [
      'tsion/exa',
      'windsor/brave-search-mcp'
    ]
  });

  console.log(`Web Search Results:\n${(result as any).finalOutput}`);
}

main();

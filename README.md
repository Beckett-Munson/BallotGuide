#  📥  BallotGuide

## Why This Matters
Local elections have some of the lowest turnout, even though they shape the policies people feel every day.

- In the 100 largest U.S. cities, average mayoral-election turnout was **20.2%**, and **73 of 100 cities were below 25%** turnout.[1]
- Local governments control spending and policy areas tied to daily life, including schools, public safety, transportation, housing, and water infrastructure.[2]
- Climate is local too: urban systems account for **67-72%** of global greenhouse gas emissions, and local land use + transportation choices are key mitigation levers.[3][4]

Our goal: make ballots understandable and personally relevant so more people vote with confidence.

## What We Built
BallotGuide translates opaque ballot language into clear, source-grounded explanations about what each choice means for a voter's real life.

- Personalized, plain-English ballot annotations with citations
- Candidate and policy context grounded in real local legislation
- A budget-impact experience that shows predicted spending shifts by category
- A 3D city interface where policy markers are pinned to real places

[IMAGE PLACEHOLDER: Product hero screenshot or GIF]

## Technical Highlights
- Built a Pinecone vector database with **30,000+ scraped embeddings** from real local legislation and legal code.
- Added a **Dedalus agent pipeline** that queries the vector database first, then returns grounded explanations with reliable source links.
- Trained a **regression model on budget data** to predict category deltas that drive the interactive pie chart experience.
- Integrated real **3D city models** and used our agent + geo metadata to drop location-based policy annotations directly on the map.

[IMAGE PLACEHOLDER: Architecture diagram]
[IMAGE PLACEHOLDER: Budget prediction chart]
[IMAGE PLACEHOLDER: 3D map with geo-annotations]

## Stack
- React, TypeScript, Vite, Tailwind, shadcn/ui
- Pinecone vector search
- Dedalus agent orchestration
- Three.js for 3D city visualization

## Local Setup
```bash
npm install
npm run dev
```

## Sources
[1] Who Votes for Mayor? (Portland State University): https://pdxscholar.library.pdx.edu/cgi/viewcontent.cgi?referer=&httpsredir=1&article=1007&context=publicservice_pub

[2] U.S. Census Bureau, Government Finances (state and local functional spending): https://www.census.gov/programs-surveys/gov-finances.html

[3] IPCC AR6 WGIII, Chapter 8 (Urban Systems): https://www.ipcc.ch/report/ar6/wg3/chapter/chapter-8/

[4] U.S. EPA, Smart Growth and Transportation (local planning and emissions): https://www.epa.gov/smartgrowth/smart-growth-and-transportation

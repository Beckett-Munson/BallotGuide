# Ballot Annotator Backend

RAG-powered backend for generating ballot and legislation annotations. Retrieves policy text from Pinecone, then uses Claude (via Dedalus) to produce summaries, impact tags, and personalized explanations. Also supports chat for Q&A about specific policies.

---

## Tech Stack

- **Express** – HTTP API
- **Pinecone** – Vector database for semantic search over legislation (namespaces: `legislation`, `legal-code`)
- **Dedalus Labs** – LLM provider (Claude)
- **Zod** – Request validation
- **TypeScript**

---

## Prerequisites

- Node.js 18+
- Pinecone account
- Dedalus or Anthropic API key

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in your keys:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `DEDALUS_API_KEY` or `ANTHROPIC_API_KEY` | Yes | API key for LLM |
| `PINECONE_API_KEY` | Yes | Pinecone API key |
| `PINECONE_INDEX_NAME` | Yes | Pinecone index name |
| `PORT` | No | Server port (default: 3002) |
| `DEFAULT_MODEL` | No | LLM model (default: `anthropic/claude-sonnet-4-5`) |

### 3. Run the server

```bash
npm run dev
```

Server runs at `http://localhost:3002`.

---

## API Endpoints

### `GET /`

Returns API info and available endpoints.

### `GET /api/health`

Health check. Response includes service status.

```json
{
  "status": "ok",
  "timestamp": "2026-02-07T12:00:00.000Z",
  "services": {
    "annotationGenerator": true,
    "chatService": true
  }
}
```

### `GET /api/policies`

Returns unique documents from Pinecone across the `legislation` and `legal-code` namespaces.

**Response:**

```json
{
  "policies": [
    {
      "id": "pa-statute-t11",
      "title": "Title 11 - CITIES [part 54/694]",
      "type": "legal-code",
      "jurisdiction": "Pennsylvania General Assembly"
    }
  ]
}
```

### `GET /api/policies/search?q=<query>`

Semantic search over legislation. `q` is required.

**Example:**

```bash
curl "http://localhost:3002/api/policies/search?q=cities%20housing"
```

**Response:**

```json
{
  "policies": [...],
  "query": "cities housing"
}
```

### `POST /api/annotate`

Generate a structured annotation for a policy.

**Request body:**

```json
{
  "policyId": "pa-statute-t11",
  "demographics": {
    "age": 22,
    "occupation": "student",
    "zipCode": "15213",
    "income": "moderate",
    "education": "bachelor",
    "interests": ["housing", "transportation"]
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `policyId` | string | Yes | Policy/document ID (from search or policies list) |
| `demographics` | object | No | Used for personalization |

**Response:**

```json
{
  "annotation": {
    "policyId": "pa-statute-t11",
    "summary": "2-3 sentence summary",
    "impactTags": [
      {
        "icon": "🏛️",
        "label": "Local Government",
        "detail": "Impact description",
        "relevanceScore": 0.8
      }
    ],
    "personalizedExplanation": "2-3 paragraph explanation tailored to user",
    "keyPoints": ["point 1", "point 2", "..."],
    "relatedLaws": [
      { "id": "...", "title": "...", "relationship": "amends|references|related" }
    ],
    "sources": [
      { "title": "...", "url": "https://...", "section": "..." }
    ],
    "generatedAt": "2026-02-07T12:00:00.000Z"
  },
  "processingTimeMs": 25000
}
```

### `POST /api/chat`

Chat with the LLM about a policy.

**Request body:**

```json
{
  "policyId": "pa-statute-t11",
  "messages": [
    { "role": "user", "content": "What does this say about city elections?" }
  ],
  "demographics": { "occupation": "teacher" }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `policyId` | string | Yes | Policy to discuss |
| `messages` | array | Yes | Chat history; last message must be from user |
| `demographics` | object | No | Optional personalization |

**Response:**

```json
{
  "message": "Assistant reply text",
  "context": ["Policy text", "Related document titles..."],
  "processingTimeMs": 15000
}
```

---

## Architecture

### Data flow

```
Frontend Request
       │
       ▼
   API Routes (api.ts)
       │
       ├──► PolicyRetriever (GraphRetriever) ◄──► PineconeService ◄──► Pinecone
       │              │
       │              ▼
       │         RetrievalContext (policy text + related chunks)
       │
       ├──► AnnotationGenerator ──► Dedalus (Claude) ──► Annotation JSON
       │
       └──► ChatService ──► Dedalus (Claude) ──► Chat response
```

### Services

| Service | Role |
|---------|------|
| **PineconeService** | Connects to Pinecone, embeds text with `llama-text-embed-v2`, queries `legislation` and `legal-code` namespaces |
| **PolicyRetriever (GraphRetriever)** | Fetches policy text and related chunks from Pinecone; derives document IDs from vector IDs |
| **AnnotationGenerator** | Builds prompts and calls Claude to generate annotations; uses only Pinecone context (no external knowledge) |
| **ChatService** | Conversational Q&A about policies; keeps session history in memory |

### Pinecone schema

Vectors in Pinecone use metadata like:

- `text` – Chunk content
- `title` – Document title
- `type` – `legal-code` or `legislation`
- `url` – Source URL
- `source` – Jurisdiction (e.g. "Pennsylvania General Assembly")
- `tags` – Array of topics
- `summary` – Document summary

Vector IDs follow patterns such as `pa-statute-t11-chunk42` or `leg-pittsburgh-31504-chunk27`. Document IDs are derived by stripping the chunk suffix.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript |
| `npm run start` | Run compiled server |
| `npm run test:api` | Run API tests (server must be running) |
| `npm run ingest -- <path>` | Ingest policies from JSON into Pinecone |

---

## Ingest (optional)

If you maintain your own policy JSON instead of using pre-populated Pinecone data:

```bash
npm run ingest -- ./path/to/policies.json
```

Each policy must match:

```json
{
  "id": "prop-2026-housing",
  "title": "Proposition A: Affordable Housing",
  "fullText": "Full policy text...",
  "type": "proposition",
  "jurisdiction": "California"
}
```

---

## Testing

1. Start the server: `npm run dev`
2. In another terminal: `npm run test:api`

Or use curl:

```bash
# Health
curl http://localhost:3002/api/health

# Policies
curl http://localhost:3002/api/policies

# Search
curl "http://localhost:3002/api/policies/search?q=cities"

# Annotate
curl -X POST http://localhost:3002/api/annotate \
  -H "Content-Type: application/json" \
  -d '{"policyId": "pa-statute-t11"}'

# Chat
curl -X POST http://localhost:3002/api/chat \
  -H "Content-Type: application/json" \
  -d '{"policyId": "pa-statute-t11", "messages": [{"role": "user", "content": "Summarize this"}]}'
```

---

## Project structure

```
backend/
├── src/
│   ├── index.ts           # Express app, middleware, startup
│   ├── routes/
│   │   └── api.ts         # API route handlers
│   ├── services/
│   │   ├── PineconeService.ts   # Pinecone client, embedding, query
│   │   ├── GraphRetriever.ts    # Policy retrieval, search, doc ID derivation
│   │   ├── AnnotationGenerator.ts  # LLM annotation generation
│   │   └── ChatService.ts       # LLM chat
│   ├── types/
│   │   └── index.ts       # Zod schemas, types
│   └── utils/
│       └── ingest.ts      # CLI for ingesting policy JSON
├── agent/
│   └── agent.ts           # Standalone Dedalus agent (separate from API)
├── test-api.js            # API integration tests
├── .env.example
└── package.json
```

---

## Notes

- **Annotation grounding**: The LLM is instructed to use only text from Pinecone. No external facts (e.g. state names, laws) are injected.
- **Embedding model**: Uses `llama-text-embed-v2` to match the Pinecone index.
- **Namespaces**: Fixed to `legislation` and `legal-code`.
- **Chat history**: Stored in memory per session (`policyId` + IP). Cleared on restart.

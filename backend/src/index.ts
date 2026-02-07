import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter, { initializeServices } from './routes/api';
import { initPinecone } from './services/PineconeService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Initialize AI services
const DEDALUS_API_KEY = process.env.DEDALUS_API_KEY || process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.DEFAULT_MODEL || 'anthropic/claude-sonnet-4-5';

if (!DEDALUS_API_KEY) {
  console.error('ERROR: DEDALUS_API_KEY or ANTHROPIC_API_KEY must be set in environment');
  process.exit(1);
}

initializeServices(DEDALUS_API_KEY, MODEL);
console.log(`Initialized services with model: ${MODEL}`);

// Initialize Pinecone (queries legislation and legal-code namespaces)
const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME;

if (PINECONE_API_KEY && PINECONE_INDEX_NAME) {
  initPinecone(PINECONE_API_KEY, PINECONE_INDEX_NAME);
  console.log(`Pinecone initialized with index: ${PINECONE_INDEX_NAME} (namespaces: legislation, legal-code)`);
} else {
  console.error('WARNING: PINECONE_API_KEY and PINECONE_INDEX_NAME must be set for retrieval');
}

// Routes
app.use('/api', apiRouter);

app.get('/', (req, res) => {
  res.json({
    name: 'Ballot Annotator API',
    version: '1.0.0',
    description: 'Pinecone RAG-powered ballot annotation system',
    endpoints: {
      annotate: 'POST /api/annotate',
      chat: 'POST /api/chat',
      policies: 'GET /api/policies',
      search: 'GET /api/policies/search?q=query',
      health: 'GET /api/health',
    },
  });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

export default app;

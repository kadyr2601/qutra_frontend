// Qutra - Universal RAG Platform with per-API-key integrations

// Code examples (exported for docs pages)
export const codeExamples = {
  quickstart: `import { Qutra } from '@qutra/sdk'\n\nconst qutra = new Qutra({ apiKey: 'qtr_sk_...' })\n\nawait qutra.add({ content: "User prefers dark mode", userId: "user_123" })\nconst results = await qutra.search({ query: "user preferences", userId: "user_123" })`,
  addMemory: `await qutra.add({\n  content: "User prefers TypeScript",\n  userId: "user_123",\n  metadata: { source: "chat" }\n})`,
  searchMemory: `const results = await qutra.search({\n  query: "What does the user prefer?",\n  userId: "user_123",\n  limit: 5\n})`,
  restApi: `curl -X POST https://api.qutra.ai/v1/memories \\\n  -H "Authorization: Bearer qtr_sk_your_key" \\\n  -H "Content-Type: application/json" \\\n  -d '{"content": "User prefers dark mode", "userId": "user_123"}'`,
}

// Types
export type GraphType = "neo4j" | "memgraph" | "amazon_neptune" | "tigergraph"
export type GraphStatus = "connected" | "disconnected" | "syncing" | "error"
export type KnowledgeBaseType = "pinecone" | "weaviate" | "qdrant" | "milvus" | "custom"
export type KnowledgeBaseStatus = "active" | "inactive" | "indexing" | "error"
export type FileParserType = "pdf" | "docx" | "csv" | "json" | "html" | "markdown" | "all"

export interface GraphConnection {
  id: string
  name: string
  type: GraphType
  host: string
  status: GraphStatus
  nodes: number
  relationships: number
  lastSync: Date
  createdAt: Date
}

export interface KnowledgeBase {
  id: string
  name: string
  type: KnowledgeBaseType
  host: string
  status: KnowledgeBaseStatus
  documents: number
  vectors: number
  lastIndexed: Date
  createdAt: Date
}

export interface FileParserConfig {
  enabled: boolean
  supportedTypes: FileParserType[]
  maxFileSizeMB: number
  chunkSize: number
  chunkOverlap: number
}

export interface ApiKey {
  id: string
  name: string
  key: string
  maskedKey: string
  createdAt: Date
  lastUsed: Date
  requests: number
  graphConnections: GraphConnection[]
  knowledgeBases: KnowledgeBase[]
  fileParser: FileParserConfig
}

export const supportedGraphDBs = [
  { id: "neo4j", name: "Neo4j", description: "Leading graph database" },
  { id: "memgraph", name: "Memgraph", description: "Real-time graph analytics" },
  { id: "amazon_neptune", name: "Amazon Neptune", description: "Managed graph database" },
  { id: "tigergraph", name: "TigerGraph", description: "Enterprise graph platform" },
] as const

export const supportedKnowledgeBases = [
  { id: "pinecone", name: "Pinecone", description: "Vector database for ML" },
  { id: "weaviate", name: "Weaviate", description: "Open-source vector search" },
  { id: "qdrant", name: "Qdrant", description: "High-performance vector DB" },
  { id: "milvus", name: "Milvus", description: "Scalable similarity search" },
  { id: "custom", name: "Custom", description: "Your own vector store" },
] as const

export const supportedFileTypes = [
  { id: "pdf", name: "PDF", extension: ".pdf" },
  { id: "docx", name: "Word", extension: ".docx" },
  { id: "csv", name: "CSV", extension: ".csv" },
  { id: "json", name: "JSON", extension: ".json" },
  { id: "html", name: "HTML", extension: ".html" },
  { id: "markdown", name: "Markdown", extension: ".md" },
] as const

export const mockUser = {
  id: "usr_1a2b3c4d5e6f",
  email: "demo@qutra.ai",
  name: "Alex Developer",
  avatar: null,
  plan: "pro" as const,
  createdAt: new Date("2024-01-15"),
}

export const mockApiKeys: ApiKey[] = [
  {
    id: "key_1",
    name: "Production",
    key: "qtr_sk_prod_1a2b3c4d5e6f7g8h9i0j",
    maskedKey: "qtr_sk_prod_****0j",
    createdAt: new Date("2024-02-01"),
    lastUsed: new Date("2024-03-20"),
    requests: 45230,
    graphConnections: [
      {
        id: "graph_1",
        name: "Production Graph",
        type: "neo4j",
        host: "neo4j+s://prod.graph.qutra.ai",
        status: "connected",
        nodes: 125420,
        relationships: 458930,
        lastSync: new Date("2024-03-20T14:30:00"),
        createdAt: new Date("2024-01-15"),
      },
    ],
    knowledgeBases: [
      {
        id: "kb_1",
        name: "Product Docs",
        type: "pinecone",
        host: "prod-docs.pinecone.io",
        status: "active",
        documents: 2450,
        vectors: 156000,
        lastIndexed: new Date("2024-03-20T10:00:00"),
        createdAt: new Date("2024-01-20"),
      },
    ],
    fileParser: {
      enabled: true,
      supportedTypes: ["pdf", "docx", "csv", "markdown"],
      maxFileSizeMB: 50,
      chunkSize: 1000,
      chunkOverlap: 200,
    },
  },
  {
    id: "key_2",
    name: "Development",
    key: "qtr_sk_dev_9z8y7x6w5v4u3t2s1r0q",
    maskedKey: "qtr_sk_dev_****0q",
    createdAt: new Date("2024-02-15"),
    lastUsed: new Date("2024-03-19"),
    requests: 12450,
    graphConnections: [],
    knowledgeBases: [
      {
        id: "kb_3",
        name: "Test Knowledge Base",
        type: "qdrant",
        host: "localhost:6333",
        status: "active",
        documents: 150,
        vectors: 8500,
        lastIndexed: new Date("2024-03-18T12:00:00"),
        createdAt: new Date("2024-03-05"),
      },
    ],
    fileParser: {
      enabled: true,
      supportedTypes: ["all"],
      maxFileSizeMB: 100,
      chunkSize: 500,
      chunkOverlap: 100,
    },
  },
  {
    id: "key_3",
    name: "Testing",
    key: "qtr_sk_test_abcdef123456789xyz",
    maskedKey: "qtr_sk_test_****yz",
    createdAt: new Date("2024-03-01"),
    lastUsed: new Date("2024-03-18"),
    requests: 3200,
    graphConnections: [],
    knowledgeBases: [],
    fileParser: {
      enabled: false,
      supportedTypes: [],
      maxFileSizeMB: 10,
      chunkSize: 1000,
      chunkOverlap: 200,
    },
  },
]

export type Memory = {
  id: string
  content: string
  metadata: Record<string, string | number | boolean>
  userId: string
  agentId?: string
  apiKeyId?: string
  createdAt: Date
  updatedAt: Date
  memoryType: "preference" | "fact" | "interaction" | "context" | "entity" | "relationship"
  relevanceScore: number
  tokens: number
  graphLinked?: boolean
  graphNodeId?: string
  sourceFile?: string
}

export const mockMemories: Memory[] = [
  {
    id: "mem_001",
    content: "User prefers dark mode interfaces and minimal UI designs",
    metadata: { source: "chat", confidence: 0.95 },
    userId: "user_123",
    agentId: "agent_main",
    apiKeyId: "key_1",
    createdAt: new Date("2024-03-15T10:30:00"),
    updatedAt: new Date("2024-03-15T10:30:00"),
    memoryType: "preference",
    relevanceScore: 0.92,
    tokens: 45,
    graphLinked: true,
    graphNodeId: "node_usr_123_pref_1",
  },
  {
    id: "mem_002",
    content: "Prefers TypeScript over JavaScript for all projects",
    metadata: { source: "chat", confidence: 0.97 },
    userId: "user_123",
    agentId: "agent_code",
    apiKeyId: "key_1",
    createdAt: new Date("2024-03-14T09:15:00"),
    updatedAt: new Date("2024-03-14T09:15:00"),
    memoryType: "preference",
    relevanceScore: 0.91,
    tokens: 32,
    graphLinked: true,
    graphNodeId: "node_usr_123_pref_2",
  },
  {
    id: "mem_003",
    content: "API Rate Limits: Free tier - 100 req/min, Pro - 1000 req/min, Enterprise - unlimited",
    metadata: { source: "documentation", version: "2.1" },
    userId: "system",
    apiKeyId: "key_1",
    createdAt: new Date("2024-03-13T14:45:00"),
    updatedAt: new Date("2024-03-13T14:45:00"),
    memoryType: "fact",
    relevanceScore: 0.98,
    tokens: 67,
    graphLinked: true,
    graphNodeId: "node_doc_api_limits",
    sourceFile: "api-documentation.pdf",
  },
  {
    id: "mem_004",
    content: "Best practices: Chunk documents into 500-1000 token segments for optimal retrieval",
    metadata: { source: "guide", topic: "chunking" },
    userId: "system",
    apiKeyId: "key_1",
    createdAt: new Date("2024-03-12T11:20:00"),
    updatedAt: new Date("2024-03-12T11:20:00"),
    memoryType: "fact",
    relevanceScore: 0.96,
    tokens: 52,
    sourceFile: "best-practices.md",
  },
  {
    id: "mem_005",
    content: "TechCorp is an enterprise client with 50+ active users",
    metadata: { source: "crm", company_id: "techcorp_001" },
    userId: "sales_rep_1",
    apiKeyId: "key_1",
    createdAt: new Date("2024-03-11T16:00:00"),
    updatedAt: new Date("2024-03-11T16:00:00"),
    memoryType: "entity",
    relevanceScore: 0.89,
    tokens: 42,
    graphLinked: true,
    graphNodeId: "node_company_techcorp",
  },
  {
    id: "mem_006",
    content: "SDK supports Python 3.8+, Node.js 18+, and Go 1.21+",
    metadata: { source: "documentation" },
    userId: "system",
    apiKeyId: "key_1",
    createdAt: new Date("2024-03-08T08:00:00"),
    updatedAt: new Date("2024-03-08T08:00:00"),
    memoryType: "fact",
    relevanceScore: 0.95,
    tokens: 42,
  },
  {
    id: "mem_007",
    content: "Vector dimensions: 1536 for OpenAI, 768 for Cohere, 384 for MiniLM",
    metadata: { source: "technical_docs" },
    userId: "system",
    apiKeyId: "key_1",
    createdAt: new Date("2024-03-06T10:15:00"),
    updatedAt: new Date("2024-03-06T10:15:00"),
    memoryType: "fact",
    relevanceScore: 0.94,
    tokens: 46,
  },
  {
    id: "mem_008",
    content: "Batch processing limit: 100 memories per request",
    metadata: { source: "api_limits" },
    userId: "system",
    apiKeyId: "key_1",
    createdAt: new Date("2024-03-04T14:00:00"),
    updatedAt: new Date("2024-03-04T14:00:00"),
    memoryType: "fact",
    relevanceScore: 0.93,
    tokens: 32,
  },
]

export const mockAnalytics = {
  daily: [
    { date: "Mar 14", queries: 1245, memories: 89, graphOps: 234 },
    { date: "Mar 15", queries: 1456, memories: 112, graphOps: 289 },
    { date: "Mar 16", queries: 1289, memories: 78, graphOps: 198 },
    { date: "Mar 17", queries: 1678, memories: 145, graphOps: 345 },
    { date: "Mar 18", queries: 1890, memories: 167, graphOps: 412 },
    { date: "Mar 19", queries: 2134, memories: 189, graphOps: 478 },
    { date: "Mar 20", queries: 2345, memories: 201, graphOps: 523 },
  ],
  summary: {
    totalQueries: 12037,
    totalMemories: 8,
    avgLatency: 45,
    successRate: 99.8,
  },
}

export const pricingPlans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    description: "For individuals and small projects",
    features: [
      "1,000 memories",
      "100 API calls/day",
      "1 API key",
      "Community support",
      "Basic analytics",
    ],
    limits: { memories: 1000, apiCalls: 3000 },
    cta: "Get Started",
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    description: "For growing teams and applications",
    features: [
      "100,000 memories",
      "10,000 API calls/day",
      "5 API keys",
      "File Parser included",
      "Graph DB integration",
      "Priority support",
      "Advanced analytics",
    ],
    limits: { memories: 100000, apiCalls: 300000 },
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 199,
    description: "For large-scale production systems",
    features: [
      "Unlimited memories",
      "Unlimited API calls",
      "Unlimited API keys",
      "File Parser included",
      "Multiple Graph DB connections",
      "Multiple Knowledge Bases",
      "Dedicated support",
      "SLA guarantee",
      "Custom deployment",
    ],
    limits: { memories: Infinity, apiCalls: Infinity },
    cta: "Contact Sales",
  },
]

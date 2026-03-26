import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// All code examples defined locally — no external imports
const JS_EXAMPLE = `import { Qutra } from '@qutra/sdk'

const qutra = new Qutra({ apiKey: 'qtr_sk_...' })

// Add memory
await qutra.add({
  content: "User prefers dark mode",
  userId: "user_123"
})

// Search
const results = await qutra.search({
  query: "user preferences",
  userId: "user_123"
})`

const PY_EXAMPLE = `from qutra import QutraClient

client = QutraClient(api_key="qtr_sk_your_api_key")

memory = client.add(
    content="User prefers dark mode",
    user_id="user_123",
    category="preference"
)

results = client.search(
    query="What are the user's preferences?",
    user_id="user_123",
    limit=5
)

for m in results:
    print(m.content)`

const CURL_EXAMPLE = `curl -X POST https://api.qutra.ai/v1/memories \\
  -H "Authorization: Bearer qtr_sk_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": "User prefers dark mode",
    "userId": "user_123"
  }'`

const endpoints = [
  {
    method: "POST",
    path: "/v1/memories",
    title: "Add Memory",
    description: "Create a new memory entry",
    params: {
      content: "string (required) — The memory content",
      userId: "string (required) — User identifier",
      agentId: "string (optional) — Agent identifier",
      metadata: "object (optional) — Custom key-value pairs",
    },
    response: `{
  "success": true,
  "data": {
    "id": "mem_abc123",
    "content": "User prefers dark mode",
    "userId": "user_123",
    "createdAt": "2024-03-20T10:30:00Z",
    "relevanceScore": 0.95
  }
}`,
  },
  {
    method: "POST",
    path: "/v1/memories/search",
    title: "Search Memories",
    description: "Semantic search across stored memories",
    params: {
      query: "string (required) — Natural language search query",
      userId: "string (optional) — Filter by user",
      limit: "number (optional, default: 10) — Max results",
      threshold: "number (optional, default: 0.5) — Min relevance score",
    },
    response: `{
  "success": true,
  "data": {
    "results": [
      {
        "id": "mem_abc123",
        "content": "User prefers dark mode",
        "relevanceScore": 0.92
      }
    ],
    "totalResults": 1
  }
}`,
  },
  {
    method: "GET",
    path: "/v1/memories/:id",
    title: "Get Memory",
    description: "Retrieve a specific memory by ID",
    params: {
      id: "string (required) — Memory ID (path parameter)",
    },
    response: `{
  "success": true,
  "data": {
    "id": "mem_abc123",
    "content": "User prefers dark mode",
    "userId": "user_123",
    "createdAt": "2024-03-20T10:30:00Z"
  }
}`,
  },
  {
    method: "DELETE",
    path: "/v1/memories/:id",
    title: "Delete Memory",
    description: "Permanently delete a memory",
    params: {
      id: "string (required) — Memory ID (path parameter)",
    },
    response: `{
  "success": true,
  "data": { "deleted": true, "id": "mem_abc123" }
}`,
  },
]

const methodColors: Record<string, string> = {
  GET: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  POST: "bg-green-500/20 text-green-400 border-green-500/30",
  PATCH: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  DELETE: "bg-red-500/20 text-red-400 border-red-500/30",
}

export default function Page() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-4 text-3xl font-bold">API Reference</h1>
        <p className="text-lg text-muted-foreground">
          Complete reference for the Qutra REST API. All endpoints require authentication.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
          <CardDescription>Include your API key in every request</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
            <code>{"Authorization: Bearer qtr_sk_your_api_key"}</code>
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Base URL</CardTitle></CardHeader>
        <CardContent>
          <code className="rounded bg-muted px-2 py-1 text-sm">https://api.qutra.ai</code>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Endpoints</h2>
        {endpoints.map((ep) => (
          <Card key={ep.method + ep.path}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={methodColors[ep.method]}>{ep.method}</Badge>
                <code className="text-base">{ep.path}</code>
              </div>
              <CardTitle className="mt-2">{ep.title}</CardTitle>
              <CardDescription>{ep.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="mb-2 text-sm font-medium">Parameters</h4>
                <div className="rounded-lg border border-border">
                  {Object.entries(ep.params).map(([key, val], i) => (
                    <div key={key} className={`flex gap-4 p-3 ${i > 0 ? "border-t border-border" : ""}`}>
                      <code className="shrink-0 rounded bg-muted px-2 py-0.5 text-xs">{key}</code>
                      <span className="text-sm text-muted-foreground">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-medium">Response</h4>
                <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm"><code>{ep.response}</code></pre>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Code Examples</CardTitle>
          <CardDescription>Quick examples in different languages</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="js">
            <TabsList>
              <TabsTrigger value="js">JavaScript</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="curl">cURL</TabsTrigger>
            </TabsList>
            <TabsContent value="js" className="mt-4">
              <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm"><code>{JS_EXAMPLE}</code></pre>
            </TabsContent>
            <TabsContent value="python" className="mt-4">
              <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm"><code>{PY_EXAMPLE}</code></pre>
            </TabsContent>
            <TabsContent value="curl" className="mt-4">
              <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm"><code>{CURL_EXAMPLE}</code></pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Error Codes</CardTitle>
          <CardDescription>Common error responses and their meanings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border">
            {[
              { code: 400, name: "Bad Request", desc: "Invalid request body or parameters" },
              { code: 401, name: "Unauthorized", desc: "Invalid or missing API key" },
              { code: 403, name: "Forbidden", desc: "API key lacks required permissions" },
              { code: 404, name: "Not Found", desc: "Resource does not exist" },
              { code: 429, name: "Rate Limited", desc: "Too many requests" },
              { code: 500, name: "Server Error", desc: "Internal error, please retry" },
            ].map((e, i) => (
              <div key={e.code} className={`flex items-center gap-4 p-3 ${i > 0 ? "border-t border-border" : ""}`}>
                <code className="shrink-0 rounded bg-destructive/20 px-2 py-0.5 text-sm text-destructive">{e.code}</code>
                <span className="shrink-0 text-sm font-medium">{e.name}</span>
                <span className="text-sm text-muted-foreground">{e.desc}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState, useRef } from "react"
import {
  Play,
  Copy,
  Check,
  Upload,
  FileText,
  X,
  ChevronDown,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { mockApiKeys, mockMemories } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

type Method = "POST" | "GET" | "DELETE"

interface Endpoint {
  id: string
  name: string
  method: Method
  path: string
  description: string
  supportsFile?: boolean
}

const endpoints: Endpoint[] = [
  { id: "add", name: "Add Memory", method: "POST", path: "/v1/memories", description: "Store a new memory", supportsFile: true },
  { id: "search", name: "Search", method: "POST", path: "/v1/memories/search", description: "Semantic search for memories" },
  { id: "get", name: "Get Memory", method: "GET", path: "/v1/memories/{id}", description: "Retrieve a specific memory" },
  { id: "list", name: "List Memories", method: "GET", path: "/v1/memories", description: "List all memories for a user" },
  { id: "delete", name: "Delete Memory", method: "DELETE", path: "/v1/memories/{id}", description: "Remove a memory" },
  { id: "upload", name: "Upload File", method: "POST", path: "/v1/files/upload", description: "Upload and parse a document", supportsFile: true },
]

const defaultBodies: Record<string, string> = {
  add: JSON.stringify({
    messages: [
      { role: "user", content: "I prefer dark mode interfaces" },
      { role: "assistant", content: "Got it, I'll remember that preference." }
    ],
    user_id: "user_123"
  }, null, 2),
  search: JSON.stringify({
    query: "What are the user preferences?",
    user_id: "user_123",
    limit: 5
  }, null, 2),
  get: "",
  list: "",
  delete: "",
  upload: JSON.stringify({
    user_id: "user_123",
    chunk_size: 1000,
    chunk_overlap: 200
  }, null, 2),
}

export default function PlaygroundPage() {
  const [selectedKey, setSelectedKey] = useState(mockApiKeys[0])
  const [selectedEndpoint, setSelectedEndpoint] = useState(endpoints[0])
  const [requestBody, setRequestBody] = useState(defaultBodies.add)
  const [pathParams, setPathParams] = useState<Record<string, string>>({ id: "mem_001" })
  const [queryParams, setQueryParams] = useState<Record<string, string>>({ user_id: "user_123", limit: "10" })
  const [response, setResponse] = useState<string | null>(null)
  const [statusCode, setStatusCode] = useState<number | null>(null)
  const [latency, setLatency] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleEndpointChange = (endpointId: string) => {
    const endpoint = endpoints.find(e => e.id === endpointId)!
    setSelectedEndpoint(endpoint)
    setRequestBody(defaultBodies[endpointId] || "")
    setResponse(null)
    setStatusCode(null)
    setLatency(null)
    setUploadedFile(null)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSend = async () => {
    setIsLoading(true)
    const startTime = Date.now()

    // Simulate API delay
    await new Promise(r => setTimeout(r, 300 + Math.random() * 500))

    const endTime = Date.now()
    setLatency(endTime - startTime)

    // Generate mock response
    let mockResponse: object
    let status = 200

    switch (selectedEndpoint.id) {
      case "add":
        mockResponse = {
          id: `mem_${Date.now().toString(36)}`,
          memory: "User prefers dark mode interfaces",
          user_id: "user_123",
          created_at: new Date().toISOString(),
        }
        status = 201
        break
      case "search":
        mockResponse = {
          results: mockMemories.slice(0, 3).map((m, i) => ({
            id: m.id,
            memory: m.content,
            user_id: m.userId,
            score: Number((0.95 - i * 0.1).toFixed(2)),
            created_at: m.createdAt.toISOString(),
          }))
        }
        break
      case "get":
        const mem = mockMemories.find(m => m.id === pathParams.id)
        if (mem) {
          mockResponse = {
            id: mem.id,
            memory: mem.content,
            user_id: mem.userId,
            metadata: mem.metadata,
            created_at: mem.createdAt.toISOString(),
          }
        } else {
          mockResponse = { error: "Memory not found" }
          status = 404
        }
        break
      case "list":
        mockResponse = {
          memories: mockMemories.slice(0, 5).map(m => ({
            id: m.id,
            memory: m.content,
            user_id: m.userId,
            created_at: m.createdAt.toISOString(),
          })),
          total: mockMemories.length,
          page: 1,
          limit: 10,
        }
        break
      case "delete":
        mockResponse = { success: true, deleted_id: pathParams.id }
        break
      case "upload":
        if (uploadedFile) {
          mockResponse = {
            file_id: `file_${Date.now().toString(36)}`,
            filename: uploadedFile.name,
            size_bytes: uploadedFile.size,
            chunks_created: Math.ceil(uploadedFile.size / 1000),
            memories_added: Math.ceil(uploadedFile.size / 500),
            status: "processed",
          }
          status = 201
        } else {
          mockResponse = { error: "No file provided" }
          status = 400
        }
        break
      default:
        mockResponse = { error: "Unknown endpoint" }
        status = 400
    }

    setStatusCode(status)
    setResponse(JSON.stringify(mockResponse, null, 2))
    setIsLoading(false)
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 1500)
  }

  const getFullUrl = () => {
    let path = selectedEndpoint.path
    Object.entries(pathParams).forEach(([key, value]) => {
      path = path.replace(`{${key}}`, value)
    })
    const baseUrl = "https://api.qutra.ai"
    if (selectedEndpoint.method === "GET" && Object.keys(queryParams).length > 0) {
      const params = new URLSearchParams(queryParams).toString()
      return `${baseUrl}${path}?${params}`
    }
    return `${baseUrl}${path}`
  }

  const generateCurl = () => {
    let curl = `curl -X ${selectedEndpoint.method} "${getFullUrl()}" \\\n`
    curl += `  -H "Authorization: Token ${selectedKey.key}" \\\n`
    
    if (selectedEndpoint.method === "POST" && !selectedEndpoint.supportsFile) {
      curl += `  -H "Content-Type: application/json" \\\n`
      curl += `  -d '${requestBody.replace(/\n/g, "")}'`
    } else if (selectedEndpoint.supportsFile && uploadedFile) {
      curl += `  -F "file=@${uploadedFile.name}" \\\n`
      curl += `  -F "user_id=user_123"`
    } else if (selectedEndpoint.method === "POST") {
      curl += `  -H "Content-Type: application/json" \\\n`
      curl += `  -d '${requestBody.replace(/\n/g, "")}'`
    }
    
    return curl
  }

  const generatePython = () => {
    let code = `from mem0 import MemoryClient\n\n`
    code += `client = MemoryClient(api_key="${selectedKey.key}")\n\n`

    switch (selectedEndpoint.id) {
      case "add":
        code += `# Add a memory from conversation\n`
        code += `messages = [\n`
        code += `    {"role": "user", "content": "I prefer dark mode interfaces"},\n`
        code += `    {"role": "assistant", "content": "Got it, I'll remember that."}\n`
        code += `]\n`
        code += `result = client.add(messages, user_id="user_123")\n`
        code += `print(result)`
        break
      case "search":
        code += `# Search memories\n`
        code += `results = client.search(\n`
        code += `    query="What are the user preferences?",\n`
        code += `    user_id="user_123",\n`
        code += `    limit=5\n`
        code += `)\n`
        code += `print(results)`
        break
      case "get":
        code += `# Get a specific memory\n`
        code += `memory = client.get("${pathParams.id}")\n`
        code += `print(memory)`
        break
      case "list":
        code += `# List all memories for a user\n`
        code += `memories = client.get_all(user_id="user_123")\n`
        code += `print(memories)`
        break
      case "delete":
        code += `# Delete a memory\n`
        code += `client.delete("${pathParams.id}")\n`
        code += `print("Memory deleted")`
        break
      case "upload":
        code += `# Upload and parse a file\n`
        code += `with open("${uploadedFile?.name || "document.pdf"}", "rb") as f:\n`
        code += `    result = client.upload_file(f, user_id="user_123")\n`
        code += `print(result)`
        break
    }

    return code
  }

  const generateJS = () => {
    let code = `import MemoryClient from 'mem0ai';\n\n`
    code += `const client = new MemoryClient({ apiKey: '${selectedKey.key}' });\n\n`

    switch (selectedEndpoint.id) {
      case "add":
        code += `// Add a memory from conversation\n`
        code += `const messages = [\n`
        code += `  { role: 'user', content: 'I prefer dark mode interfaces' },\n`
        code += `  { role: 'assistant', content: "Got it, I'll remember that." }\n`
        code += `];\n\n`
        code += `const result = await client.add(messages, { user_id: 'user_123' });\n`
        code += `console.log(result);`
        break
      case "search":
        code += `// Search memories\n`
        code += `const results = await client.search('What are the user preferences?', {\n`
        code += `  user_id: 'user_123',\n`
        code += `  limit: 5\n`
        code += `});\n`
        code += `console.log(results);`
        break
      case "get":
        code += `// Get a specific memory\n`
        code += `const memory = await client.get('${pathParams.id}');\n`
        code += `console.log(memory);`
        break
      case "list":
        code += `// List all memories for a user\n`
        code += `const memories = await client.getAll({ user_id: 'user_123' });\n`
        code += `console.log(memories);`
        break
      case "delete":
        code += `// Delete a memory\n`
        code += `await client.delete('${pathParams.id}');\n`
        code += `console.log('Memory deleted');`
        break
      case "upload":
        code += `// Upload and parse a file\n`
        code += `const formData = new FormData();\n`
        code += `formData.append('file', fileInput.files[0]);\n`
        code += `formData.append('user_id', 'user_123');\n\n`
        code += `const result = await client.uploadFile(formData);\n`
        code += `console.log(result);`
        break
    }

    return code
  }

  const hasFileParser = selectedKey.fileParser?.enabled
  const showFileUpload = selectedEndpoint.supportsFile && hasFileParser

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">API Playground</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Test your RAG API endpoints
          </p>
        </div>
        <Select value={selectedKey.id} onValueChange={(id) => setSelectedKey(mockApiKeys.find(k => k.id === id)!)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {mockApiKeys.map(key => (
              <SelectItem key={key.id} value={key.id}>
                <div className="flex items-center gap-2">
                  <span>{key.name}</span>
                  {key.fileParser?.enabled && (
                    <Badge variant="secondary" className="text-[10px]">Parser</Badge>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Request Panel */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4">
              {/* Clean Endpoint Selector */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">Endpoint</Label>
                <Select value={selectedEndpoint.id} onValueChange={handleEndpointChange}>
                  <SelectTrigger className="w-full bg-background shadow-none border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {endpoints.map(ep => (
                      <SelectItem key={ep.id} value={ep.id}>
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "w-12 text-[10px] font-bold tracking-wider",
                            ep.method === "GET" ? "text-blue-500" : ep.method === "POST" ? "text-emerald-500" : "text-red-500"
                          )}>
                            {ep.method}
                          </span>
                          <span>{ep.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">{selectedEndpoint.description}</p>
              </div>

              {/* Minimal URL Bar */}
              <div className="flex items-center rounded-lg border border-border/60 bg-muted/30 p-1.5 shadow-sm">
                <Badge 
                  variant="outline" 
                  className={cn(
                    "px-2 py-0.5 rounded-md text-[10px] uppercase font-bold border-0",
                    selectedEndpoint.method === "GET" ? "bg-blue-500/10 text-blue-500" : 
                    selectedEndpoint.method === "POST" ? "bg-emerald-500/10 text-emerald-500" : 
                    "bg-red-500/10 text-red-500"
                  )}
                >
                  {selectedEndpoint.method}
                </Badge>
                <div className="flex-1 overflow-x-auto px-3">
                  <code className="whitespace-nowrap font-mono text-xs text-foreground/80">
                    {getFullUrl()}
                  </code>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Path Params */}
            {selectedEndpoint.path.includes("{id}") && (
              <div className="space-y-2">
                <Label className="text-xs">Memory ID</Label>
                <Input
                  value={pathParams.id}
                  onChange={(e) => setPathParams({ ...pathParams, id: e.target.value })}
                  placeholder="mem_001"
                  className="font-mono text-sm"
                />
              </div>
            )}

            {/* Query Params for GET */}
            {selectedEndpoint.method === "GET" && selectedEndpoint.id === "list" && (
              <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 text-xs">
                    <ChevronDown className={cn("h-3 w-3 transition-transform", showAdvanced && "rotate-180")} />
                    Query Parameters
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-3 pt-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label className="text-xs">user_id</Label>
                      <Input
                        value={queryParams.user_id}
                        onChange={(e) => setQueryParams({ ...queryParams, user_id: e.target.value })}
                        className="font-mono text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">limit</Label>
                      <Input
                        value={queryParams.limit}
                        onChange={(e) => setQueryParams({ ...queryParams, limit: e.target.value })}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* File Upload */}
            {showFileUpload && (
              <div className="space-y-2">
                <Label className="text-xs">File</Label>
                {uploadedFile ? (
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium">{uploadedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(uploadedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={removeFile}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-6 transition-colors hover:border-muted-foreground/50 hover:bg-muted/30"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {selectedKey.fileParser?.supportedTypes.join(", ").toUpperCase()}
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept={selectedKey.fileParser?.supportedTypes.map(t => `.${t}`).join(",")}
                  onChange={handleFileSelect}
                />
              </div>
            )}

            {/* Request Body */}
            {selectedEndpoint.method === "POST" && !showFileUpload && (
              <div className="space-y-2">
                <Label className="text-xs">Request Body</Label>
                <Textarea
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                  placeholder="{}"
                />
              </div>
            )}

            {/* File Parser Warning */}
            {selectedEndpoint.supportsFile && !hasFileParser && (
              <div className="flex items-start gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3 text-sm">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600" />
                <p className="text-yellow-600">
                  File parsing is not enabled for this API key. Enable it in API Keys settings.
                </p>
              </div>
            )}

            <Button onClick={handleSend} disabled={isLoading} className="w-full">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              Send Request
            </Button>
          </CardContent>
        </Card>

        {/* Response Panel */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Response</CardTitle>
              {statusCode !== null && (
                <div className="flex items-center gap-3">
                  <Badge variant={statusCode < 300 ? "default" : "destructive"}>
                    {statusCode}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{latency}ms</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {response ? (
              <div className="relative">
                <pre className="max-h-[400px] overflow-auto rounded-lg bg-muted p-4 font-mono text-sm">
                  {response}
                </pre>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8"
                  onClick={() => handleCopy(response, "response")}
                >
                  {copied === "response" ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ) : (
              <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed border-border">
                <p className="text-sm text-muted-foreground">Send a request to see the response</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Code Examples */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Code Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="curl">
            <TabsList>
              <TabsTrigger value="curl">cURL</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            </TabsList>
            <TabsContent value="curl" className="relative mt-4">
              <pre className="overflow-auto rounded-lg bg-muted p-4 font-mono text-sm">
                {generateCurl()}
              </pre>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 h-8 w-8"
                onClick={() => handleCopy(generateCurl(), "curl")}
              >
                {copied === "curl" ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </TabsContent>
            <TabsContent value="python" className="relative mt-4">
              <pre className="overflow-auto rounded-lg bg-muted p-4 font-mono text-sm">
                {generatePython()}
              </pre>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 h-8 w-8"
                onClick={() => handleCopy(generatePython(), "python")}
              >
                {copied === "python" ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </TabsContent>
            <TabsContent value="javascript" className="relative mt-4">
              <pre className="overflow-auto rounded-lg bg-muted p-4 font-mono text-sm">
                {generateJS()}
              </pre>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 h-8 w-8"
                onClick={() => handleCopy(generateJS(), "js")}
              >
                {copied === "js" ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

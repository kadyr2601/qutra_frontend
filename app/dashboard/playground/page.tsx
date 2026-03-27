"use client"

import { useState, useRef, useEffect } from "react"
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
  Plus,
  Trash2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

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
]

const defaultBodies: Record<string, string> = {
  add: JSON.stringify({
    messages: [
      { role: "user", content: "I prefer dark mode interfaces" },
      { role: "assistant", content: "Got it, I'll remember that preference." }
    ]
  }, null, 2),
  search: JSON.stringify({
    query: "What are the user preferences?",
    limit: 5
  }, null, 2),
  get: "",
  list: "",
  delete: "",
}

export default function PlaygroundPage() {
  const [selectedKey, setSelectedKey] = useState(mockApiKeys[0])
  const [selectedEndpoint, setSelectedEndpoint] = useState(endpoints[0])
  const [requestBody, setRequestBody] = useState(defaultBodies.add)
  const [pathParams, setPathParams] = useState<Record<string, string>>({ id: "mem_001" })
  const [queryParams, setQueryParams] = useState<Record<string, string>>({ limit: "10" })
  const [response, setResponse] = useState<string | null>(null)
  const [statusCode, setStatusCode] = useState<number | null>(null)
  const [latency, setLatency] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [customMetadata, setCustomMetadata] = useState<{ key: string, value: string }[]>([
    { key: "example_metadata", value: "12345" },
    { key: "example_department", value: "sales" }
  ])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleEndpointChange = (endpointId: string) => {
    const endpoint = endpoints.find(e => e.id === endpointId)!
    setSelectedEndpoint(endpoint)
    setRequestBody(defaultBodies[endpointId] || "")
    setResponse(null)
    setStatusCode(null)
    setLatency(null)
    setUploadedFile(null)
    setCustomMetadata([
      { key: "example_metadata", value: "12345" },
      { key: "example_department", value: "sales" }
    ])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (e.target.files) {
      setUploadedFile(e.target.files[0])
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Auto-inject context scope and dynamic metadata into request body when inputs change
  useEffect(() => {
    if (selectedEndpoint.method !== "POST") return

    try {
      const parsed = JSON.parse(requestBody || "{}")
      let modified = false

      // Handle Custom Metadata
      const validMetaPairs = customMetadata.filter(m => m.key.trim() !== "")
      if (validMetaPairs.length > 0) {
        const newMeta: Record<string, any> = {}
        validMetaPairs.forEach(m => {
          let val: any = m.value
          if (val === "true") val = true
          else if (val === "false") val = false
          else if (!isNaN(Number(val)) && val.trim() !== "") val = Number(val)
          newMeta[m.key.trim()] = val
        })
        if (JSON.stringify(parsed.metadata) !== JSON.stringify(newMeta)) {
          parsed.metadata = newMeta
          modified = true
        }
      } else if (parsed.metadata) {
        delete parsed.metadata
        modified = true
      }

      if (modified) {
        setRequestBody(JSON.stringify(parsed, null, 2))
      }
    } catch (e) {
      // ignore invalid json while user is typing
    }
  }, [customMetadata, selectedEndpoint.method])

  const addMetadataField = () => setCustomMetadata([...customMetadata, { key: "", value: "" }])
  const removeMetadataField = (index: number) => {
    const newMeta = [...customMetadata]
    newMeta.splice(index, 1)
    setCustomMetadata(newMeta)
  }
  const updateMetadataField = (index: number, field: "key" | "value", val: string) => {
    const newMeta = [...customMetadata]
    if (field === "key") {
      newMeta[index][field] = val.toLowerCase().replace(/[^a-z0-9_]/g, '')
    } else {
      newMeta[index][field] = val
    }
    setCustomMetadata(newMeta)
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
          created_at: new Date().toISOString(),
          ...(uploadedFile ? { metadata: { attached_file: uploadedFile.name, parsed: true } } : {})
        }
        status = 201
        break
      case "search":
        mockResponse = {
          results: mockMemories.slice(0, 3).map((m, i) => ({
            id: m.id,
            memory: m.content,
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

      <div className="grid gap-6 lg:grid-cols-2 h-[calc(100vh-12rem)] min-h-[650px]">
        {/* Request Panel */}
        <Card className="flex flex-col">
          <CardHeader className="pb-4 shrink-0">
            <div className="flex flex-col gap-3">
              {/* Endpoint Row */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="sm:w-1/3">
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
                </div>
                {/* Minimal URL Bar */}
                <div className="flex-1 flex items-center rounded-lg border border-border bg-muted/30 px-3 py-1.5 shadow-sm overflow-hidden">
                  <Badge
                    variant="outline"
                    className={cn(
                      "px-2 py-0.5 rounded-md text-[10px] uppercase font-bold border-0 shrink-0",
                      selectedEndpoint.method === "GET" ? "bg-blue-500/10 text-blue-500" :
                        selectedEndpoint.method === "POST" ? "bg-emerald-500/10 text-emerald-500" :
                          "bg-red-500/10 text-red-500"
                    )}
                  >
                    {selectedEndpoint.method}
                  </Badge>
                  <code className="ml-3 truncate font-mono text-xs text-foreground/80">
                    {getFullUrl()}
                  </code>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{selectedEndpoint.description}</p>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col flex-1 gap-4 overflow-y-auto">
            {/* Headers Preview */}
            <div className="space-y-2 shrink-0">
              <Label className="text-xs">Headers</Label>
              <div className="rounded-lg border border-border bg-muted/10 p-3 space-y-2 font-mono text-xs">
                <div className="flex items-start gap-4">
                  <span className="text-foreground font-medium shrink-0 w-32">Authorization:</span>
                  <span className="text-muted-foreground truncate">Bearer {selectedKey.key}</span>
                </div>
                {selectedEndpoint.method === "POST" && !uploadedFile && (
                  <div className="flex items-start gap-4">
                    <span className="text-foreground font-medium shrink-0 w-32">Content-Type:</span>
                    <span className="text-muted-foreground">application/json</span>
                  </div>
                )}
                {selectedEndpoint.method === "POST" && uploadedFile && (
                  <div className="flex items-start gap-4">
                    <span className="text-foreground font-medium shrink-0 w-32">Content-Type:</span>
                    <span className="text-muted-foreground">multipart/form-data</span>
                  </div>
                )}
              </div>
            </div>
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
                    <ChevronDown className={cn("h-3 w-3", showAdvanced && "rotate-180")} />
                    Query Parameters
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-3 pt-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label className="text-xs">user_id</Label>
                      <Input
                        value={queryParams.user_id || ""}
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
                    className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-6"
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

            {/* Context Scope explicitly for POST methods */}
            {selectedEndpoint.method === "POST" && (
              <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-4">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Custom Context Tags</Label>
                  <Button variant="ghost" size="sm" onClick={addMetadataField} className="h-6 px-2 text-[10px] gap-1">
                    <Plus className="h-3 w-3" />
                    Add Tag
                  </Button>
                </div>

                {/* Custom Metadata Builder */}
                <div>
                  {customMetadata.length === 0 ? (
                    <div className="text-center py-4 border border-dashed border-border rounded-lg bg-background/50">
                      <p className="text-xs text-muted-foreground">No custom metadata.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 pb-1">
                      {customMetadata.map((metaAttr, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Input
                            placeholder="Key"
                            value={metaAttr.key}
                            onChange={(e) => updateMetadataField(i, "key", e.target.value)}
                            className="font-mono text-xs h-8 flex-1"
                          />
                          <span className="text-muted-foreground text-xs font-mono">=</span>
                          <Input
                            placeholder="Value"
                            value={metaAttr.value}
                            onChange={(e) => updateMetadataField(i, "value", e.target.value)}
                            className="font-mono text-xs h-8 flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                            onClick={() => removeMetadataField(i)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Request Body */}
            {selectedEndpoint.method === "POST" && (
              <div className="space-y-2">
                <Label className="text-xs">Request Body (JSON)</Label>
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

            {/* Spacer */}
            <div className="flex-1 min-h-[1rem]" />

            <div className="shrink-0 mt-auto pt-2">
              <Button onClick={handleSend} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4" />
                ) : (
                  <Play className="mr-2 h-4 w-4" />
                )}
                Send Request
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Response Panel */}
        <Card className="flex flex-col">
          <CardHeader className="pb-4 shrink-0">
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
          <CardContent className="flex-1 min-h-0 relative pb-6">
            {response ? (
              <div className="absolute inset-x-6 inset-y-0 bottom-6">
                <pre className="h-full overflow-auto rounded-lg bg-muted p-4 font-mono text-sm">
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
              <div className="absolute inset-x-6 inset-y-0 bottom-6 flex items-center justify-center rounded-lg border border-dashed border-border">
                <p className="text-sm text-muted-foreground">Send a request to see the response</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>


    </div>
  )
}

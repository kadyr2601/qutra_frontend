"use client"

import { useState } from "react"
import {
  Plus,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  MoreHorizontal,
  Check,
  AlertTriangle,
  Database,
  Network,
  FileText,
  Settings2,
  Search,
  Cpu,
  Zap,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AreaChart, Area, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  mockApiKeys,
  supportedKnowledgeBases,
  supportedFileTypes,
  type ApiKey,
  type KnowledgeBase,
  type KnowledgeBaseType,
  type FileParserType,
  type HardwareType,
  type RagType,
  type EmbeddingModelType,
} from "@/lib/mock-data"

const formatNumber = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
const formatDate = (d: Date) => d.toISOString().split("T")[0]

// Deterministic mini chart data based on ID
const getChartData = (id: string, base: number) => {
  const seed = id.charCodeAt(id.length - 1)
  return Array.from({ length: 7 }, (_, i) => ({
    day: i,
    value: Math.max(100, Math.floor(base / 30) + (Math.sin(i * seed) * (base / 100))),
  }))
}

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")
  const [newKeyFileParser, setNewKeyFileParser] = useState(false)
  const [newKeyFileTypes, setNewKeyFileTypes] = useState<FileParserType[]>(["pdf", "docx", "markdown"])
  const [createdKey, setCreatedKey] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null)

  const [newKeyHardware, setNewKeyHardware] = useState<HardwareType>("cpu")
  const [newKeyRagType, setNewKeyRagType] = useState<RagType>("regular")
  const [newKeyGraphDb, setNewKeyGraphDb] = useState(false)
  const [newKeyEmbedding, setNewKeyEmbedding] = useState<EmbeddingModelType>("local")
  const [newKeySearchDepth, setNewKeySearchDepth] = useState(1)

  // Context Scope state (Mem0)
  const [newKeyMetadata, setNewKeyMetadata] = useState<string[]>([])

  const addMetadataField = () => setNewKeyMetadata([...newKeyMetadata, ""])
  const removeMetadataField = (index: number) => {
    const newMeta = [...newKeyMetadata]
    newMeta.splice(index, 1)
    setNewKeyMetadata(newMeta)
  }
  const updateMetadataField = (index: number, val: string) => {
    const newMeta = [...newKeyMetadata]
    newMeta[index] = val.toLowerCase().replace(/[^a-z0-9_]/g, '')
    setNewKeyMetadata(newMeta)
  }

  // Add integration dialog
  const [addIntegrationDialog, setAddIntegrationDialog] = useState<{
    keyId: string
  } | null>(null)
  const [newKnowledgeBase, setNewKnowledgeBase] = useState({
    name: "",
    type: "pdf" as any,
    host: "",
  })



  const handleCreateKey = () => {
    const validMetaKeys = newKeyMetadata.filter(m => m.trim() !== "")
    const requiredMetadata = validMetaKeys.length > 0 ? validMetaKeys : undefined

    const newKey: ApiKey = {
      id: `key_${Date.now()}`,
      name: newKeyName || "New API Key",
      key: `qtr_sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      maskedKey: `qtr_sk_****${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date(),
      lastUsed: new Date(),
      requests: 0,
      hardware: newKeyHardware,
      ragType: newKeyRagType,
      graphDbEnabled: newKeyGraphDb,
      embeddingModel: newKeyEmbedding,
      searchDepth: newKeySearchDepth,
      graphConnections: [],
      knowledgeBases: [],
      fileParser: {
        enabled: newKeyFileParser,
        supportedTypes: newKeyFileParser ? newKeyFileTypes : [],
        maxFileSizeMB: 50,
        chunkSize: 1000,
        chunkOverlap: 200,
      },
      requiredMetadata,
    }

    setCreatedKey(newKey.key)
    setApiKeys([newKey, ...apiKeys])
  }

  const handleDeleteKey = (id: string) => {
    setApiKeys(apiKeys.filter((k) => k.id !== id))
    setKeyToDelete(null)
  }

  const handleCopyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const toggleKeyVisibility = (id: string) => {
    const next = new Set(visibleKeys)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setVisibleKeys(next)
  }
  const handleAddKnowledgeBase = (keyId: string) => {
    const kb: KnowledgeBase = {
      id: `kb_${Date.now()}`,
      name: newKnowledgeBase.name,
      type: newKnowledgeBase.type,
      host: newKnowledgeBase.host,
      status: "inactive",
      documents: 0,
      vectors: 0,
      lastIndexed: new Date(),
      createdAt: new Date(),
    }
    setApiKeys(
      apiKeys.map((k) =>
        k.id === keyId ? { ...k, knowledgeBases: [...k.knowledgeBases, kb] } : k
      )
    )
    setAddIntegrationDialog(null)
    setNewKnowledgeBase({ name: "", type: "pdf", host: "" })
  }

  const handleRemoveKB = (keyId: string, kbId: string) => {
    setApiKeys(
      apiKeys.map((k) =>
        k.id === keyId
          ? { ...k, knowledgeBases: k.knowledgeBases.filter((kb) => kb.id !== kbId) }
          : k
      )
    )
  }

  const toggleFileType = (type: FileParserType) => {
    setNewKeyFileTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const closeCreateDialog = () => {
    setIsCreateDialogOpen(false)
    setCreatedKey(null)
    setNewKeyName("")
    setNewKeyFileParser(false)
    setNewKeyFileTypes(["pdf", "docx", "markdown"])
    setNewKeyHardware("cpu")
    setNewKeyRagType("regular")
    setNewKeyGraphDb(false)
    setNewKeyEmbedding("local")
    setNewKeySearchDepth(1)
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Premium Dashboard Header */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-background via-muted/50 to-background p-6 shadow-2xl backdrop-blur-xl">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-[80px]" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/20 blur-[80px]" />

        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">API Keys & Agents</h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              Manage your intelligent API endpoints, hardware allocations, and connection graphs.
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="shadow-[0_0_20px_theme(colors.primary.DEFAULT/30)] transition-all hover:scale-105 hover:shadow-[0_0_30px_theme(colors.primary.DEFAULT/50)]">
                <Plus className="mr-2 h-5 w-5" /> Create New Key
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-7xl max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {!createdKey ? (
                <>
                  <DialogHeader>
                    <DialogTitle>Create Advanced API Key</DialogTitle>
                    <DialogDescription>
                      Configure hardware and RAG capabilities for this access key.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 py-2">
                    {/* LEFT COLUMN */}
                    <div className="space-y-6">
                      {/* Step 1: Hardware Compute */}
                      <div className="space-y-3">
                        <Label className="text-base font-semibold">1. Hardware Compute</Label>
                        <RadioGroup
                          value={newKeyHardware}
                          onValueChange={(v) => setNewKeyHardware(v as HardwareType)}
                          className="grid grid-cols-2 gap-4"
                        >
                          <div>
                            <RadioGroupItem value="cpu" id="hw-cpu" className="peer sr-only" />
                            <Label
                              htmlFor="hw-cpu"
                              className="flex items-start gap-4 rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:border-border cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                            >
                              <div className="mt-0.5 rounded-lg bg-muted/50 p-2.5 shrink-0">
                                <Cpu className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div className="flex flex-col space-y-1">
                                <span className="font-semibold text-sm tracking-tight">CPU Instance</span>
                                <span className="text-[11px] leading-snug text-muted-foreground font-medium">Cost-effective for standard standard loads and small KBs</span>
                              </div>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem value="gpu" id="hw-gpu" className="peer sr-only" />
                            <Label
                              htmlFor="hw-gpu"
                              className="flex items-start gap-4 rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:border-border cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                            >
                              <div className="mt-0.5 rounded-lg bg-yellow-500/10 p-2.5 shrink-0">
                                <Zap className="h-5 w-5 text-yellow-500" />
                              </div>
                              <div className="flex flex-col space-y-1">
                                <span className="font-semibold text-sm tracking-tight text-foreground">GPU Accelerated</span>
                                <span className="text-[11px] leading-snug text-muted-foreground font-medium">High performance required for deep graph indexing</span>
                              </div>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Step 2: Key Name */}
                      <div className="space-y-3">
                        <Label htmlFor="keyName" className="text-base font-semibold">2. Connection Name</Label>
                        <Input
                          id="keyName"
                          placeholder="e.g., Production Back-office"
                          value={newKeyName}
                          onChange={(e) => setNewKeyName(e.target.value)}
                        />
                      </div>
                      {/* Step 3: Required Metadata Tags */}
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <Label className="text-base font-semibold">3. Required Metadata Tags</Label>
                          <p className="text-[13px] text-muted-foreground leading-snug">
                            QUTRA uses metadata tagging to scope and isolate RAG knowledge. Any Keys defined here will become <strong>required context tags</strong> for every request made with this API Key.
                          </p>
                        </div>

                        <div className="rounded-lg border border-border bg-muted/20 p-4">
                          <div className="flex items-center justify-between mb-4">
                            <Label className="text-[11px] font-semibold text-foreground uppercase tracking-wider">Required Payload Keys</Label>
                            <Button variant="outline" size="sm" onClick={addMetadataField} className="h-7 text-xs gap-1">
                              <Plus className="h-3 w-3" />
                              Add Key
                            </Button>
                          </div>

                          {newKeyMetadata.length === 0 ? (
                            <div className="text-center py-5 border border-dashed border-border/60 rounded-lg bg-background/50">
                              <p className="text-[13px] text-muted-foreground">No required metadata tags. This API key will have global access by default.</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {newKeyMetadata.map((metaAttr, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <Input
                                    placeholder="e.g. agent_id"
                                    value={metaAttr}
                                    onChange={(e) => updateMetadataField(i, e.target.value)}
                                    className="font-mono text-xs h-9 flex-1 bg-background"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 text-muted-foreground hover:text-destructive shrink-0"
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
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="space-y-6">

                      {/* Step 4: RAG Type */}
                      <div className="space-y-3">
                        <Label className="text-base font-semibold">4. RAG Configuration</Label>
                        <RadioGroup
                          value={newKeyRagType}
                          onValueChange={(v) => setNewKeyRagType(v as RagType)}
                          className="flex flex-col space-y-3"
                        >
                          <Label htmlFor="rag-regular" className="flex items-start space-x-3 space-y-0 rounded-md border p-4 cursor-pointer hover:bg-accent/50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                            <RadioGroupItem value="regular" id="rag-regular" className="mt-1" />
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">Regular RAG</span>
                              <span className="text-xs text-muted-foreground mt-1">Standard vector search. Allows ad-hoc file parsing and querying across uploaded files.</span>
                            </div>
                          </Label>
                          <Label htmlFor="rag-kb" className="flex items-start space-x-3 space-y-0 rounded-md border p-4 cursor-pointer hover:bg-accent/50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                            <RadioGroupItem value="knowledge_base" id="rag-kb" className="mt-1" />
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">Knowledge Base RAG</span>
                              <span className="text-xs text-muted-foreground mt-1">Restricts access to pre-loaded, defined knowledge vector databases. Direct file parsing disabled.</span>
                            </div>
                          </Label>
                        </RadioGroup>
                      </div>

                      {/* File Parser Option (Only visible for Regular RAG) */}
                      {newKeyRagType === 'regular' && (
                        <div className="space-y-4 rounded-lg border border-border p-4 border-l-4 border-l-primary/50 bg-muted/20 w-full mt-2">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="flex items-center gap-2 text-sm font-semibold">
                                <FileText className="h-4 w-4" />
                                File Parser Capabilities
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                Automatically chunk, embed, and index uploaded documents for this key
                              </p>
                            </div>
                            <Switch
                              checked={newKeyFileParser}
                              onCheckedChange={setNewKeyFileParser}
                            />
                          </div>

                          {newKeyFileParser && (
                            <div className="space-y-3 pt-2">
                              <Label className="text-xs text-muted-foreground">Supported file types</Label>
                              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                                {supportedFileTypes.map(type => (
                                  <label
                                    key={type.id}
                                    className="flex cursor-pointer items-center justify-center p-2 rounded-md border border-border text-xs font-medium transition-colors hover:bg-muted/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:text-primary"
                                  >
                                    <Checkbox
                                      className="sr-only"
                                      checked={newKeyFileTypes.includes(type.id as FileParserType)}
                                      onCheckedChange={() => toggleFileType(type.id as FileParserType)}
                                    />
                                    {type.name}
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Step 5: Graph Database Integration */}
                      <div className="space-y-3">
                        <Label className="text-base font-semibold">5. Graph Database Integration</Label>
                        <div className="flex items-center justify-between rounded-lg border border-border p-4 hover:border-border/80">
                          <div className="space-y-0.5">
                            <Label className="flex items-center gap-2 cursor-pointer" onClick={() => setNewKeyGraphDb(!newKeyGraphDb)}>
                              <Network className="h-4 w-4" />
                              Enable Graph Ontology
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Allows semantic search to follow entity relationships alongside vector similarity
                            </p>
                          </div>
                          <Switch
                            checked={newKeyGraphDb}
                            onCheckedChange={setNewKeyGraphDb}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {/* Step 6: Embedding Model */}
                        <div className="space-y-3">
                          <Label className="text-base font-semibold">6. Embedding Model</Label>
                          <Select value={newKeyEmbedding} onValueChange={(v) => setNewKeyEmbedding(v as EmbeddingModelType)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="local">Local Embeddings (Nomic)</SelectItem>
                              <SelectItem value="openai">Cloud (OpenAI text-embedding-3)</SelectItem>
                              <SelectItem value="gemini">Cloud (Gemini text-embedding-004)</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground mt-1">
                            Select the base LLM embedding model for this agent.
                          </p>
                        </div>

                        {/* Step 7: Search Depth */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label className="flex items-center gap-2 text-base font-semibold">
                              <Search className="h-4 w-4" />
                              7. Agentic Search Depth
                            </Label>
                            <span className="text-sm font-medium px-2 py-1 bg-muted rounded">{newKeySearchDepth} Max</span>
                          </div>
                          <Slider
                            min={1}
                            max={5}
                            step={1}
                            value={[newKeySearchDepth]}
                            onValueChange={(val) => setNewKeySearchDepth(val[0])}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Max reasoning loops per prompt. Higher depths take longer.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={closeCreateDialog}>Cancel</Button>
                    <Button onClick={handleCreateKey}>Create</Button>
                  </DialogFooter>
                </>
              ) : (
                <>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-emerald-500" />
                      Key Created
                    </DialogTitle>
                    <DialogDescription>
                      Copy your key now. It will not be shown again.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-3">
                      <code className="flex-1 break-all font-mono text-sm">{createdKey}</code>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopyKey(createdKey, "new")}
                      >
                        {copiedId === "new" ? (
                          <Check className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="flex items-start gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3 text-sm text-yellow-600">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                      <p>Store this key securely. You will not be able to see it again.</p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={closeCreateDialog}>Done</Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {/* API Keys List */}
      <div className="space-y-4">
        {apiKeys.map((apiKey) => {
          const chartData = getChartData(apiKey.id, apiKey.requests)
          const usagePercent = Math.min(100, Math.round((apiKey.requests / 100000) * 100))

          return (
            <Card
              key={apiKey.id}
              className="overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.02)] border-muted/30 hover:border-primary/20 bg-card/40 backdrop-blur-sm"
            >
              {/* Key Header */}
              <div className="flex flex-col p-5 transition-colors hover:bg-muted/10 md:flex-row md:items-center md:gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-lg font-semibold">{apiKey.name}</span>
                    <Badge variant="outline" className={`gap-1 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider ${apiKey.hardware === 'gpu' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30' : 'bg-muted text-muted-foreground'}`}>
                      {apiKey.hardware === 'gpu' ? <Zap className="h-3 w-3" /> : <Cpu className="h-3 w-3" />}
                      {apiKey.hardware}
                    </Badge>
                    <Badge variant="secondary" className="gap-1 px-2 py-0.5 text-[10px] bg-primary/10 text-primary border-primary/20">
                      {apiKey.ragType === 'knowledge_base' ? 'KB RAG' : 'Regular RAG'}
                    </Badge>
                    {apiKey.graphDbEnabled && (
                      <Badge variant="outline" className="gap-1 px-2 py-0.5 text-[10px] text-pink-500 bg-pink-500/10 border-pink-500/30">
                        <Network className="h-3 w-3" />
                        Graph Linked
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5 rounded-md border border-border bg-background/50 px-2.5 py-1">
                      <code className="font-mono text-xs font-semibold tracking-tight text-foreground/80">
                        {visibleKeys.has(apiKey.id) ? apiKey.key : apiKey.maskedKey}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 hover:bg-transparent text-muted-foreground hover:text-foreground"
                        onClick={(e) => { e.stopPropagation(); toggleKeyVisibility(apiKey.id); }}
                      >
                        {visibleKeys.has(apiKey.id) ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </Button>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 gap-1.5 text-xs bg-background/50"
                      onClick={(e) => { e.stopPropagation(); handleCopyKey(apiKey.key, apiKey.id); }}
                    >
                      {copiedId === apiKey.id ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                      Copy
                    </Button>
                  </div>
                </div>

                <div className="mt-4 flex flex-1 items-center gap-6 md:mt-0 xl:flex-none">
                  {/* Quota Progress */}
                  <div className="hidden flex-1 space-y-1.5 xl:block min-w-[140px]">
                    <div className="flex justify-between text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      <span>Quota</span>
                      <span>{usagePercent}%</span>
                    </div>
                    <Progress value={usagePercent} className="h-1.5" />
                    <div className="text-xs text-muted-foreground">{formatNumber(apiKey.requests)} / 100k</div>
                  </div>

                  {/* Sparkline Chart */}
                  <div className="hidden h-12 w-32 xl:block shrink-0 opacity-80 mix-blend-screen dark:opacity-100 dark:mix-blend-normal">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id={`gradient-${apiKey.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="var(--primary)"
                          strokeWidth={2}
                          fill={`url(#gradient-${apiKey.id})`}
                          isAnimationActive={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex items-center justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="hover:bg-muted/50">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          onClick={() => setKeyToDelete(apiKey.id)}
                          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Revoke Key
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              {/* Expanded Content Always Open */}
              <div className="border-t border-border/40 bg-zinc-950/20 p-6">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {/* Pipeline Config */}
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="flex items-center gap-2 text-sm font-medium text-foreground/90">
                        <Settings2 className="h-4 w-4" />
                        Configuration
                      </h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/5 p-3.5 hover:bg-muted/10 transition-colors">
                        <span className="text-xs font-medium text-muted-foreground">Embedding Model</span>
                        <span className="text-xs text-foreground capitalize">{apiKey.embeddingModel}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/5 p-3.5 hover:bg-muted/10 transition-colors">
                        <span className="text-xs font-medium text-muted-foreground">Search Depth</span>
                        <span className="text-xs text-foreground">{apiKey.searchDepth} retries max</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/5 p-3.5 hover:bg-muted/10 transition-colors">
                        <span className="text-xs font-medium text-muted-foreground">Graph State</span>
                        <span className="text-xs text-foreground">{apiKey.graphDbEnabled ? "Enabled" : "Disabled"}</span>
                      </div>
                      {apiKey.requiredMetadata && apiKey.requiredMetadata.length > 0 && (
                        <div className="flex flex-col gap-2 rounded-lg border border-border/50 bg-muted/5 p-3.5 hover:bg-muted/10 transition-colors">
                          <span className="text-xs font-medium text-muted-foreground w-full">Required Metadata Tags</span>
                          <div className="flex flex-wrap gap-1.5 mt-0.5">
                            {apiKey.requiredMetadata.map((k) => (
                              <Badge key={k} variant="secondary" className="font-mono text-[10px] bg-primary/10 text-primary border-primary/20">
                                {k}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* File Parser (Only if regular RAG) */}
                  {apiKey.ragType === 'regular' && (
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="flex items-center gap-2 text-sm font-medium">
                          <FileText className="h-4 w-4" />
                          File Parser
                        </h4>
                        <Badge variant={apiKey.fileParser.enabled ? "default" : "secondary"} className="text-[10px]">
                          {apiKey.fileParser.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      {apiKey.fileParser.enabled ? (
                        <div className="rounded-lg border border-border bg-background p-3">
                          <div className="mb-2 flex flex-wrap gap-1">
                            {apiKey.fileParser.supportedTypes.map(type => (
                              <Badge key={type} variant="outline" className="text-[10px]">
                                {type.toUpperCase()}
                              </Badge>
                            ))}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Max {apiKey.fileParser.maxFileSizeMB}MB per file
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-lg border border-dashed border-border p-3 text-center text-xs text-muted-foreground">
                          File parsing disabled
                        </div>
                      )}
                    </div>
                  )}

                  {/* Knowledge Base Files */}
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="flex items-center gap-2 text-sm font-medium text-foreground/90">
                        <Database className="h-4 w-4" />
                        Knowledge Base Files
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs border border-border/50 hover:bg-muted/20"
                        onClick={() => setAddIntegrationDialog({ keyId: apiKey.id })}
                      >
                        <Plus className="mr-1 h-3 w-3" /> Upload File
                      </Button>
                    </div>
                    {apiKey.knowledgeBases.length > 0 ? (
                      <div className="space-y-3">
                        {apiKey.knowledgeBases.map((kb) => {
                          // Map existing KB mock data types to basic file display or use the assigned file type
                          const fileTypeDisplay = supportedFileTypes.find(f => f.id === (kb.type as string))?.name || "Document"
                          return (
                            <div
                              key={kb.id}
                              className="flex items-center justify-between rounded-lg border border-border bg-background p-3 hover:bg-muted/30 transition-colors"
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-primary" />
                                  <span className="text-sm font-medium">{kb.name}</span>
                                  <Badge
                                    variant={kb.status === "active" ? "default" : "secondary"}
                                    className="text-[10px]"
                                  >
                                    {kb.status === "active" ? "ready" : kb.status}
                                  </Badge>
                                </div>
                                <div className="mt-1 text-xs text-muted-foreground ml-6">
                                  {fileTypeDisplay} • {kb.vectors || Math.floor(Math.random() * 500) + 10} chunks
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                onClick={() => handleRemoveKB(apiKey.id, kb.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="rounded-lg border border-dashed border-border p-5 flex flex-col items-center justify-center text-center text-sm text-muted-foreground">
                        <Database className="h-8 w-8 mb-2 opacity-20" />
                        No files uploaded yet
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}

        {apiKeys.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No API keys. Create one to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add File Dialog */}
      <Dialog open={!!addIntegrationDialog} onOpenChange={() => setAddIntegrationDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Upload to Knowledge Base
            </DialogTitle>
            <DialogDescription>
              Upload a file to be processed and added to this agent's knowledge base.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>File Name</Label>
              <Input
                placeholder="e.g., product_manual.pdf"
                value={newKnowledgeBase.name}
                onChange={(e) =>
                  setNewKnowledgeBase({ ...newKnowledgeBase, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>File Type format</Label>
              <Select
                value={newKnowledgeBase.type}
                onValueChange={(v) =>
                  setNewKnowledgeBase({ ...newKnowledgeBase, type: v as any })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {supportedFileTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name} ({type.extension})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="border-2 border-dashed border-border bg-muted/30 p-8 rounded-lg text-center flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="rounded-full bg-primary/10 p-3 mb-3">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium">Click to select a file</p>
              <p className="text-xs text-muted-foreground mt-1">or drag and drop it here</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddIntegrationDialog(null)}>Cancel</Button>
            <Button
              onClick={() => handleAddKnowledgeBase(addIntegrationDialog!.keyId)}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!keyToDelete} onOpenChange={() => setKeyToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke API Key?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Applications using this key will stop working.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => keyToDelete && handleDeleteKey(keyToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Revoke
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}

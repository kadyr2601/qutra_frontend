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
  ChevronDown,
  ChevronRight,
  FileText,
  Settings2,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
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
import {
  mockApiKeys,
  supportedGraphDBs,
  supportedKnowledgeBases,
  supportedFileTypes,
  type ApiKey,
  type GraphConnection,
  type KnowledgeBase,
  type GraphType,
  type KnowledgeBaseType,
  type FileParserType,
} from "@/lib/mock-data"

const formatNumber = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
const formatDate = (d: Date) => d.toISOString().split("T")[0]

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys)
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set())
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")
  const [newKeyFileParser, setNewKeyFileParser] = useState(false)
  const [newKeyFileTypes, setNewKeyFileTypes] = useState<FileParserType[]>(["pdf", "docx", "markdown"])
  const [createdKey, setCreatedKey] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null)

  // Add integration dialog
  const [addIntegrationDialog, setAddIntegrationDialog] = useState<{
    keyId: string
    type: "graph" | "kb"
  } | null>(null)
  const [newGraphConnection, setNewGraphConnection] = useState({
    name: "",
    type: "neo4j" as GraphType,
    host: "",
  })
  const [newKnowledgeBase, setNewKnowledgeBase] = useState({
    name: "",
    type: "pinecone" as KnowledgeBaseType,
    host: "",
  })

  const toggleExpand = (id: string) => {
    const next = new Set(expandedKeys)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setExpandedKeys(next)
  }

  const handleCreateKey = () => {
    const newKey: ApiKey = {
      id: `key_${Date.now()}`,
      name: newKeyName || "New API Key",
      key: `qtr_sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      maskedKey: `qtr_sk_****${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date(),
      lastUsed: new Date(),
      requests: 0,
      graphConnections: [],
      knowledgeBases: [],
      fileParser: {
        enabled: newKeyFileParser,
        supportedTypes: newKeyFileParser ? newKeyFileTypes : [],
        maxFileSizeMB: 50,
        chunkSize: 1000,
        chunkOverlap: 200,
      },
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

  const handleAddGraphConnection = (keyId: string) => {
    const connection: GraphConnection = {
      id: `graph_${Date.now()}`,
      name: newGraphConnection.name,
      type: newGraphConnection.type,
      host: newGraphConnection.host,
      status: "disconnected",
      nodes: 0,
      relationships: 0,
      lastSync: new Date(),
      createdAt: new Date(),
    }
    setApiKeys(
      apiKeys.map((k) =>
        k.id === keyId ? { ...k, graphConnections: [...k.graphConnections, connection] } : k
      )
    )
    setAddIntegrationDialog(null)
    setNewGraphConnection({ name: "", type: "neo4j", host: "" })
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
    setNewKnowledgeBase({ name: "", type: "pinecone", host: "" })
  }

  const handleRemoveGraph = (keyId: string, graphId: string) => {
    setApiKeys(
      apiKeys.map((k) =>
        k.id === keyId
          ? { ...k, graphConnections: k.graphConnections.filter((g) => g.id !== graphId) }
          : k
      )
    )
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
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">API Keys</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage keys and their integrations
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" /> Create Key
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            {!createdKey ? (
              <>
                <DialogHeader>
                  <DialogTitle>Create API Key</DialogTitle>
                  <DialogDescription>
                    Configure your new API key with optional features
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="keyName">Name</Label>
                    <Input
                      id="keyName"
                      placeholder="e.g., Production"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                    />
                  </div>
                  
                  {/* File Parser Option */}
                  <div className="space-y-4 rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          File Parser
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Parse and index documents for RAG
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
                        <div className="grid grid-cols-3 gap-2">
                          {supportedFileTypes.map(type => (
                            <label
                              key={type.id}
                              className="flex cursor-pointer items-center gap-2 rounded-md border border-border p-2 text-sm transition-colors hover:bg-muted/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                            >
                              <Checkbox
                                checked={newKeyFileTypes.includes(type.id as FileParserType)}
                                onCheckedChange={() => toggleFileType(type.id as FileParserType)}
                              />
                              <span>{type.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
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

      {/* API Keys List */}
      <div className="space-y-3">
        {apiKeys.map((apiKey) => {
          const isExpanded = expandedKeys.has(apiKey.id)
          return (
            <Card key={apiKey.id}>
              {/* Key Header */}
              <div
                className="flex cursor-pointer items-center gap-4 p-4 transition-colors hover:bg-muted/30"
                onClick={() => toggleExpand(apiKey.id)}
              >
                <button className="shrink-0 text-muted-foreground">
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{apiKey.name}</span>
                    {apiKey.fileParser.enabled && (
                      <Badge variant="secondary" className="gap-1 text-[10px]">
                        <FileText className="h-3 w-3" />
                        Parser
                      </Badge>
                    )}
                    {apiKey.graphConnections.length > 0 && (
                      <Badge variant="outline" className="text-[10px]">
                        {apiKey.graphConnections.length} graph
                      </Badge>
                    )}
                    {apiKey.knowledgeBases.length > 0 && (
                      <Badge variant="outline" className="text-[10px]">
                        {apiKey.knowledgeBases.length} KB
                      </Badge>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <code className="rounded bg-muted px-2 py-0.5 font-mono text-xs">
                      {visibleKeys.has(apiKey.id) ? apiKey.key : apiKey.maskedKey}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => { e.stopPropagation(); toggleKeyVisibility(apiKey.id); }}
                    >
                      {visibleKeys.has(apiKey.id) ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => { e.stopPropagation(); handleCopyKey(apiKey.key, apiKey.id); }}
                    >
                      {copiedId === apiKey.id ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>

                <div className="hidden text-right text-sm sm:block">
                  <div className="text-muted-foreground">{formatNumber(apiKey.requests)} requests</div>
                  <div className="text-xs text-muted-foreground">Last {formatDate(apiKey.lastUsed)}</div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleCopyKey(apiKey.key, apiKey.id)}>
                      <Copy className="mr-2 h-4 w-4" /> Copy Key
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setKeyToDelete(apiKey.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Revoke Key
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-border bg-muted/20 p-4">
                  <div className="grid gap-6 lg:grid-cols-3">
                    {/* File Parser */}
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

                    {/* Graph Connections */}
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="flex items-center gap-2 text-sm font-medium">
                          <Network className="h-4 w-4" />
                          Graph DB
                        </h4>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => setAddIntegrationDialog({ keyId: apiKey.id, type: "graph" })}
                        >
                          <Plus className="mr-1 h-3 w-3" /> Add
                        </Button>
                      </div>
                      {apiKey.graphConnections.length > 0 ? (
                        <div className="space-y-2">
                          {apiKey.graphConnections.map((graph) => (
                            <div
                              key={graph.id}
                              className="flex items-center justify-between rounded-lg border border-border bg-background p-3"
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{graph.name}</span>
                                  <Badge
                                    variant={graph.status === "connected" ? "default" : "secondary"}
                                    className="text-[10px]"
                                  >
                                    {graph.status}
                                  </Badge>
                                </div>
                                <div className="mt-1 text-xs text-muted-foreground">
                                  {supportedGraphDBs.find((d) => d.id === graph.type)?.name}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => handleRemoveGraph(apiKey.id, graph.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-lg border border-dashed border-border p-3 text-center text-xs text-muted-foreground">
                          No graph connected
                        </div>
                      )}
                    </div>

                    {/* Knowledge Bases */}
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="flex items-center gap-2 text-sm font-medium">
                          <Database className="h-4 w-4" />
                          Knowledge Base
                        </h4>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => setAddIntegrationDialog({ keyId: apiKey.id, type: "kb" })}
                        >
                          <Plus className="mr-1 h-3 w-3" /> Add
                        </Button>
                      </div>
                      {apiKey.knowledgeBases.length > 0 ? (
                        <div className="space-y-2">
                          {apiKey.knowledgeBases.map((kb) => (
                            <div
                              key={kb.id}
                              className="flex items-center justify-between rounded-lg border border-border bg-background p-3"
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{kb.name}</span>
                                  <Badge
                                    variant={kb.status === "active" ? "default" : "secondary"}
                                    className="text-[10px]"
                                  >
                                    {kb.status}
                                  </Badge>
                                </div>
                                <div className="mt-1 text-xs text-muted-foreground">
                                  {supportedKnowledgeBases.find((d) => d.id === kb.type)?.name}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => handleRemoveKB(apiKey.id, kb.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-lg border border-dashed border-border p-3 text-center text-xs text-muted-foreground">
                          No KB connected
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
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

      {/* Add Integration Dialog */}
      <Dialog open={!!addIntegrationDialog} onOpenChange={() => setAddIntegrationDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add {addIntegrationDialog?.type === "graph" ? "Graph Database" : "Knowledge Base"}
            </DialogTitle>
            <DialogDescription>
              Connect a {addIntegrationDialog?.type === "graph" ? "graph database" : "knowledge base"} to this API key
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                placeholder={addIntegrationDialog?.type === "graph" ? "e.g., Production Graph" : "e.g., Product Docs"}
                value={addIntegrationDialog?.type === "graph" ? newGraphConnection.name : newKnowledgeBase.name}
                onChange={(e) =>
                  addIntegrationDialog?.type === "graph"
                    ? setNewGraphConnection({ ...newGraphConnection, name: e.target.value })
                    : setNewKnowledgeBase({ ...newKnowledgeBase, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={addIntegrationDialog?.type === "graph" ? newGraphConnection.type : newKnowledgeBase.type}
                onValueChange={(v) =>
                  addIntegrationDialog?.type === "graph"
                    ? setNewGraphConnection({ ...newGraphConnection, type: v as GraphType })
                    : setNewKnowledgeBase({ ...newKnowledgeBase, type: v as KnowledgeBaseType })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(addIntegrationDialog?.type === "graph" ? supportedGraphDBs : supportedKnowledgeBases).map((db) => (
                    <SelectItem key={db.id} value={db.id}>
                      {db.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Host / Connection String</Label>
              <Input
                placeholder={addIntegrationDialog?.type === "graph" ? "neo4j+s://..." : "https://..."}
                value={addIntegrationDialog?.type === "graph" ? newGraphConnection.host : newKnowledgeBase.host}
                onChange={(e) =>
                  addIntegrationDialog?.type === "graph"
                    ? setNewGraphConnection({ ...newGraphConnection, host: e.target.value })
                    : setNewKnowledgeBase({ ...newKnowledgeBase, host: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddIntegrationDialog(null)}>Cancel</Button>
            <Button
              onClick={() =>
                addIntegrationDialog?.type === "graph"
                  ? handleAddGraphConnection(addIntegrationDialog.keyId)
                  : handleAddKnowledgeBase(addIntegrationDialog!.keyId)
              }
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

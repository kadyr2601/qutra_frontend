"use client"

import { useState, useMemo } from "react"
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Trash2,
  Edit2,
  Copy,
  Eye,
  ChevronLeft,
  ChevronRight,
  Network,
  Sparkles,
  FileText,
  MessageCircle,
  User,
  Link2,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { mockMemories, type Memory } from "@/lib/mock-data"

const memoryTypes = ["all", "preference", "fact", "interaction", "context", "entity", "relationship"] as const
type MemoryTypeFilter = (typeof memoryTypes)[number]

const memoryTypeIcons: Record<Memory["memoryType"], React.ReactNode> = {
  preference: <Sparkles className="h-3.5 w-3.5" />,
  fact: <FileText className="h-3.5 w-3.5" />,
  interaction: <MessageCircle className="h-3.5 w-3.5" />,
  context: <User className="h-3.5 w-3.5" />,
  entity: <Network className="h-3.5 w-3.5" />,
  relationship: <Link2 className="h-3.5 w-3.5" />,
}

const memoryTypeLabels: Record<Memory["memoryType"], string> = {
  preference: "Preference",
  fact: "Fact",
  interaction: "Interaction",
  context: "Context",
  entity: "Entity",
  relationship: "Relationship",
}

const ITEMS_PER_PAGE = 12

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>(mockMemories)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<MemoryTypeFilter>("all")
  const [graphFilter, setGraphFilter] = useState<"all" | "linked" | "unlinked">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [newMemory, setNewMemory] = useState({
    content: "",
    memoryType: "fact" as Memory["memoryType"],
    userId: "user_123",
  })

  // Filter and search memories
  const filteredMemories = useMemo(() => {
    return memories.filter((memory) => {
      const matchesSearch =
        memory.content.toLowerCase().includes(search.toLowerCase()) ||
        memory.id.toLowerCase().includes(search.toLowerCase())
      const matchesType = typeFilter === "all" || memory.memoryType === typeFilter
      const matchesGraph = 
        graphFilter === "all" || 
        (graphFilter === "linked" && memory.graphLinked) ||
        (graphFilter === "unlinked" && !memory.graphLinked)
      return matchesSearch && matchesType && matchesGraph
    })
  }, [memories, search, typeFilter, graphFilter])

  // Pagination
  const totalPages = Math.ceil(filteredMemories.length / ITEMS_PER_PAGE)
  const paginatedMemories = filteredMemories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Stats
  const stats = useMemo(() => {
    const total = memories.length
    const graphLinked = memories.filter(m => m.graphLinked).length
    const totalTokens = memories.reduce((sum, m) => sum + m.tokens, 0)
    return { total, graphLinked, totalTokens }
  }, [memories])

  const typeStats = useMemo(() => {
    return Object.keys(memoryTypeLabels).map(type => ({
      type: type as Memory["memoryType"],
      count: memories.filter(m => m.memoryType === type).length,
    }))
  }, [memories])

  const handleAddMemory = () => {
    const memory: Memory = {
      id: `mem_${Date.now()}`,
      content: newMemory.content,
      memoryType: newMemory.memoryType,
      userId: newMemory.userId,
      metadata: { source: "manual", confidence: 1.0 },
      createdAt: new Date(),
      updatedAt: new Date(),
      relevanceScore: 0.95,
      tokens: Math.ceil(newMemory.content.length / 4),
    }
    setMemories([memory, ...memories])
    setNewMemory({ content: "", memoryType: "fact", userId: "user_123" })
    setIsAddDialogOpen(false)
  }

  const handleDeleteMemory = (id: string) => {
    setMemories(memories.filter((m) => m.id !== id))
  }

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Memories</h1>
          <p className="text-sm text-muted-foreground">
            Universal RAG storage with optional graph linking
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Memory
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Memory</DialogTitle>
              <DialogDescription>Create a new memory entry</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Enter memory content..."
                  value={newMemory.content}
                  onChange={(e) => setNewMemory({ ...newMemory, content: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="memoryType">Type</Label>
                  <Select
                    value={newMemory.memoryType}
                    onValueChange={(value) =>
                      setNewMemory({ ...newMemory, memoryType: value as Memory["memoryType"] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(memoryTypeLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          <div className="flex items-center gap-2">
                            {memoryTypeIcons[value as Memory["memoryType"]]}
                            {label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userId">User ID</Label>
                  <Input
                    id="userId"
                    value={newMemory.userId}
                    onChange={(e) => setNewMemory({ ...newMemory, userId: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMemory} disabled={!newMemory.content}>
                Add Memory
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{stats.total.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Total Memories</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Network className="h-5 w-5 text-muted-foreground" />
              <span className="text-3xl font-bold">{stats.graphLinked}</span>
            </div>
            <p className="text-sm text-muted-foreground">Graph Linked</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{stats.totalTokens.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Total Tokens</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-1.5">
              {typeStats.slice(0, 4).map(({ type, count }) => (
                <Badge key={type} variant="secondary" className="text-xs">
                  {memoryTypeLabels[type]}: {count}
                </Badge>
              ))}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">By Type</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search memories..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={typeFilter}
                onValueChange={(value) => {
                  setTypeFilter(value as MemoryTypeFilter)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.entries(memoryTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={graphFilter}
                onValueChange={(value) => {
                  setGraphFilter(value as "all" | "linked" | "unlinked")
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Graph" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="linked">Graph Linked</SelectItem>
                  <SelectItem value="unlinked">Not Linked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Memories List */}
      <Card>
        <CardHeader>
          <CardTitle>Memory Entries</CardTitle>
          <CardDescription>
            Showing {paginatedMemories.length} of {filteredMemories.length} memories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paginatedMemories.map((memory) => (
              <div
                key={memory.id}
                className="group flex items-start gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-secondary/30"
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                  {memoryTypeIcons[memory.memoryType]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {memoryTypeLabels[memory.memoryType]}
                    </Badge>
                    {memory.graphLinked && (
                      <Badge variant="secondary" className="gap-1 text-xs">
                        <Network className="h-3 w-3" />
                        Graph
                      </Badge>
                    )}
                    <span className="font-mono text-xs text-muted-foreground">{memory.id}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{memory.content}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>{memory.tokens} tokens</span>
                    <span>Score: {(memory.relevanceScore * 100).toFixed(0)}%</span>
                    <span>{memory.userId}</span>
                    <span>
                      {memory.createdAt.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedMemory(memory)
                        setIsViewDialogOpen(true)
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCopyId(memory.id)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy ID
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    {!memory.graphLinked && (
                      <DropdownMenuItem>
                        <Network className="mr-2 h-4 w-4" />
                        Link to Graph
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDeleteMemory(memory.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}

            {paginatedMemories.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                No memories found
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Memory Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Memory Details</DialogTitle>
            <DialogDescription className="font-mono text-xs">{selectedMemory?.id}</DialogDescription>
          </DialogHeader>
          {selectedMemory && (
            <div className="space-y-4 py-2">
              <div className="flex gap-2">
                <Badge variant="outline">
                  {memoryTypeLabels[selectedMemory.memoryType]}
                </Badge>
                {selectedMemory.graphLinked && (
                  <Badge variant="secondary" className="gap-1">
                    <Network className="h-3 w-3" />
                    Graph Linked
                  </Badge>
                )}
              </div>
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Content</Label>
                <p className="mt-1 text-sm leading-relaxed">{selectedMemory.content}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">User ID</Label>
                  <p className="mt-1 font-mono text-sm">{selectedMemory.userId}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Tokens</Label>
                  <p className="mt-1 text-sm">{selectedMemory.tokens}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Relevance</Label>
                  <p className="mt-1 text-sm">{(selectedMemory.relevanceScore * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Created</Label>
                  <p className="mt-1 text-sm">{selectedMemory.createdAt.toLocaleString()}</p>
                </div>
              </div>
              {selectedMemory.graphNodeId && (
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Graph Node ID</Label>
                  <p className="mt-1 font-mono text-sm">{selectedMemory.graphNodeId}</p>
                </div>
              )}
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Metadata</Label>
                <pre className="mt-1 overflow-x-auto rounded-md bg-secondary p-3 text-xs font-mono">
                  {JSON.stringify(selectedMemory.metadata, null, 2)}
                </pre>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

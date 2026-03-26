"use client"

import { useState, useEffect } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "next-themes"
import { mockAnalytics, mockApiKeys, mockMemories } from "@/lib/mock-data"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { Activity, Database, Zap, Clock, TrendingUp, Search, Brain } from "lucide-react"

const formatNumber = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

export default function DashboardPage() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-r-primary" />
      </div>
    )
  }

  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined

  const usageData = mockAnalytics.daily.map((day) => ({
    date: day.date,
    queries: day.queries,
    memories: day.memories,
    searches: day.graphOps,
  }))

  const memoryTypes = mockMemories.reduce((acc, m) => {
    acc[m.memoryType] = (acc[m.memoryType] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const typeData = Object.entries(memoryTypes)
    .map(([type, count]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      count,
    }))
    .sort((a, b) => b.count - a.count)

  const totalGraphNodes = mockApiKeys.reduce(
    (sum, k) => sum + k.graphConnections.reduce((s, g) => s + g.nodes, 0),
    0
  )

  const totalKnowledgeDocs = mockApiKeys.reduce(
    (sum, k) => sum + k.knowledgeBases.reduce((s, kb) => s + kb.documents, 0),
    0
  )

  // Dynamic colors based on active theme
  const MUTED     = "#64748b"
  const GRID      = isDark ? "#27272a" : "#e2e8f0" // Zinc-800 vs Slate-200
  const PRIMARY   = isDark ? "#ffffff" : "#0f172a" // White (Dark) vs Graphite (Light)
  const SECONDARY = isDark ? "#a1a1aa" : "#f59e0b" // Zinc-400 (Dark) vs Amber (Light)
  const TERTIARY  = isDark ? "#52525b" : "#f43f5e" // Zinc-600 (Dark) vs Rose (Light)
  const TEXT      = isDark ? "#fafafa" : "#334155"
  const DROPSHADOW_PRIMARY = isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(15, 23, 42, 0.2)"
  const DROPSHADOW_SECONDARY = isDark ? "rgba(161, 161, 170, 0.3)" : "rgba(245, 158, 11, 0.2)"
  const DROPSHADOW_TERTIARY = isDark ? "rgba(82, 82, 91, 0.3)" : "rgba(244, 63, 94, 0.2)"

  const axisStyle = { fill: MUTED, fontSize: 11 }

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean
    payload?: Array<{ name: string; value: number; color: string }>
    label?: string
  }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          background: isDark ? "#1a1a1a" : "#ffffff", 
          border: isDark ? "1px solid #333" : "1px solid #e2e8f0", 
          borderRadius: 6, 
          padding: "8px 12px", 
          boxShadow: isDark ? "none" : "0 4px 6px -1px rgb(0 0 0 / 0.05)" 
        }}>
          <p style={{ color: TEXT, fontSize: 11, fontWeight: 500, marginBottom: 6 }}>{label}</p>
          {payload.map((entry, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: entry.color }} />
              <span style={{ color: MUTED }}>{entry.name}:</span>
              <span style={{ color: isDark ? "#ffffff" : "#0f172a", fontWeight: isDark ? 500 : 600 }}>{formatNumber(entry.value)}</span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Monitor your RAG system performance and usage
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              API Requests
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {formatNumber(mockAnalytics.summary.totalQueries)}
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500">+12%</span>
              <span>vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Memories
            </CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {formatNumber(mockMemories.length)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Total stored</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Graph Nodes
            </CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {formatNumber(totalGraphNodes)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Across connections</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Knowledge Docs
            </CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {formatNumber(totalKnowledgeDocs)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Indexed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Latency
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {mockAnalytics.summary.avgLatency}
              <span className="ml-0.5 text-sm font-normal text-muted-foreground">ms</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">p50 response</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="types">Memory Types</TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">API Requests Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={usageData}>
                    <defs>
                      <linearGradient id="requestGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={PRIMARY} stopOpacity={0.15} />
                        <stop offset="100%" stopColor={PRIMARY} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={axisStyle}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={axisStyle}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => formatNumber(v)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="queries"
                      name="Requests"
                      stroke={PRIMARY}
                      strokeWidth={3}
                      fill="url(#requestGradient)"
                      style={{ filter: `drop-shadow(0px 4px 6px ${DROPSHADOW_PRIMARY})` }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Operations Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={axisStyle}
                      tickLine={false}
                      axisLine={{ stroke: GRID }}
                    />
                    <YAxis
                      tick={axisStyle}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => formatNumber(v)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="queries"
                      name="Queries"
                      stroke={PRIMARY}
                      strokeWidth={3}
                      dot={false}
                      style={{ filter: `drop-shadow(0px 4px 6px ${DROPSHADOW_PRIMARY})` }}
                    />
                    <Line
                      type="monotone"
                      dataKey="memories"
                      name="Writes"
                      stroke={SECONDARY}
                      strokeWidth={3}
                      dot={false}
                      style={{ filter: `drop-shadow(0px 4px 6px ${DROPSHADOW_SECONDARY})` }}
                    />
                    <Line
                      type="monotone"
                      dataKey="searches"
                      name="Searches"
                      stroke={TERTIARY}
                      strokeWidth={3}
                      dot={false}
                      style={{ filter: `drop-shadow(0px 4px 6px ${DROPSHADOW_TERTIARY})` }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full shadow-sm" style={{ background: PRIMARY }} />
                  <span className="text-xs text-muted-foreground">Queries</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full shadow-sm" style={{ background: SECONDARY }} />
                  <span className="text-xs text-muted-foreground">Writes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full shadow-sm" style={{ background: TERTIARY }} />
                  <span className="text-xs text-muted-foreground">Searches</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="types">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Memories by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={typeData} layout="vertical" barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID} horizontal={false} />
                    <XAxis
                      type="number"
                      tick={axisStyle}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => formatNumber(v)}
                    />
                    <YAxis
                      type="category"
                      dataKey="type"
                      tick={{ fill: TEXT, fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      width={80}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="count"
                      name="Count"
                      fill={PRIMARY}
                      radius={[0, 4, 4, 0]}
                      fillOpacity={0.85}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* API Keys Usage */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">API Keys Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockApiKeys.map((key) => {
              const percentage = Math.min((key.requests / 100000) * 100, 100)
              return (
                <div key={key.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Zap className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-medium">{key.name}</span>
                      <span className="text-xs text-muted-foreground">{key.maskedKey}</span>
                    </div>
                    <span className="text-muted-foreground">
                      {formatNumber(key.requests)} requests
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div 
                      className="h-full rounded-full bg-foreground transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

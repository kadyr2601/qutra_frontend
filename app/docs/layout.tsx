"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  Code,
  Zap,
  Database,
  Key,
  Search,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const navigation = [
  {
    title: "Getting Started",
    items: [
      { name: "Introduction", href: "/docs", icon: BookOpen },
      { name: "Quickstart", href: "/docs/quickstart", icon: Zap },
      { name: "Authentication", href: "/docs/authentication", icon: Key },
    ],
  },
  {
    title: "Core Concepts",
    items: [
      { name: "Memories", href: "/docs/memories", icon: Database },
      { name: "Search", href: "/docs/search", icon: Search },
    ],
  },
  {
    title: "API Reference",
    items: [
      { name: "REST API", href: "/docs/api-reference", icon: Code },
    ],
  },
]

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight">Qutra</span>
              <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">Docs</span>
            </Link>
          </div>

          <div className="hidden flex-1 items-center justify-center px-8 md:flex">
            <div className="relative w-full max-w-md">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="hidden sm:block">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </Link>
            <Link href="https://github.com" target="_blank">
              <Button variant="ghost" size="icon">
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl lg:flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 mt-16 w-72 transform border-r border-border bg-background transition-transform duration-300 lg:static lg:mt-0 lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav className="h-full overflow-y-auto p-4 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)]">
            {navigation.map((section) => (
              <div key={section.title} className="mb-6">
                <h4 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.title}
                </h4>
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.name}
                          {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}

            <div className="mt-8 rounded-lg border border-border bg-card p-4">
              <h4 className="mb-2 font-medium">Need help?</h4>
              <p className="mb-3 text-sm text-muted-foreground">
                Check out our community or reach out to support.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1">
                  Discord <ExternalLink className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-1">
                  Support <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </nav>
        </aside>

        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}

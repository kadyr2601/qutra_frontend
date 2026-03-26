"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Database,
  Key,
  Settings,
  CreditCard,
  BookOpen,
  Play,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Memories", href: "/dashboard/memories", icon: Database },
  { name: "API Keys", href: "/dashboard/api-keys", icon: Key },
  { name: "Playground", href: "/dashboard/playground", icon: Play },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const displayUser = user || { name: "Demo User", email: "demo@qutra.ai", plan: "pro" }

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-border/50 bg-sidebar/80 backdrop-blur-2xl transition-all duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <Link href="/dashboard" className="text-lg font-bold tracking-tight">
            Qutra
          </Link>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          <div className="space-y-0.5">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_4px_15px_oklch(0.15_0.02_100/0.05)]"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Bottom section */}
        <div className="border-t border-border p-2">
          <Link
            href="/docs"
            target="_blank"
            className="flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
          >
            <BookOpen className="h-4 w-4" />
            Docs
          </Link>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="mt-1 flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left transition-colors hover:bg-secondary/50">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-medium">
                  {displayUser.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{displayUser.name}</div>
                  <div className="text-[10px] text-muted-foreground">{displayUser.plan}</div>
                </div>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5">
                <div className="text-xs font-medium">{displayUser.name}</div>
                <div className="text-[10px] text-muted-foreground">{displayUser.email}</div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="text-xs">
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-3.5 w-3.5" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-xs">
                <Link href="/dashboard/billing">
                  <CreditCard className="mr-2 h-3.5 w-3.5" />
                  Billing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-xs text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-3.5 w-3.5" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Top bar */}
        <header className="flex h-14 items-center border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 sticky top-0 z-40">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gradient-to-br from-background via-background to-secondary/10">{children}</main>
      </div>
    </div>
  )
}

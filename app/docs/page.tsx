import Link from "next/link"
import { ArrowRight, Zap, Database, Key, Code, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const guides = [
  {
    title: "Quickstart",
    description: "Get up and running with Qutra in under 5 minutes",
    href: "/docs/quickstart",
    icon: Zap,
  },
  {
    title: "Working with Memories",
    description: "Learn how to add, update, and manage memories",
    href: "/docs/memories",
    icon: Database,
  },
  {
    title: "Authentication",
    description: "Secure your API requests with API keys",
    href: "/docs/authentication",
    icon: Key,
  },
  {
    title: "Search & Retrieval",
    description: "Semantic search across your memory store",
    href: "/docs/search",
    icon: Search,
  },
  {
    title: "API Reference",
    description: "Complete REST API documentation",
    href: "/docs/api-reference",
    icon: Code,
  },
]

export default function DocsPage() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="rounded-xl border border-border bg-gradient-to-br from-primary/10 via-card to-accent/10 p-8">
        <h1 className="mb-4 text-3xl font-bold">Qutra Documentation</h1>
        <p className="mb-6 max-w-2xl text-lg text-muted-foreground">
          Welcome to the Qutra documentation. Learn how to integrate intelligent memory into your
          AI applications with our comprehensive guides and API reference.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/docs/quickstart">
            <Button className="gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/docs/api-reference">
            <Button variant="outline">API Reference</Button>
          </Link>
        </div>
      </div>

      {/* Quick Install */}
      <Card>
        <CardHeader>
          <CardTitle>Installation</CardTitle>
          <CardDescription>Install the Qutra SDK using your preferred package manager</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="mb-2 text-sm font-medium text-muted-foreground">npm</div>
              <code className="text-sm">npm install @qutra/sdk</code>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="mb-2 text-sm font-medium text-muted-foreground">yarn</div>
              <code className="text-sm">yarn add @qutra/sdk</code>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="mb-2 text-sm font-medium text-muted-foreground">pnpm</div>
              <code className="text-sm">pnpm add @qutra/sdk</code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guides Grid */}
      <div>
        <h2 className="mb-4 text-xl font-bold">Guides</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <Link key={guide.title} href={guide.href}>
              <Card className="h-full transition-colors hover:border-primary/50">
                <CardHeader>
                  <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <guide.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{guide.title}</CardTitle>
                  <CardDescription>{guide.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Example */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Example</CardTitle>
          <CardDescription>Add memory to your AI in just a few lines of code</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
            <code>{`import { Qutra } from '@qutra/sdk';

// Initialize the client
const qutra = new Qutra({
  apiKey: process.env.QUTRA_API_KEY
});

// Add a memory
await qutra.add({
  content: "User prefers concise explanations",
  userId: "user_123",
  category: "preference"
});

// Search for relevant memories
const memories = await qutra.search({
  query: "What communication style does the user prefer?",
  userId: "user_123",
  limit: 5
});

// Use memories in your AI prompt
const context = memories.map(m => m.content).join("\\n");
const prompt = \`Based on the following user context:\\n\${context}\\n\\nRespond to: ...\`;`}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}

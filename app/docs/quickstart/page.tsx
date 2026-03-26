import Link from "next/link"
import { ArrowRight } from "lucide-react"

const codeExamples = {
  addMemory: `await qutra.add({
  content: "User prefers TypeScript over JavaScript",
  userId: "user_123",
  metadata: {
    source: "chat",
    confidence: 0.95
  }
})`,
  searchMemory: `const results = await qutra.search({
  query: "What programming language does the user prefer?",
  userId: "user_123",
  limit: 5,
  threshold: 0.7
})

// Returns relevant memories ranked by similarity
console.log(results.map(m => m.content))`,
}

export default function QuickstartPage() {
  return (
    <article className="prose prose-invert max-w-none">
      <h1>Quickstart Guide</h1>
      <p className="lead text-lg text-muted-foreground">
        Get up and running with Qutra in under 5 minutes. This guide will walk you through
        installation, configuration, and your first API call.
      </p>

      <h2>Prerequisites</h2>
      <ul>
        <li>Node.js 18+ or Python 3.8+</li>
        <li>A Qutra account with an API key</li>
      </ul>

      <h2>Step 1: Install the SDK</h2>
      <p>Install the Qutra SDK using your preferred package manager:</p>
      <div className="not-prose rounded-lg border border-border bg-muted/30 p-4">
        <code>npm install @qutra/sdk</code>
      </div>

      <h2>Step 2: Initialize the Client</h2>
      <p>
        Import the SDK and initialize it with your API key. You can find your API key in the{" "}
        <Link href="/dashboard/api-keys" className="text-primary hover:underline">
          Dashboard
        </Link>
        .
      </p>
      <pre className="not-prose overflow-x-auto rounded-lg bg-muted p-4 text-sm">
        <code>{`import { Qutra } from '@qutra/sdk';

const qutra = new Qutra({
  apiKey: process.env.QUTRA_API_KEY
});`}</code>
      </pre>

      <div className="not-prose my-6 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
        <p className="text-sm text-yellow-500">
          <strong>Security Tip:</strong> Never hardcode your API key. Use environment variables to
          keep your credentials secure.
        </p>
      </div>

      <h2>Step 3: Add Your First Memory</h2>
      <p>
        Memories are the core building blocks of Qutra. Each memory contains a piece of
        information about a user or context that your AI can reference later.
      </p>
      <pre className="not-prose overflow-x-auto rounded-lg bg-muted p-4 text-sm">
        <code>{codeExamples.addMemory}</code>
      </pre>

      <h2>Step 4: Search for Memories</h2>
      <p>
        Use semantic search to find relevant memories based on natural language queries. The search
        returns memories ranked by relevance.
      </p>
      <pre className="not-prose overflow-x-auto rounded-lg bg-muted p-4 text-sm">
        <code>{codeExamples.searchMemory}</code>
      </pre>

      <h2>Step 5: Use in Your AI Application</h2>
      <p>
        Now you can integrate memories into your AI workflow. Here is a complete example:
      </p>
      <pre className="not-prose overflow-x-auto rounded-lg bg-muted p-4 text-sm">
        <code>{`import { Qutra } from '@qutra/sdk';
import OpenAI from 'openai';

const qutra = new Qutra({ apiKey: process.env.QUTRA_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function chat(userId: string, message: string) {
  // 1. Search for relevant memories
  const memories = await qutra.search({
    query: message,
    userId,
    limit: 5
  });

  // 2. Build context from memories
  const context = memories.results
    .map(m => \`- \${m.content}\`)
    .join("\\n");

  // 3. Generate response with context
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: \`You are a helpful assistant. Use this context about the user:\\n\${context}\`
      },
      { role: "user", content: message }
    ]
  });

  // 4. Optionally extract and store new memories
  await qutra.add({
    content: \`User asked about: \${message}\`,
    userId,
    category: "interaction"
  });

  return response.choices[0].message.content;
}`}</code>
      </pre>

      <h2>What is Next?</h2>
      <div className="not-prose grid gap-4 sm:grid-cols-2">
        <Link
          href="/docs/memories"
          className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:border-primary/50"
        >
          <div>
            <div className="font-medium">Working with Memories</div>
            <div className="text-sm text-muted-foreground">Deep dive into memory management</div>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
        </Link>
        <Link
          href="/docs/api-reference"
          className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:border-primary/50"
        >
          <div>
            <div className="font-medium">API Reference</div>
            <div className="text-sm text-muted-foreground">Complete API documentation</div>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
        </Link>
      </div>

      <h2>Need Help?</h2>
      <p>
        If you run into any issues, check out our{" "}
        <Link href="#" className="text-primary hover:underline">
          FAQ
        </Link>{" "}
        or reach out on{" "}
        <Link href="#" className="text-primary hover:underline">
          Discord
        </Link>
        .
      </p>
    </article>
  )
}

import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function MemoriesPage() {
  return (
    <article className="prose prose-invert max-w-none">
      <h1>Working with Memories</h1>
      <p className="lead text-lg text-muted-foreground">
        Memories are the core data type in Qutra. Learn how to create, organize, and manage
        memories for your AI applications.
      </p>

      <h2>What is a Memory?</h2>
      <p>
        A memory is a piece of information that your AI can reference to provide personalized,
        context-aware responses. Each memory contains:
      </p>
      <ul>
        <li>
          <strong>Content</strong> - The actual information (e.g., &quot;User prefers dark mode&quot;)
        </li>
        <li>
          <strong>User ID</strong> - Who this memory belongs to
        </li>
        <li>
          <strong>Category</strong> - Type of memory (preference, fact, interaction, etc.)
        </li>
        <li>
          <strong>Metadata</strong> - Additional context (source, confidence, timestamps)
        </li>
        <li>
          <strong>Relevance Score</strong> - How relevant this memory is to queries
        </li>
      </ul>

      <h2>Memory Categories</h2>
      <p>Organize memories into categories for better retrieval:</p>
      <div className="not-prose grid gap-4 sm:grid-cols-2">
        {[
          {
            name: "preference",
            desc: "User likes, dislikes, and preferences",
            example: "User prefers concise explanations",
          },
          {
            name: "fact",
            desc: "Factual information about the user",
            example: "User works as a software engineer",
          },
          {
            name: "interaction",
            desc: "Past interactions and conversations",
            example: "Discussed machine learning yesterday",
          },
          {
            name: "context",
            desc: "Current context or project info",
            example: "Building a RAG application",
          },
          {
            name: "task",
            desc: "Tasks, reminders, and to-dos",
            example: "Meeting scheduled for Friday 2pm",
          },
        ].map((cat) => (
          <div key={cat.name} className="rounded-lg border border-border p-4">
            <Badge variant="outline" className="mb-2">
              {cat.name}
            </Badge>
            <p className="text-sm text-muted-foreground">{cat.desc}</p>
            <p className="mt-2 text-xs italic text-muted-foreground/70">&quot;{cat.example}&quot;</p>
          </div>
        ))}
      </div>

      <h2>Creating Memories</h2>
      <pre className="not-prose overflow-x-auto rounded-lg bg-muted p-4 text-sm">
        <code>{`// Basic memory
await qutra.add({
  content: "User prefers TypeScript over JavaScript",
  userId: "user_123",
  category: "preference"
});

// Memory with metadata
await qutra.add({
  content: "User mentioned they work remotely",
  userId: "user_123",
  category: "fact",
  agentId: "agent_onboarding",
  metadata: {
    source: "chat",
    confidence: 0.95,
    extractedFrom: "conversation_abc123"
  }
});`}</code>
      </pre>

      <h2>Memory Best Practices</h2>

      <h3>1. Be Specific</h3>
      <p>
        Write clear, specific memories rather than vague ones. Instead of &quot;User likes
        programming&quot;, write &quot;User prefers Python for data science and TypeScript for web
        development&quot;.
      </p>

      <h3>2. Include Context</h3>
      <p>
        Use metadata to track where the memory came from and how confident you are in it. This helps
        when deciding which memories to trust.
      </p>

      <h3>3. Avoid Duplicates</h3>
      <p>
        Before adding a memory, search for similar existing ones. Update existing memories instead
        of creating duplicates.
      </p>

      <h3>4. Respect Privacy</h3>
      <p>
        Only store information that the user has explicitly shared or that is necessary for your
        application. Always follow data protection regulations.
      </p>

      <h2>Updating Memories</h2>
      <p>Update memories when information changes:</p>
      <pre className="not-prose overflow-x-auto rounded-lg bg-muted p-4 text-sm">
        <code>{`await qutra.update("mem_abc123", {
  content: "User now works hybrid (3 days office)",
  metadata: {
    updatedReason: "user_correction",
    previousValue: "works remotely"
  }
});`}</code>
      </pre>

      <h2>Deleting Memories</h2>
      <p>Remove memories that are no longer relevant or upon user request:</p>
      <pre className="not-prose overflow-x-auto rounded-lg bg-muted p-4 text-sm">
        <code>{`// Delete a single memory
await qutra.delete("mem_abc123");

// Delete all memories for a user
await qutra.deleteByUser("user_123");`}</code>
      </pre>

      <h2>Next Steps</h2>
      <p>
        Learn how to{" "}
        <Link href="/docs/search" className="text-primary hover:underline">
          search and retrieve memories
        </Link>{" "}
        effectively.
      </p>
    </article>
  )
}

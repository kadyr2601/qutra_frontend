import Link from "next/link"

export default function SearchPage() {
  return (
    <article className="prose prose-invert max-w-none">
      <h1>Search and Retrieval</h1>
      <p className="lead text-lg text-muted-foreground">
        Learn how to effectively search and retrieve relevant memories using semantic search.
      </p>

      <h2>How Search Works</h2>
      <p>
        Qutra uses semantic search powered by vector embeddings. Instead of matching keywords, it
        understands the meaning of your query and returns memories that are conceptually similar.
      </p>
      <p>
        For example, searching for &quot;What does the user do for work?&quot; will match memories like
        &quot;User is a software engineer at TechCorp&quot; even though they share few words.
      </p>

      <h2>Basic Search</h2>
      <pre className="not-prose overflow-x-auto rounded-lg bg-muted p-4 text-sm">
        <code>{`const results = await qutra.search({
  query: "What are the user's coding preferences?",
  userId: "user_123"
});

// Returns memories ranked by relevance
results.forEach(memory => {
  console.log(memory.content, memory.relevanceScore);
});`}</code>
      </pre>

      <h2>Search Parameters</h2>
      <div className="not-prose rounded-lg border border-border">
        {[
          { param: "query", type: "string", desc: "Natural language search query" },
          { param: "userId", type: "string", desc: "Filter to specific user's memories" },
          { param: "limit", type: "number", desc: "Max results to return (default: 10)" },
          { param: "threshold", type: "number", desc: "Minimum relevance score 0-1 (default: 0.5)" },
          { param: "categories", type: "array", desc: "Filter by memory categories" },
          { param: "agentId", type: "string", desc: "Filter by agent that created memories" },
        ].map((item, index) => (
          <div key={item.param} className={`p-3 ${index > 0 ? "border-t border-border" : ""}`}>
            <div className="flex items-center gap-4">
              <code className="shrink-0 rounded bg-muted px-2 py-0.5 text-sm">{item.param}</code>
              <span className="shrink-0 text-sm text-primary">{item.type}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>

      <h2>Advanced Search</h2>

      <h3>Filtering by Category</h3>
      <pre className="not-prose overflow-x-auto rounded-lg bg-muted p-4 text-sm">
        <code>{`// Only search preferences and facts
const results = await qutra.search({
  query: "user background",
  userId: "user_123",
  categories: ["preference", "fact"]
});`}</code>
      </pre>

      <h3>Setting Threshold</h3>
      <pre className="not-prose overflow-x-auto rounded-lg bg-muted p-4 text-sm">
        <code>{`// Only return highly relevant memories
const results = await qutra.search({
  query: "programming languages",
  userId: "user_123",
  threshold: 0.8  // Only 80%+ relevance
});`}</code>
      </pre>

      <h3>Combining Filters</h3>
      <pre className="not-prose overflow-x-auto rounded-lg bg-muted p-4 text-sm">
        <code>{`const results = await qutra.search({
  query: "recent projects",
  userId: "user_123",
  agentId: "agent_code",
  categories: ["context", "task"],
  limit: 3,
  threshold: 0.6
});`}</code>
      </pre>

      <h2>Using Search Results</h2>
      <p>
        The most common use case is adding search results as context for your AI model:
      </p>
      <pre className="not-prose overflow-x-auto rounded-lg bg-muted p-4 text-sm">
        <code>{`async function generateResponse(userId: string, userMessage: string) {
  // 1. Search for relevant memories
  const memories = await qutra.search({
    query: userMessage,
    userId,
    limit: 5,
    threshold: 0.6
  });

  // 2. Format memories as context
  const context = memories
    .map(m => \`[\${m.category}] \${m.content}\`)
    .join("\\n");

  // 3. Build the prompt
  const systemPrompt = \`You are a helpful assistant.

Here's what you know about this user:
\${context}

Use this context to personalize your response.\`;

  // 4. Generate response with your LLM
  const response = await llm.generate({
    system: systemPrompt,
    user: userMessage
  });

  return response;
}`}</code>
      </pre>

      <h2>Search Tips</h2>
      <ul>
        <li>
          <strong>Use natural language</strong> - Write queries as you would ask a question
        </li>
        <li>
          <strong>Be specific</strong> - More specific queries return more relevant results
        </li>
        <li>
          <strong>Adjust threshold</strong> - Lower for more results, higher for more precision
        </li>
        <li>
          <strong>Filter early</strong> - Use categories and userId to narrow scope before semantic
          search
        </li>
      </ul>

      <h2>Performance</h2>
      <p>
        Qutra is optimized for fast retrieval. Typical search latencies are under 100ms for most
        queries, even with large memory stores.
      </p>
      <p>To optimize performance:</p>
      <ul>
        <li>Always filter by userId when possible</li>
        <li>Use category filters to reduce search space</li>
        <li>Set appropriate limits (don&apos;t request more results than needed)</li>
      </ul>

      <h2>Next Steps</h2>
      <p>
        Check out the complete{" "}
        <Link href="/docs/api-reference" className="text-primary hover:underline">
          API Reference
        </Link>{" "}
        for all available options.
      </p>
    </article>
  )
}

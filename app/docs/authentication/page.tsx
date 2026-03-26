import Link from "next/link"
import { AlertTriangle } from "lucide-react"

export default function AuthenticationPage() {
  return (
    <article className="prose prose-invert max-w-none">
      <h1>Authentication</h1>
      <p className="lead text-lg text-muted-foreground">
        Learn how to authenticate your API requests with Qutra using API keys.
      </p>

      <h2>API Keys</h2>
      <p>
        All requests to the Qutra API must be authenticated using an API key. You can create and
        manage your API keys in the{" "}
        <Link href="/dashboard/api-keys" className="text-primary hover:underline">
          Dashboard
        </Link>
        .
      </p>

      <h2>Using Your API Key</h2>
      <p>Include your API key in the Authorization header of all requests:</p>
      <pre className="not-prose overflow-x-auto rounded-lg bg-muted p-4 text-sm">
        <code>{`Authorization: Bearer qtr_sk_your_api_key`}</code>
      </pre>

      <h3>With the SDK</h3>
      <pre className="not-prose overflow-x-auto rounded-lg bg-muted p-4 text-sm">
        <code>{`import { QutraClient } from '@qutra/sdk';

const qutra = new QutraClient({
  apiKey: process.env.MEMORA_API_KEY
});`}</code>
      </pre>

      <h3>With cURL</h3>
      <pre className="not-prose overflow-x-auto rounded-lg bg-muted p-4 text-sm">
        <code>{`curl -X POST https://api.qutra.ai/v1/memories \\
  -H "Authorization: Bearer qtr_sk_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"content": "User prefers dark mode", "userId": "user_123"}'`}</code>
      </pre>

      <h2>Security Best Practices</h2>

      <div className="not-prose my-6 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-500" />
          <div>
            <p className="font-medium text-yellow-500">Never expose your API key</p>
            <p className="mt-1 text-sm text-yellow-500/80">
              API keys should never be included in client-side code or committed to version control.
            </p>
          </div>
        </div>
      </div>

      <h3>Environment Variables</h3>
      <p>Always store your API key in environment variables:</p>
      <pre className="not-prose overflow-x-auto rounded-lg bg-muted p-4 text-sm">
        <code>{`# .env.local
MEMORA_API_KEY=qtr_sk_your_api_key`}</code>
      </pre>

      <h3>Server-Side Only</h3>
      <p>
        Make API calls from your backend server, never from the browser. This prevents your API key
        from being exposed to end users.
      </p>

      <h3>Key Rotation</h3>
      <p>
        Regularly rotate your API keys, especially if you suspect they may have been compromised.
        You can create new keys and revoke old ones in the dashboard.
      </p>

      <h2>Rate Limits</h2>
      <p>API rate limits depend on your plan:</p>
      <div className="not-prose rounded-lg border border-border">
        <div className="border-b border-border p-3">
          <span className="font-medium">Free</span>
          <span className="ml-4 text-muted-foreground">100 requests/minute</span>
        </div>
        <div className="border-b border-border p-3">
          <span className="font-medium">Pro</span>
          <span className="ml-4 text-muted-foreground">1,000 requests/minute</span>
        </div>
        <div className="p-3">
          <span className="font-medium">Enterprise</span>
          <span className="ml-4 text-muted-foreground">Custom limits</span>
        </div>
      </div>

      <p className="mt-4">
        If you exceed the rate limit, you will receive a 429 response. Implement exponential backoff
        to handle rate limiting gracefully.
      </p>
    </article>
  )
}

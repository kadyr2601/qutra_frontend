import { redirect } from "next/navigation"

// Graph page redirects to API Keys where graphs are managed per-key
export default function GraphRedirectPage() {
  return redirect("/dashboard/api-keys")
}

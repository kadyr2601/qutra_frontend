"use client"

import { useState } from "react"
import { Save, Loader2, Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"

export default function SettingsPage() {
  const { user } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  
  const [profile, setProfile] = useState({
    name: user?.name || "Demo User",
    email: user?.email || "demo@memora.ai",
    company: "TechCorp Inc.",
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    weeklyReports: true,
    apiAlerts: true,
    marketingEmails: false,
  })

  const [apiSettings, setApiSettings] = useState({
    defaultModel: "text-embedding-3-small",
    maxTokens: "8192",
    timeout: "30",
  })

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : saved ? (
            <Check className="h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saved ? "Saved" : "Save Changes"}
        </Button>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={profile.company}
              onChange={(e) => setProfile({ ...profile, company: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* API Settings */}
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>Default settings for API requests</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="model">Embedding Model</Label>
              <Select
                value={apiSettings.defaultModel}
                onValueChange={(value) => setApiSettings({ ...apiSettings, defaultModel: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text-embedding-3-small">text-embedding-3-small</SelectItem>
                  <SelectItem value="text-embedding-3-large">text-embedding-3-large</SelectItem>
                  <SelectItem value="text-embedding-ada-002">text-embedding-ada-002</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxTokens">Max Tokens</Label>
              <Select
                value={apiSettings.maxTokens}
                onValueChange={(value) => setApiSettings({ ...apiSettings, maxTokens: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2048">2,048</SelectItem>
                  <SelectItem value="4096">4,096</SelectItem>
                  <SelectItem value="8192">8,192</SelectItem>
                  <SelectItem value="16384">16,384</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeout">Request Timeout (s)</Label>
              <Select
                value={apiSettings.timeout}
                onValueChange={(value) => setApiSettings({ ...apiSettings, timeout: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 seconds</SelectItem>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="60">60 seconds</SelectItem>
                  <SelectItem value="120">120 seconds</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage how you receive updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email notifications for important events
              </p>
            </div>
            <Switch
              checked={preferences.emailNotifications}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, emailNotifications: checked })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Weekly Reports</Label>
              <p className="text-sm text-muted-foreground">
                Get a weekly summary of your API usage
              </p>
            </div>
            <Switch
              checked={preferences.weeklyReports}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, weeklyReports: checked })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>API Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Alert when approaching usage limits or errors occur
              </p>
            </div>
            <Switch
              checked={preferences.apiAlerts}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, apiAlerts: checked })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates about new features and products
              </p>
            </div>
            <Switch
              checked={preferences.marketingEmails}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, marketingEmails: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions for your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Delete All Memories</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete all stored memories
              </p>
            </div>
            <Button variant="outline" className="text-destructive hover:bg-destructive/10">
              Delete Memories
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Delete Account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all data
              </p>
            </div>
            <Button variant="destructive">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

// Billing & Subscription Management
import { useState } from "react"
import { Check, CreditCard, Download, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { pricingPlans, mockApiKeys, mockMemories } from "@/lib/mock-data"

const formatNum = (n: number) => {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const invoiceData = [
  { id: "INV-001", date: "Mar 1, 2024", amount: "$29.00", status: "paid" },
  { id: "INV-002", date: "Feb 1, 2024", amount: "$29.00", status: "paid" },
  { id: "INV-003", date: "Jan 1, 2024", amount: "$29.00", status: "paid" },
  { id: "INV-004", date: "Dec 1, 2023", amount: "$29.00", status: "paid" },
]

export default function BillingPage() {
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false)
  const currentPlan = pricingPlans[1]
  
  const memoriesUsed = mockMemories.length
  const memoriesLimit = currentPlan.limits.memories
  const memoriesPercent = (memoriesUsed / memoriesLimit) * 100

  const apiCallsUsed = mockApiKeys.reduce((acc, key) => acc + key.requests, 0)
  const apiCallsLimit = currentPlan.limits.apiCalls
  const apiCallsPercent = (apiCallsUsed / apiCallsLimit) * 100

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-sm text-muted-foreground">
          Manage your subscription and payment methods
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Current Plan
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  {currentPlan.name}
                </Badge>
              </CardTitle>
              <CardDescription>{currentPlan.description}</CardDescription>
            </div>
            <Dialog open={isUpgradeDialogOpen} onOpenChange={setIsUpgradeDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  Upgrade Plan <ArrowRight className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Upgrade Your Plan</DialogTitle>
                  <DialogDescription>
                    Choose the plan that best fits your needs
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 md:grid-cols-3">
                  {pricingPlans.map((plan) => (
                    <div
                      key={plan.name}
                      className={`relative rounded-lg border p-4 ${
                        plan.name === currentPlan.name
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      }`}
                    >
                      {plan.name === currentPlan.name && (
                        <Badge className="absolute -top-2 right-2 text-xs">Current</Badge>
                      )}
                      <div className="mb-2 text-lg font-semibold">{plan.name}</div>
                      <div className="mb-4">
                        <span className="text-2xl font-bold">${plan.price}</span>
                        <span className="text-muted-foreground">/mo</span>
                      </div>
                      <ul className="space-y-2 text-sm">
                        {plan.features.slice(0, 4).map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className="mt-4 w-full"
                        variant={plan.name === currentPlan.name ? "outline" : "default"}
                        disabled={plan.name === currentPlan.name}
                      >
                        {plan.name === currentPlan.name ? "Current Plan" : "Select"}
                      </Button>
                    </div>
                  ))}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsUpgradeDialogOpen(false)}>
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-border p-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Memories</span>
                <span className="font-medium">
                  {formatNum(memoriesUsed)} / {formatNum(memoriesLimit)}
                </span>
              </div>
              <Progress value={memoriesPercent} className="h-2" />
              <p className="mt-2 text-xs text-muted-foreground">
                {(100 - memoriesPercent).toFixed(0)}% remaining
              </p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">API Calls</span>
                <span className="font-medium">
                  {formatNum(apiCallsUsed)} / {formatNum(apiCallsLimit)}
                </span>
              </div>
              <Progress value={apiCallsPercent} className="h-2" />
              <p className="mt-2 text-xs text-muted-foreground">
                {(100 - apiCallsPercent).toFixed(0)}% remaining
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div>
              <div className="text-sm text-muted-foreground">Monthly Cost</div>
              <div className="text-2xl font-bold">${currentPlan.price}.00</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Billing Cycle</div>
              <div className="text-2xl font-bold">Monthly</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Next Invoice</div>
              <div className="text-2xl font-bold">Apr 1, 2024</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Manage your payment information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-16 items-center justify-center rounded bg-muted">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <div className="font-medium">Visa ending in 4242</div>
                <div className="text-sm text-muted-foreground">Expires 12/2025</div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Update
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>Download your past invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoiceData.map((invoice, index) => (
              <div key={invoice.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="font-medium">{invoice.id}</div>
                      <div className="text-sm text-muted-foreground">{invoice.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium">{invoice.amount}</div>
                      <Badge variant="outline" className="text-xs capitalize text-emerald-500 border-emerald-500/30">
                        {invoice.status}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {index < invoiceData.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Plan Features</CardTitle>
          <CardDescription>What is included in your {currentPlan.name} plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {currentPlan.features.map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

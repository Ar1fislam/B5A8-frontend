"use client"

import type React from "react"
import { useMemo, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import {
  ShieldAlert,
  KeyRound,
  ArrowLeft,
  Home,
  LogIn,
  Ban,
  BadgeCheck,
  LifeBuoy,
  Sparkles,
} from "lucide-react"

type ReasonKey =
  | "admin-access-required"
  | "login-required"
  | "insufficient-permissions"
  | "account-suspended"

const reasonMessages: Record<
  ReasonKey,
  { title: string; description: string; icon: React.ReactNode; tone: "warning" | "danger" }
> = {
  "admin-access-required": {
    title: "Restricted area",
    description:
      "This page is available to administrators only. If you think you should have access, ask an admin to update your role.",
    icon: <BadgeCheck className="h-6 w-6" />,
    tone: "warning",
  },
  "login-required": {
    title: "Sign in to continue",
    description:
      "This page needs an active session. Please log in, then try again.",
    icon: <KeyRound className="h-6 w-6" />,
    tone: "warning",
  },
  "insufficient-permissions": {
    title: "Permission missing",
    description:
      "Your account is signed in, but it doesn’t have the right permission for this action.",
    icon: <ShieldAlert className="h-6 w-6" />,
    tone: "warning",
  },
  "account-suspended": {
    title: "Account paused",
    description:
      "Your account is currently suspended. Please contact support for details and next steps.",
    icon: <Ban className="h-6 w-6" />,
    tone: "danger",
  },
} as const

export default function UnauthorizedContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [reason] = useState<ReasonKey>(() => {
    const reasonParam = searchParams.get("reason") as ReasonKey | null
    return reasonParam && reasonMessages[reasonParam]
      ? reasonParam
      : "admin-access-required"
  })

  const meta = reasonMessages[reason]
  const isLoginRequired = reason === "login-required"
  const isDanger = meta.tone === "danger"

  const errorCode = useMemo(() => {
    return `ACCESS_DENIED_${reason.toUpperCase().replaceAll("-", "_")}`
  }, [reason])

  const handleGoBack = () => {
    if (window.history.length > 1) router.back()
    else router.push("/")
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/30 p-4">
      <div className="mx-auto max-w-3xl pt-10 sm:pt-16">
        {/* Header strip */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Access check
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={isDanger ? "destructive" : "secondary"}
              className="rounded-full"
            >
              {isDanger ? "Action blocked" : "Not allowed"}
            </Badge>
            <Badge variant="outline" className="rounded-full">
              {errorCode}
            </Badge>
          </div>
        </div>

        {/* Main card */}
        <Card className="overflow-hidden rounded-3xl border bg-card/60 backdrop-blur">
          {/* Top visual */}
          <div className="relative border-b bg-linear-to-r from-primary/10 via-transparent to-accent/10">
            <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-primary/15 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-accent/15 blur-3xl" />

            <CardHeader className="relative">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={[
                      "grid h-12 w-12 place-items-center rounded-2xl border",
                      isDanger
                        ? "bg-destructive/10 border-destructive/20 text-destructive"
                        : "bg-primary/10 border-primary/20 text-primary",
                    ].join(" ")}
                  >
                    {meta.icon}
                  </div>

                  <div className="min-w-0">
                    <CardTitle className="text-2xl">{meta.title}</CardTitle>
                    <CardDescription className="mt-1">
                      You don’t have access to this page.
                    </CardDescription>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="rounded-2xl bg-transparent"
                    onClick={handleGoBack}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>

                  {isLoginRequired ? (
                    <Button className="rounded-2xl" onClick={() => router.push("/login")}>
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign in
                    </Button>
                  ) : (
                    <Button className="rounded-2xl" onClick={() => router.push("/")}>
                      <Home className="h-4 w-4 mr-2" />
                      Home
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </div>

          <CardContent className="p-6 space-y-5">
            <Alert
              className={[
                "rounded-2xl",
                isDanger
                  ? "border-destructive/30 bg-destructive/10"
                  : "border-primary/20 bg-primary/5",
              ].join(" ")}
            >
              <AlertTitle className={isDanger ? "text-destructive" : ""}>
                What happened?
              </AlertTitle>
              <AlertDescription className="text-muted-foreground">
                {meta.description}
              </AlertDescription>
            </Alert>

            <div className="rounded-2xl border bg-background/50 p-5">
              <h4 className="font-semibold">Next steps</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {reason === "admin-access-required" && (
                  <>
                    <li>Ask an administrator to grant admin access if needed.</li>
                    <li>Return to the dashboard or explore public pages.</li>
                  </>
                )}

                {reason === "login-required" && (
                  <>
                    <li>Sign in and retry the page.</li>
                    <li>Create an account if you don’t have one.</li>
                  </>
                )}

                {reason === "insufficient-permissions" && (
                  <>
                    <li>Switch to an account with the correct role.</li>
                    <li>Request permission from the trip owner or admin.</li>
                  </>
                )}

                {reason === "account-suspended" && (
                  <>
                    <li>Contact support to understand the suspension reason.</li>
                    <li>Review any policy or community guideline notices.</li>
                  </>
                )}

                <li>Still stuck? Contact support with the error code above.</li>
              </ul>

              <Separator className="my-4" />

              <div className="flex items-start gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-muted">
                  <LifeBuoy className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">Support</p>
                  <p className="text-sm text-muted-foreground">
                    Email{" "}
                    <a
                      href="mailto:support@travelbuddy.com"
                      className="underline font-medium"
                    >
                      support@travelbuddy.com
                    </a>{" "}
                    and include the error code.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-6 pt-0">
            <div className="flex w-full flex-col gap-3 sm:hidden">
              <Button
                variant="outline"
                onClick={handleGoBack}
                className="rounded-2xl bg-transparent"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>

              {isLoginRequired ? (
                <Button onClick={() => router.push("/login")} className="rounded-2xl">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign in
                </Button>
              ) : (
                <Button onClick={() => router.push("/")} className="rounded-2xl">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

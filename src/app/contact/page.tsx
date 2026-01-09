// src/app/contact/page.tsx
'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ContactForm } from '@/components/contact/contact-form'
import {
  Mail,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Clock3,
  ArrowRight,
  Bug,
  Handshake,
} from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-linear-to-b from-background via-background to-muted/30">
      <div className="container py-10">
        {/* Hero */}
        <Card className="relative mb-8 overflow-hidden rounded-3xl border bg-card/60 backdrop-blur">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/12 blur-3xl animate-app-float" />
            <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-accent/18 blur-3xl animate-app-float [animation-delay:-6s]" />
          </div>

          <CardContent className="relative p-6 sm:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="animate-app-fade-up">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="rounded-full">
                    Contact
                  </Badge>
                  <Badge variant="secondary" className="rounded-full">
                    Support • Feedback • Partnerships
                  </Badge>
                </div>

                <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Let’s talk
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  Have a question, found a bug, or want to collaborate? Send a message and get a
                  quick reply.
                </p>

                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                  <Button className="rounded-xl" asChild>
                    <a href="#contact-form">
                      Open contact form <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>

                  <Button variant="outline" className="rounded-xl" asChild>
                    <a href="mailto:support@travelbuddy.com">
                      <Mail className="mr-2 h-4 w-4" />
                      Email support
                    </a>
                  </Button>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 md:w-[360px]">
                <div className="rounded-2xl border bg-background/40 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Clock3 className="h-4 w-4 text-muted-foreground" />
                    Typical response
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">Within 24-48 hours.</p>
                </div>

                <div className="rounded-2xl border bg-background/40 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    Privacy
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">Your message stays confidential.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main grid */}
        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          {/* Left: contact options + mini FAQ */}
          <div className="space-y-6">
            <Card className="rounded-3xl border bg-card/60 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-base">Choose a topic</CardTitle>
                <CardDescription>
                  Pick the closest option so your message reaches the right place.
                </CardDescription>
              </CardHeader>

              <CardContent className="grid gap-3 sm:grid-cols-2">
                <div className="group rounded-2xl border bg-background/40 p-4 transition hover:bg-accent/20">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
                      <MessageSquareText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">General help</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Account, plans, matches, reviews, and payments.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group rounded-2xl border bg-background/40 p-4 transition hover:bg-accent/20">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10">
                      <Bug className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="font-medium">Bug report</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Share steps + screenshot if possible.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group rounded-2xl border bg-background/40 p-4 transition hover:bg-accent/20">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10">
                      <Handshake className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium">Partnership</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Brand collabs, tours, and communities.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group rounded-2xl border bg-background/40 p-4 transition hover:bg-accent/20">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-fuchsia-500/10">
                      <Sparkles className="h-5 w-5 text-fuchsia-600 dark:text-fuchsia-400" />
                    </div>
                    <div>
                      <p className="font-medium">Feedback</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Suggest features or UX improvements.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border bg-card/60 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-base">Before you send</CardTitle>
                <CardDescription>Two tips to get faster help.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="rounded-2xl border bg-background/40 p-4">
                  Include your email + a short subject (example: “Payment issue”).
                </div>
                <div className="rounded-2xl border bg-background/40 p-4">
                  For bugs: add browser/device + steps to reproduce.
                </div>

                <div className="pt-1">
                  <Button variant="link" className="px-0" asChild>
                    <Link href="/community-guidelines">Read Community Guidelines</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: form */}
          <Card id="contact-form" className="h-fit rounded-3xl border bg-card/60 backdrop-blur">
            <CardHeader>
              <CardTitle>Send a message</CardTitle>
              <CardDescription>Fill out the form and the team will respond soon.</CardDescription>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Activity, ShieldCheck, MessagesSquare, Sparkles } from 'lucide-react'

const signals = [
  {
    title: 'New plans today',
    value: '24+',
    hint: 'Fresh itineraries added by the community.',
    icon: Activity,
    accent: 'bg-primary/10 text-primary',
  },
  {
    title: 'Safer meetups',
    value: 'Guided',
    hint: 'Simple tips that reduce risk and set expectations.',
    icon: ShieldCheck,
    accent: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  },
  {
    title: 'Fast coordination',
    value: '< 2h',
    hint: 'Average reply time for active travelers.',
    icon: MessagesSquare,
    accent: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
  },
] as const

export default function TripSignals() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border bg-card/60 p-6 backdrop-blur sm:p-8">
        {/* Decorative blobs */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl animate-app-float" />
          <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-accent/15 blur-3xl animate-app-float [animation-delay:-6s]" />
        </div>

        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="animate-app-fade-up">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="rounded-full">
                Live signals
              </Badge>
              <Badge variant="outline" className="rounded-full">
                Updated frequently
              </Badge>
            </div>

            <h2 className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">
              Small signals that make matching feel easier
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground sm:text-base">
              A quick snapshot of activity, safety, and coordination—so you can move with confidence.
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/travel-plans/new">
                Create a plan <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            {/* <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/safety">Safety tips</Link>
            </Button> */}
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {signals.map((s, i) => {
            const Icon = s.icon
            return (
              <Card
                key={s.title}
                className="group rounded-2xl border bg-background/40 p-5 transition hover:-translate-y-0.5 hover:shadow-lg motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2"
                style={{ animationDelay: `${i * 90}ms` } as React.CSSProperties}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`relative flex h-10 w-10 items-center justify-center rounded-xl ${s.accent}`}>
                      <Icon className="h-5 w-5" />
                      {/* animated "live" dot */}
                      <span className="absolute -right-1 -top-1 inline-flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                      </span>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">{s.title}</p>
                      <p className="text-2xl font-semibold tracking-tight">{s.value}</p>
                    </div>
                  </div>

                  <Sparkles className="h-4 w-4 text-muted-foreground opacity-50 transition group-hover:opacity-100" />
                </div>

                <p className="mt-3 text-sm text-muted-foreground">{s.hint}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

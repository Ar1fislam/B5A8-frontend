import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BadgeCheck,
  Shield,
  Route,
  UsersRound,
  MessagesSquare,
  Sparkles,
} from 'lucide-react'

export default function FeatureMosaic() {
  const features = [
    {
      title: 'Clear expectations',
      desc: 'Set dates, pace, budget range, and trip style—before anyone commits.',
      icon: <Route className="h-5 w-5" />,
    },
    {
      title: 'Trust signals',
      desc: 'Profiles + reviews help you decide with more confidence.',
      icon: <BadgeCheck className="h-5 w-5" />,
    },
    {
      title: 'Safer meetups',
      desc: 'Encourage public first meets and simple planning rules.',
      icon: <Shield className="h-5 w-5" />,
    },
    {
      title: 'Real community',
      desc: 'Less noise, more genuine connections around actual trips.',
      icon: <UsersRound className="h-5 w-5" />,
    },
    {
      title: 'Travel-ready chat',
      desc: 'Coordinate details cleanly—no messy threads.',
      icon: <MessagesSquare className="h-5 w-5" />,
    },
    {
      title: 'Better matching',
      desc: 'Match by what matters: timing, location, and vibe.',
      icon: <Sparkles className="h-5 w-5" />,
    },
  ] as const

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="rounded-full">
          What makes it different
        </Badge>
        <Badge variant="outline" className="rounded-full">
          Built for planning
        </Badge>
      </div>

      <div className="mt-3 max-w-2xl">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Designed around real trips</h2>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          The homepage flow focuses on clarity, trust, and coordination—so matching feels practical.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, idx) => (
          <Card
            key={f.title}
            className="group rounded-2xl border bg-card/60 backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-lg motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2"
            style={{ animationDelay: `${idx * 70}ms` } as React.CSSProperties}
          >
            <CardHeader className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary/15">
                {f.icon}
              </div>
              <CardTitle className="text-base">{f.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{f.desc}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

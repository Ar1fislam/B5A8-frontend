import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ClipboardList, CalendarCheck2, Users, Star, ArrowRight } from 'lucide-react'

export default function TripFlow() {
  const steps = [
    {
      k: '01',
      title: 'Draft your plan',
      desc: 'Destination, dates, and what “a good trip” looks like to you.',
      icon: <ClipboardList className="h-5 w-5" />,
    },
    {
      k: '02',
      title: 'Lock the basics',
      desc: 'Agree on budget range, pace, and meet-up preferences.',
      icon: <CalendarCheck2 className="h-5 w-5" />,
    },
    {
      k: '03',
      title: 'Connect & coordinate',
      desc: 'Chat, share details, and confirm availability before the trip.',
      icon: <Users className="h-5 w-5" />,
    },
    {
      k: '04',
      title: 'Review & repeat',
      desc: 'Leave feedback so the community improves over time.',
      icon: <Star className="h-5 w-5" />,
    },
  ] as const

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">A calmer way to match</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Four steps that keep things clear from first message to trip day.
          </p>
        </div>

        <Button asChild variant="outline" className="hidden sm:inline-flex">
          <Link href="/travel-plans/new">
            Create a plan <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <Separator className="mt-6" />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <Card
            key={s.k}
            className="rounded-2xl border bg-card/60 p-5 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground">
                {s.icon}
              </div>
              <span className="text-sm text-muted-foreground">{s.k}</span>
            </div>

            <h3 className="mt-4 font-medium">{s.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 sm:hidden">
        <Button asChild variant="outline" className="w-full">
          <Link href="/travel-plans/new">
            Create a plan <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  )
}

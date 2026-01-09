// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from '@/components/ui/card'

// export default function AboutPage() {
//   return (
//     <div className="container mx-auto px-4 py-10">
//       {/* Page Header */}
//       <div className="mb-10 text-center">
//         <h1 className="text-3xl font-bold tracking-tight">About Us</h1>
//         <p className="mt-2 text-muted-foreground">
//           Learn more about our mission, vision, and what drives us.
//         </p>
//       </div>

//       {/* About Content */}
//       <div className="grid gap-6 md:grid-cols-2">
//         <Card>
//           <CardHeader>
//             <CardTitle>Our Mission</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <CardDescription className="text-muted-foreground">
//               Our mission is to provide a seamless and enjoyable travel planning
//               experience for everyone. We aim to empower users to organize,
//               share, and explore trips effortlessly.
//             </CardDescription>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Our Vision</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <CardDescription className="text-muted-foreground">
//               We envision a world where travelers can connect, plan, and explore
//               with confidence, knowing that all the tools they need are at their
//               fingertips in one platform.
//             </CardDescription>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Our Values</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <CardDescription className="text-muted-foreground">
//               Integrity, user-first design, innovation, and community engagement
//               are the core values that guide everything we do.
//             </CardDescription>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Why Choose Us?</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <CardDescription className="text-muted-foreground">
//               Our platform is designed with simplicity, reliability, and
//               security in mind, helping travelers save time, stay organized, and
//               make their journeys memorable.
//             </CardDescription>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  Compass,
  Users,
  ShieldCheck,
  Sparkles,
  MapPinned,
  MessageSquare,
  Star,
  Leaf,
} from 'lucide-react'

const highlights = [
  {
    title: 'Plan with clarity',
    description:
      'Create travel plans that set expectations upfront—dates, destinations, budgets, and pace.',
    icon: <MapPinned className="h-5 w-5" />,
  },
  {
    title: 'Match with confidence',
    description:
      'Discover travelers with compatible interests and travel style, then connect without friction.',
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: 'Trust and safety',
    description:
      'Clear profiles, reviews, and community guidelines help keep the platform respectful and safe.',
    icon: <ShieldCheck className="h-5 w-5" />,
  },
  {
    title: 'Stay coordinated',
    description:
      'Keep important details in one place so trips feel organized—from first message to takeoff.',
    icon: <MessageSquare className="h-5 w-5" />,
  },
] as const

const values = [
  {
    title: 'Human-first',
    description: 'Real people, real plans—less noise and more meaningful connections.',
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    title: 'Community-driven',
    description: 'Reviews and shared experiences shape a better ecosystem for everyone.',
    icon: <Star className="h-5 w-5" />,
  },
  {
    title: 'Responsible travel',
    description: 'Encouraging mindful choices that respect local cultures and places.',
    icon: <Leaf className="h-5 w-5" />,
  },
] as const

export default function AboutPage() {
  return (
    <div className="relative">
      {/* Decorative background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/12 blur-3xl animate-app-float" />
        <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-accent/18 blur-3xl animate-app-float [animation-delay:-6s]" />
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="animate-app-fade-up">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="rounded-full">
              About
            </Badge>
            <Badge variant="outline" className="rounded-full">
              Built for modern travel buddies
            </Badge>
          </div>

          <div className="mt-4 grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Travel is better when the plan—and the people—fit.
              </h1>
              <p className="mt-3 text-base text-muted-foreground sm:text-lg">
                This platform helps travelers publish clear trip plans, discover compatible buddies,
                and build trust through profiles and reviews—so you can spend less time guessing and
                more time exploring.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="w-full sm:w-auto">
                  <Link href="/explore">
                    <Compass className="mr-2 h-4 w-4" />
                    Explore travelers
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link href="/travel-plans/new">
                    <MapPinned className="mr-2 h-4 w-4" />
                    Create a travel plan
                  </Link>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <Card className="border bg-card/70 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-base">What this is</CardTitle>
                  <CardDescription>
                    A lightweight community for planning, matching, and traveling together.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 text-foreground">
                      <Users className="h-4 w-4" />
                    </span>
                    <span>Find travel buddies based on interests and availability.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 text-foreground">
                      <Star className="h-4 w-4" />
                    </span>
                    <span>Build credibility through reviews and shared experiences.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 text-foreground">
                      <ShieldCheck className="h-4 w-4" />
                    </span>
                    <span>Encourage safer meetups with clearer expectations.</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />

      {/* Highlights */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">How it helps</h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            Everything is designed to make planning and matching feel simple, not stressful.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => (
            <Card
              key={item.title}
              className={cn(
                'group border bg-card/60 backdrop-blur transition-all',
                'hover:-translate-y-0.5 hover:shadow-lg'
              )}
            >
              <CardHeader className="space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                  {item.icon}
                </div>
                <CardTitle className="text-base">{item.title}</CardTitle>
                <CardDescription className="text-sm">{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="rounded-2xl border bg-card/60 p-6 backdrop-blur sm:p-8">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">What we value</h2>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                The goal is not “more matches”—it’s better trips with the right people.
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link href="/community">
                    <Users className="mr-2 h-4 w-4" />
                    Community
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link href="/safety">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Safety
                  </Link>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="grid gap-4 sm:grid-cols-3">
                {values.map((v) => (
                  <Card key={v.title} className="border bg-background/40">
                    <CardHeader className="space-y-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground">
                        {v.icon}
                      </div>
                      <CardTitle className="text-base">{v.title}</CardTitle>
                      <CardDescription className="text-sm">{v.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              <div className="mt-6 rounded-xl border bg-background/40 p-4 text-sm text-muted-foreground">
                Have feedback or want to collaborate?{' '}
                <Link href="/contact" className="font-medium text-foreground underline-offset-4 hover:underline">
                  Reach out here
                </Link>
                .
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

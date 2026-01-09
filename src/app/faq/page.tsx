import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sparkles,
  ShieldCheck,
  CreditCard,
  Share2,
  Headphones,
  Globe2,
  MessageCircle,
} from 'lucide-react'

const faqs = [
  {
    id: 'item-1',
    icon: Globe2,
    iconBg: 'bg-sky-500/10',
    iconText: 'text-sky-600 dark:text-sky-400',
    q: 'What is Travel Buddy?',
    a: 'Travel Buddy is a platform to create travel plans, discover other travelers with similar routes, and connect safely before your trip.',
  },
  {
    id: 'item-2',
    icon: ShieldCheck,
    iconBg: 'bg-emerald-500/10',
    iconText: 'text-emerald-600 dark:text-emerald-400',
    q: 'Is my data secure?',
    a: 'Yes. We use secure authentication and follow best practices to protect your personal information and travel details.',
  },
  {
    id: 'item-3',
    icon: CreditCard,
    iconBg: 'bg-amber-500/10',
    iconText: 'text-amber-600 dark:text-amber-400',
    q: 'Can I use Travel Buddy for free?',
    a: 'Yes. Core features are available on the free experience. Some features may require an active subscription depending on your plan.',
  },
  {
    id: 'item-4',
    icon: Share2,
    iconBg: 'bg-fuchsia-500/10',
    iconText: 'text-fuchsia-600 dark:text-fuchsia-400',
    q: 'Can I share my trip with others?',
    a: 'Absolutely. You can share your plan link and collaborate with friends or family, depending on visibility settings.',
  },
  {
    id: 'item-5',
    icon: Headphones,
    iconBg: 'bg-purple-500/10',
    iconText: 'text-purple-600 dark:text-purple-400',
    q: 'How do I contact support?',
    a: 'Use the contact page to reach support. Include your email, what you tried, and screenshots if possible.',
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-linear-to-b from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-10">
        {/* HERO */}
        <div className="relative overflow-hidden rounded-3xl border bg-card/60 p-6 backdrop-blur sm:p-8">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-primary/12 blur-3xl animate-app-float" />
            <div className="absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-accent/18 blur-3xl animate-app-float [animation-delay:-6s]" />
          </div>

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="animate-app-fade-up">
              <Badge variant="outline" className="rounded-full bg-background/60">
                <Sparkles className="mr-2 h-4 w-4" />
                Help Center
              </Badge>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Frequently Asked Questions
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Quick answers about planning trips, sending match requests, privacy, and support.
              </p>
            </div>

            <div className="animate-app-fade-up">
              <Button asChild className="rounded-xl">
                <Link href="/contact">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contact support
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* FAQ LIST */}
        <div className="mx-auto mt-8 max-w-3xl">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((item, idx) => {
              const Icon = item.icon
              return (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="overflow-hidden rounded-3xl border bg-card/60 backdrop-blur transition hover:shadow-lg animate-app-fade-up"
                  style={{ animationDelay: `${Math.min(idx, 8) * 60}ms` }}
                >
                  <AccordionTrigger className="px-5 py-4 hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${item.iconBg}`}>
                        <Icon className={`h-5 w-5 ${item.iconText}`} />
                      </div>
                      <div>
                        <p className="font-medium">{item.q}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Click to expand
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>

          {/* CTA */}
          <div className="mt-8 rounded-3xl border bg-background/60 p-6 backdrop-blur animate-app-fade-up">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold">Still have questions?</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Send a message and we’ll respond as soon as possible.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="rounded-xl" asChild>
                  <Link href="/explore">Explore plans</Link>
                </Button>
                <Button className="rounded-xl" asChild>
                  <Link href="/contact">Contact support</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  )
}

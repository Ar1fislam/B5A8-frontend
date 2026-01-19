// // frontend/components/layout/footer.tsx
'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  TentTree,
  ArrowUpRight,
  Mail,
  Github,
  Linkedin,
  Instagram,
} from 'lucide-react'

const year = new Date().getFullYear()

const linkGroups = [
  {
    title: 'Explore',
    links: [
      { label: 'Find travelers', href: '/explore' },
      { label: 'Travel plans', href: '/travel-plans' },
      { label: 'Dashboard', href: '/dashboard' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact', href: '/contact' },
      { label: 'Community', href: '/community' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Cookies', href: '/cookies' },
    ],
  },
] as const

const social = [
  { label: 'Instagram', href: 'https://www.instagram.com', icon: Instagram },
  { label: 'GitHub', href: 'https://github.com', icon: Github },
  { label: 'LinkedIn', href: 'https://www.linkedin.com', icon: Linkedin },
  { label: 'Email', href: 'mailto:hello@travelbuddy.com', icon: Mail },
] as const

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <Link href="/" className="group inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary/15">
                <TentTree className="h-5 w-5" />
              </span>

              <span className="flex flex-col leading-tight">
                <span className="text-lg font-semibold tracking-tight">TravelBuddy</span>
                {/* Animated tagline */}
                <span className="text-sm text-muted-foreground">
                  <span className="inline-block animate-app-fade-up">
                    Plan • Match • Go
                  </span>
                </span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              A planning-first travel community for finding compatible travel partners and keeping
              trips organized from day one.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {social.map((s) => {
                const Icon = s.icon
                return (
                  <Link
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-xl border bg-card px-3 py-2 text-sm',
                      'text-muted-foreground transition',
                      'hover:text-foreground hover:shadow-sm',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{s.label}</span>
                    <ArrowUpRight className="h-4 w-4 opacity-40" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-8">
            <div className="grid gap-8 sm:grid-cols-3">
              {linkGroups.map((group) => (
                <div key={group.title}>
                  <h3 className="text-sm font-semibold tracking-tight">{group.title}</h3>
                  <ul className="mt-4 space-y-2 text-sm">
                    {group.links.map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          className="text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Mini note / animated line */}
            <div className="mt-10 rounded-2xl border bg-card/50 p-4 text-sm text-muted-foreground backdrop-blur">
              <span className="inline-block motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
                Tip: Set your trip pace and budget range early—matches get better instantly.
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-2 border-t pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} TravelBuddy. All rights reserved.</p>
    
        </div>
      </div>
    </footer>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Star, ArrowUpRight, Quote, MapPin } from 'lucide-react'
import { userAPI } from '@/lib/api'

interface Traveler {
  id: string
  name: string
  location: string
  rating: number
  trips: number
  image: string
}


const fallback: Traveler[] = [
  {
    id: '1',
    name: 'Aarav Mehta',
    location: 'Mumbai, India',
    rating: 4.8,
    trips: 14,
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: '2',
    name: 'Noura Al-Farsi',
    location: 'Muscat, Oman',
    rating: 4.9,
    trips: 9,
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: '3',
    name: 'Lucas Ferreira',
    location: 'Porto, Portugal',
    rating: 4.7,
    trips: 18,
    image: 'https://randomuser.me/api/portraits/men/75.jpg',
  },
  {
    id: '4',
    name: 'Hana Kim',
    location: 'Busan, South Korea',
    rating: 4.8,
    trips: 11,
    image: 'https://randomuser.me/api/portraits/women/12.jpg',
  },
]


export default function CommunitySpotlight() {
  const [people, setPeople] = useState<Traveler[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await userAPI.getTopRatedTravelers()
        setPeople(res.data?.length ? res.data : fallback)
      } catch {
        setPeople(fallback)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const quotes = [
    '“I matched with someone who had the same pace and budget. Planning felt effortless.”',
    '“The profile + review signals made it easier to trust the meetup.”',
    '“Way better than random swiping—this is built around real itineraries.”',
  ] as const

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="rounded-full">Community</Badge>
            <Badge variant="outline" className="rounded-full">Top profiles</Badge>
          </div>
          <h2 className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">People you’ll want to travel with</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            A quick look at trusted travelers and what others are saying.
          </p>
        </div>

        <Button asChild variant="outline" className="hidden sm:inline-flex">
          <Link href="/explore">
            Browse all <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8 grid gap-4 sm:grid-cols-2">
          {loading
            ? [...Array(4)].map((_, i) => (
                <Card key={i} className="rounded-2xl border bg-card/60 p-4 backdrop-blur">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-9 w-full rounded-xl" />
                  </div>
                </Card>
              ))
            : people.slice(0, 4).map((p) => (
                <Card
                  key={p.id}
                  className="group rounded-2xl border bg-card/60 p-4 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={p.image} alt={p.name} />
                      <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{p.name}</p>
                      <p className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {p.location}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium">{p.rating}</span>
                    <span className="text-sm text-muted-foreground">• {p.trips} trips</span>
                  </div>

                  <Button asChild className="mt-4 w-full rounded-xl">
                    <Link href={`/profile/${p.id}`}>View profile</Link>
                  </Button>
                </Card>
              ))}
        </div>

        <div className="lg:col-span-4 grid gap-4">
          {quotes.map((q, idx) => (
            <Card
              key={idx}
              className="rounded-2xl border bg-card/60 p-5 backdrop-blur motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2"
              style={{ animationDelay: `${idx * 80}ms` } as React.CSSProperties}
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-primary">
                  <Quote className="h-5 w-5" />
                </span>
                <p className="text-sm text-muted-foreground">{q}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-5 sm:hidden">
        <Button asChild variant="outline" className="w-full">
          <Link href="/explore">
            Browse all <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  )
}

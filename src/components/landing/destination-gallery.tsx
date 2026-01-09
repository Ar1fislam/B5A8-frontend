'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, ArrowUpRight } from 'lucide-react'

type Destination = {
  name: string
  country: string
  people: number
  imageSrc: string
}

const POOL: Destination[] = [
  { name: 'Paris', country: 'France', people: 142, imageSrc: '/images/landing/destinations/paris.jpg' },
  { name: 'Bangkok', country: 'Thailand', people: 112, imageSrc: '/images/landing/destinations/bangkok.jpg' },
  // FIX: you had "sydne.jpg" (typo). Use "sydney.jpg" or your real filename.
  { name: 'Sydney', country: 'Australia', people: 63, imageSrc: '/images/landing/destinations/sydney.jpg' },
  { name: 'Manila', country: 'Philippines', people: 57, imageSrc: '/images/landing/destinations/manila.jpg' },
  { name: 'Singapore', country: 'Singapore', people: 101, imageSrc: '/images/landing/destinations/singapore.jpg' },
  { name: 'Phnom Penh', country: 'Cambodia', people: 33, imageSrc: '/images/landing/destinations/phnom.jpg' },
  { name: 'Lisbon', country: 'Portugal', people: 44, imageSrc: '/images/landing/destinations/lisbon.jpg' },
  { name: 'Reykjavik', country: 'Iceland', people: 21, imageSrc: '/images/landing/destinations/iceland.jpg' },
  { name: 'Cape Town', country: 'South Africa', people: 54, imageSrc: '/images/landing/destinations/capetown.jpg' },
]

function shuffle<T>(arr: T[]) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function DestinationGallery() {
  const [destinations, setDestinations] = useState<Destination[]>([])

  useEffect(() => {
    const picked = shuffle(POOL)
      .slice(0, 6)
      .map((d) => ({
        ...d,
        people: Math.max(8, d.people + Math.floor((Math.random() - 0.5) * 40)),
      }))

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDestinations(picked)
  }, [])

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="rounded-full">Trending</Badge>
            <Badge variant="outline" className="rounded-full">By active plans</Badge>
          </div>
          <h2 className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">Pick a destination</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Join a plan heading there, or create your own and invite matches.
          </p>
        </div>

        <Button asChild variant="outline" className="hidden sm:inline-flex">
          <Link href="/destinations">
            Explore all <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {destinations.map((d, i) => {
          const imageName = `${d.name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')}.jpg`

          return (
            <Card
              key={`${d.name}-${i}`}
              className="group overflow-hidden rounded-2xl border bg-card/50 backdrop-blur transition hover:-translate-y-1 hover:shadow-lg motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2"
              style={{ animationDelay: `${i * 80}ms` } as React.CSSProperties}
            >
              <div className="relative h-44 overflow-hidden sm:h-52">
                <Image
                  src={d.imageSrc}
                  alt={`${d.name}, ${d.country}`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />

                <div className="absolute bottom-3 left-3 text-white">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <p className="text-sm font-medium">
                      {d.name}, {d.country}
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-white/85">{d.people} travelers planning</p>
                </div>

                <div className="absolute right-3 top-3 rounded-full bg-white/10 px-2 py-1 text-xs text-white backdrop-blur-sm">
                  <span className="font-mono text-[11px]">{imageName}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 p-4">
                <p className="text-sm text-muted-foreground">See matching plans</p>
                <Button asChild size="sm" className="rounded-xl transition group-hover:translate-x-0.5">
                  <Link href="/explore">Find buddies</Link>
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="mt-5 sm:hidden">
        <Button asChild variant="outline" className="w-full">
          <Link href="/destinations">
            Explore all <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  )
}




// import Link from 'next/link'
// import Image from 'next/image'
// import { Card } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import { MapPin, ArrowUpRight } from 'lucide-react'

// export default function DestinationGallery() {
//   const destinations = [
//     { name: 'Tokyo', country: 'Japan', people: 128, image: '/images/landing/destinations/tokyo.jpg' },
//     { name: 'Bali', country: 'Indonesia', people: 95, image: '/images/landing/destinations/bali.jpg' },
//     { name: 'Paris', country: 'France', people: 142, image: '/images/landing/destinations/paris.jpg' },
//     { name: 'Bangkok', country: 'Thailand', people: 112, image: '/images/landing/destinations/bangkok.jpg' },
//     { name: 'Sydney', country: 'Australia', people: 63, image: '/images/landing/destinations/sydney.jpg' },
//     { name: 'New York', country: 'USA', people: 78, image: '/images/landing/destinations/new-york.jpg' },
//   ] as const

//   return (
//     <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
//       <div className="flex items-end justify-between gap-4">
//         <div>
//           <div className="flex items-center gap-2">
//             <Badge variant="secondary" className="rounded-full">Trending</Badge>
//             <Badge variant="outline" className="rounded-full">By active plans</Badge>
//           </div>
//           <h2 className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">Pick a destination</h2>
//           <p className="mt-1 text-sm text-muted-foreground">
//             Join a plan heading there, or create your own and invite matches.
//           </p>
//         </div>

//         <Button asChild variant="outline" className="hidden sm:inline-flex">
//           <Link href="/destinations">
//             Explore all <ArrowUpRight className="ml-2 h-4 w-4" />
//           </Link>
//         </Button>
//       </div>

//       <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//         {destinations.map((d) => (
//           <Card
//             key={d.image}
//             className="group overflow-hidden rounded-2xl border bg-card/50 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-lg"
//           >
//             <div className="relative h-44 overflow-hidden sm:h-52">
//               <Image
//                 src={d.image}
//                 alt={`${d.name}, ${d.country}`}
//                 fill
//                 className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
//               <div className="absolute bottom-3 left-3 text-white">
//                 <div className="flex items-center gap-2">
//                   <MapPin className="h-4 w-4" />
//                   <p className="text-sm font-medium">{d.name}, {d.country}</p>
//                 </div>
//                 <p className="mt-1 text-xs text-white/85">{d.people} travelers planning</p>
//               </div>
//             </div>

//             <div className="flex items-center justify-between gap-3 p-4">
//               <p className="text-sm text-muted-foreground">See matching plans</p>
//               <Button asChild size="sm" className="rounded-xl">
//                 <Link href="/explore">Find buddies</Link>
//               </Button>
//             </div>
//           </Card>
//         ))}
//       </div>

//       <div className="mt-5 sm:hidden">
//         <Button asChild variant="outline" className="w-full">
//           <Link href="/destinations">
//             Explore all <ArrowUpRight className="ml-2 h-4 w-4" />
//           </Link>
//         </Button>
//       </div>
//     </section>
//   )
// }

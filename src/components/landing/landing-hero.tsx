'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ArrowRight, Compass, MapPinned, Trees, Sparkles } from 'lucide-react'


function HeroImageSlider() {
  const slides = [
    '/images/landing/hero.jpg',
    '/images/landing/hero2.jpg',
    '/images/landing/hero3.jpg',
  ]

  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || slides.length <= 1) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 3500)
    return () => window.clearInterval(id)
  }, [paused, slides.length])

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length)
  const next = () => setIndex((i) => (i + 1) % slides.length)

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* This div keeps the exact height you already had on Image */}
      <div className="relative h-[360px] w-full sm:h-[420px] lg:h-[520px]">
        {slides.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt="Travelers in nature"
            fill
            priority={i === 0}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className={[
              'object-cover transition-all duration-300',
              'hover:scale-[1.02]',
              i === index ? 'opacity-100' : 'opacity-0',
            ].join(' ')}
          />
        ))}
      </div>

      {slides.length > 1 && (
        <>
          {/* <button
            type="button"
            aria-label="Previous image"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/70 p-2 backdrop-blur hover:bg-background"
          >
          
          </button>

          <button
            type="button"
            aria-label="Next image"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/70 p-2 backdrop-blur hover:bg-background"
          >
           
          </button> */}

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={[
                  'h-2 w-2 rounded-full transition-all',
                  i === index ? 'w-6 bg-primary' : 'bg-foreground/30 hover:bg-foreground/50',
                ].join(' ')}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}



export default function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/14 blur-3xl animate-app-float" />
        <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-accent/18 blur-3xl animate-app-float [animation-delay:-6s]" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-16">
        <div className="lg:col-span-6 animate-app-fade-up">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="rounded-full">
              New: Forest vibe
            </Badge>
            <Badge variant="outline" className="rounded-full">
              Trips with better chemistry
            </Badge>
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
            Build a plan. Find your people. Go.
          </h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            A planning-first travel community—post your itinerary, match by pace and budget, and keep
            coordination simple.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/register">
                <Sparkles className="mr-2 h-4 w-4" />
                Create your profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/explore">
                <Compass className="mr-2 h-4 w-4" />
                Browse travelers
              </Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { label: 'Faster matching', value: 'Same-day', icon: <MapPinned className="h-4 w-4" /> },
              { label: 'Better fit', value: 'Pace + budget', icon: <Trees className="h-4 w-4" /> },
              { label: 'Less chaos', value: 'Plan-first', icon: <Sparkles className="h-4 w-4" /> },
            ].map((s) => (
              <Card
                key={s.label}
                className="rounded-2xl border bg-card/60 p-4 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <span className="text-muted-foreground">{s.icon}</span>
                </div>
                <p className="mt-2 text-xl font-semibold tracking-tight">{s.value}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="relative overflow-hidden rounded-3xl border bg-card/50 shadow-sm backdrop-blur">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/10" />
            {/* <Image
              src="/images/landing/hero.jpg"
              alt="Travelers in nature"
              width={1400}
              height={1000}
              priority
              className="h-[360px] w-full object-cover transition-transform duration-500 hover:scale-[1.02] sm:h-[420px] lg:h-[520px]"
            /> */}
            <HeroImageSlider />
          </div>
        </div>
      </div>
    </section>
  )
}
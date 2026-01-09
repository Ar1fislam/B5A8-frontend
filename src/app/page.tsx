// // frontend/src/app/page.tsx

// import { HeroSection } from '@/components/home/hero-section'
// import { HowItWorks } from '@/components/home/how-it-works'
// import { Testimonials } from '@/components/home/testimonials'

// import CtaSection from '@/components/home/cta-section'
// import PopularDestination from '@/components/home/popular-destination'
// import WcuSection from '@/components/home/wcu-section'
// import TopRatedTravelers from '@/components/home/top-rated-travelers'
// import SafetyTipsSection from '@/components/home/safety-tips-section'

// export default function HomePage() {
//   return (
//     <div className="min-h-screen">
//       {/* Hero Section */}
//       <HeroSection />

//       {/* How It Works Section */}
//       <HowItWorks />

//       {/* Popular Destinations Section */}
//       <PopularDestination />

//       {/* Top-Rated Travelers Section */}
//       <TopRatedTravelers />

//       {/* Why Choose Us Section */}
//       <WcuSection />

//       {/* Safety Tips Section */}
//       <SafetyTipsSection />

//       {/* Testimonials Section */}
//       <Testimonials />

//       {/* CTA Section */}
//       <CtaSection />
//     </div>
//   )
// }
// src/app/page.tsx

import FinalCallout from '@/components/landing/final-callout'
import FeatureMosaic from '@/components/landing/feature-mosaic'
import TripFlow from '@/components/landing/trip-flow'
import DestinationGallery from '@/components/landing/destination-gallery'
import CommunitySpotlight from '@/components/landing/community-spotlight'
import LandingHero from '@/components/landing/landing-hero'
import TripSignals from '@/components/landing/trip-signals'



export default function HomePage() {
  return (
    <>
      <LandingHero />
      <FeatureMosaic />
      <TripFlow />
      <DestinationGallery />
      <CommunitySpotlight />
      <TripSignals />
      <FinalCallout />
    </>
  )
}

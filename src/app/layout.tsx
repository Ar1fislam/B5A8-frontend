// // frontend/src/app/layout.tsx
// // frontend/app/layout.tsx
// import type React from 'react'
// import type { Metadata } from 'next'
// import { AuthProvider } from '@/lib/auth-context'
// import { Navbar } from '@/components/layout/navbar'
// import { Footer } from '@/components/layout/footer'
// import { Toaster } from 'sonner'
// import './globals.css'
// import { ThemeProvider } from '@/components/theme-provider'

// export const metadata: Metadata = {
//   title: 'Travel Buddy & Meetup - Find Your Perfect Travel Companion',
//   description:
//     'Connect with like-minded travelers, plan adventures together, and create unforgettable memories. Join 10,000+ travelers worldwide on TravelBuddy.',
//   keywords: [
//     'travel buddy',
//     'travel companion',
//     'find travel partner',
//     'solo travel',
//     'group travel',
//     'meetup',
//     'travel planning',
//   ],
//   metadataBase: new URL(
//     process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
//   ),
//   openGraph: {
//     title: 'Travel Buddy & Meetup - Find Your Perfect Travel Companion',
//     description:
//       'Connect with like-minded travelers and plan adventures together',
//     type: 'website',
//     locale: 'en_US',
//   },
//   twitter: {
//     card: 'summary_large_image',
//     title: 'Travel Buddy & Meetup',
//     description:
//       'Connect with like-minded travelers and plan adventures together',
//   },
// }

// export const viewport = {
//   themeColor: '#000000',
//   userScalable: true,
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html lang="en">
//       <body className="font-sans">
//         <ThemeProvider
//           attribute="class"
//           defaultTheme="system"
//           enableSystem
//           disableTransitionOnChange
//         >
//           <AuthProvider>
//             <div className="flex min-h-screen flex-col">
//               <Navbar />
//               <main className="flex-1 container mx-auto px-4 py-4">
//                 {children}
//               </main>
//               <Footer />
//               <Toaster richColors closeButton />
//             </div>
//           </AuthProvider>
//         </ThemeProvider>
//       </body>
//     </html>
//   )
// }

// frontend/src/app/layout.tsx
// frontend/app/layout.tsx
import type React from 'react'
import type { Metadata } from 'next'
import { AuthProvider } from '@/lib/auth-context'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Toaster } from 'sonner'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'Travel Buddy & Meetup - Find Your Perfect Travel Companion',
  description:
    'Connect with like-minded travelers, plan adventures together, and create unforgettable memories. Join 10,000+ travelers worldwide on TravelBuddy.',
  keywords: [
    'travel buddy',
    'travel companion',
    'find travel partner',
    'solo travel',
    'group travel',
    'meetup',
    'travel planning',
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Travel Buddy & Meetup - Find Your Perfect Travel Companion',
    description: 'Connect with like-minded travelers and plan adventures together',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Travel Buddy & Meetup',
    description: 'Connect with like-minded travelers and plan adventures together',
  },
}

export const viewport = {
  themeColor: '#000000',
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            {/* Decorative, responsive background (design-only) */}
            <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.06),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
              <div className="absolute left-1/2 top-[-18rem] h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-primary/20 via-muted/30 to-transparent blur-3xl animate-app-float" />
              <div className="absolute bottom-[-18rem] right-[-12rem] h-[30rem] w-[30rem] rounded-full bg-gradient-to-tr from-muted/35 via-accent/20 to-transparent blur-3xl animate-app-float [animation-delay:-4s]" />
            </div>

            <div className="flex min-h-screen flex-col">
              <Navbar />

              <main className="flex-1">
                {/* Better spacing for all devices */}
                <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
                  <div className="animate-app-fade-up">{children}</div>
                </div>
              </main>

              <Footer />
              <Toaster position="top-right" richColors closeButton visibleToasts={1} />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

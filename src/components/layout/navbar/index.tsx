  // // frontend/components/layout/navbar/index.tsx
  // 'use client'

  // import { useState, useEffect } from 'react'
  // import { usePathname, useRouter } from 'next/navigation'
  // import { Button } from '@/components/ui/button'
  // import { useAuth } from '@/lib/auth-context'
  // import { reviewAPI } from '@/lib/api'
  // import { toast } from 'sonner'
  // import { cn } from '@/lib/utils'
  // import { Logo } from './Logo'
  // import { DesktopNav } from './DesktopNav'
  // import { MobileNav } from './MobileNav'
  // import { Notifications } from './Notifications'
  // import { UserMenu } from './UserMenu'
  // import { getNavItems } from './NavItems'
  // import { Menu, X } from 'lucide-react'
  // import { ModeToggle } from './ThemeToggler'

  // export function Navbar() {
  //   const pathname = usePathname()
  //   const router = useRouter()
  //   const { user, logout, isLoading } = useAuth()
  //   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  //   const [pendingReviews, setPendingReviews] = useState(0)

  //   const handleLogout = async () => {
  //     try {
  //       await logout()
  //       toast.success('Logged out successfully')
  //     } catch (error) {
  //       toast.error('Failed to logout')
  //     }
  //   }

  //   const isActive = (path: string) => {
  //     if (path === '/') return pathname === path
  //     return pathname.startsWith(path)
  //   }

  //   useEffect(() => {
  //     const fetchPendingReviews = async () => {
  //       if (user) {
  //         try {
  //           const response = await reviewAPI.getPendingReviews()
  //           const reviews = response.data.reviews || []
  //           setPendingReviews(reviews.length)
  //         } catch (error) {
  //           console.error('Error fetching pending reviews:', error)
  //         }
  //       }
  //     }

  //     fetchPendingReviews()
  //   }, [user])

  //   // Get navigation items
  //   const navItems = getNavItems(pendingReviews)
  //   const publicNavItems = navItems.public
  //   const userNavItems = navItems.user
  //   const adminNavItems = navItems.admin

  //   return (
  //     <nav className="sticky top-0 z-50 w-full px-4 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
  //       <div className="container flex h-16 items-center justify-between">
  //         {/* Left Section: Logo & Desktop Navigation */}
  //         <div className="flex items-center gap-2">
  //           <Logo />
  //           <DesktopNav navItems={publicNavItems} isActive={isActive} />
  //         </div>

  //         {/* Right Section: Actions & Auth */}
  //         <div className="flex items-center gap-4">
  //           <ModeToggle />

  //           {/* Notifications */}
  //           {user && <Notifications pendingReviews={pendingReviews} />}

  //           {/* Auth State */}
  //           {isLoading ? (
  //             <div className="h-8 w-20 bg-muted rounded-md animate-pulse" />
  //           ) : user ? (
  //             <UserMenu
  //               user={user}
  //               userNavItems={userNavItems}
  //               adminNavItems={adminNavItems}
  //               onLogout={handleLogout}
  //             />
  //           ) : (
  //             <div className="hidden md:flex items-center gap-2">
  //               <Button
  //                 variant="ghost"
  //                 size="sm"
  //                 onClick={() => router.push('/login')}
  //                 className={cn(isActive('/login') && 'bg-accent')}
  //               >
  //                 Login
  //               </Button>
  //               <Button
  //                 size="sm"
  //                 onClick={() => router.push('/register')}
  //                 className={cn(isActive('/register') && 'bg-primary/90')}
  //               >
  //                 Sign Up
  //               </Button>
  //             </div>
  //           )}

  //           {/* Mobile Menu Button */}
  //           <Button
  //             variant="ghost"
  //             size="icon"
  //             className="md:hidden"
  //             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
  //           >
  //             {isMobileMenuOpen ? (
  //               <X className="h-5 w-5" />
  //             ) : (
  //               <Menu className="h-5 w-5" />
  //             )}
  //           </Button>
  //         </div>
  //       </div>

  //       {/* Mobile Navigation */}
  //       <MobileNav
  //         isOpen={isMobileMenuOpen}
  //         onClose={() => setIsMobileMenuOpen(false)}
  //         user={user}
  //         navItems={publicNavItems}
  //         userNavItems={userNavItems}
  //         adminNavItems={adminNavItems}
  //         pendingReviews={pendingReviews}
  //         isActive={isActive}
  //         onLogout={handleLogout}
  //       />
  //     </nav>
  //   )
  // }


  // frontend/components/layout/navbar/index.tsx
// frontend/components/layout/navbar/index.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { reviewAPI } from '@/lib/api'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { DesktopNav } from './DesktopNav'
import { MobileNav } from './MobileNav'
import { Notifications } from './Notifications'
import { UserMenu } from './UserMenu'
import { getNavItems } from './NavItems'
import { Menu, X } from 'lucide-react'

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, isLoading } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [pendingReviews, setPendingReviews] = useState(0)

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  const isActive = (path: string) => {
    if (path === '/') return pathname === path
    return pathname.startsWith(path)
  }

  useEffect(() => {
    const fetchPendingReviews = async () => {
      if (user) {
        try {
          const response = await reviewAPI.getPendingReviews()
          const reviews = response.data.reviews || []
          setPendingReviews(reviews.length)
        } catch (error) {
          console.error('Error fetching pending reviews:', error)
        }
      }
    }

    fetchPendingReviews()
  }, [user])

  // Get navigation items
  const navItems = getNavItems(pendingReviews)
  const publicNavItems = navItems.public
  const userNavItems = navItems.user
  const adminNavItems = navItems.admin

  return (
    <nav className="sticky top-0 z-50 w-full  border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto h-16 w-full max-w-8xl px-4 sm:px-6 lg:px-8">
        {/* 3-column layout keeps center nav truly centered */}
        <div className="grid h-full grid-cols-[1fr_auto_1fr] items-center">
          {/* Left: Brand (no logo component) */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-3xl font-semibold tracking-tight text-foreground transition-colors hover:text-foreground/80"
            >
              TravelBuddy
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <div className="hidden md:flex justify-center">
            <DesktopNav navItems={publicNavItems} isActive={isActive} />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user && <Notifications pendingReviews={pendingReviews} />}

            {isLoading ? (
              <div className="h-9 w-24 rounded-md bg-muted/70 animate-pulse" />
            ) : user ? (
              <UserMenu
                user={user}
                userNavItems={userNavItems}
                adminNavItems={adminNavItems}
                onLogout={handleLogout}
              />
            ) : (
              <div className="hidden md:flex  items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/login')}
                  className={cn('transition-colors', isActive('/login') && 'bg-accent')}
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => router.push('/register')}
                  className={cn('transition-colors', isActive('/register') && 'bg-primary/90')}
                >
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden transition-transform active:scale-95"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        user={user}
        navItems={publicNavItems}
        userNavItems={userNavItems}
        adminNavItems={adminNavItems}
        pendingReviews={pendingReviews}
        isActive={isActive}
        onLogout={handleLogout}
      />
    </nav>
  )
}


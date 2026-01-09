// frontend/components/layout/navbar/MobileNav.tsx
// frontend/components/layout/navbar/MobileNav.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Search, Menu, X, User, Settings, LogOut } from 'lucide-react'
import { getInitials } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { NavItem } from './NavItems'
import { AuthUser } from '@/types'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  user: AuthUser | null
  navItems: NavItem[]
  userNavItems: NavItem[]
  adminNavItems: NavItem[]
  pendingReviews: number
  isActive: (path: string) => boolean
  onLogout: () => Promise<void>
}

export function MobileNav({
  isOpen,
  onClose,
  user,
  navItems,
  userNavItems,
  adminNavItems,
  pendingReviews,
  isActive,
  onLogout,
}: MobileNavProps) {
  const router = useRouter()

  if (!isOpen) return null

  return (
    <div className="md:hidden  border-t">
      <div className="container py-4 space-y-3">
        {/* Navigation Items */}
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
                isActive(item.href) && 'bg-accent'
              )}
              onClick={onClose}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>

        {/* Search Bar */}
        <div className="px-3 py-2">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => {
              router.push('/explore')
              onClose()
            }}
          >
            <Search className="h-4 w-4" />
            Search travelers...
          </Button>
        </div>

        {/* Auth State */}
        {user ? (
          <>
            <Separator />
            <div className="space-y-1 px-3">
              {/* User Info */}
              <div className="flex items-center gap-3 py-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user.profile?.profileImage ?? undefined}
                    alt={user.profile?.fullName}
                  />
                  <AvatarFallback>
                    {getInitials(user.profile?.fullName || user.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user.profile?.fullName || 'Traveler'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
                {pendingReviews > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {pendingReviews}
                  </Badge>
                )}
              </div>

              {/* User Navigation */}
              {userNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
                    isActive(item.href) && 'bg-accent'
                  )}
                  onClick={onClose}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    {item.label}
                  </div>
                  {item.badge && (
                    <Badge variant="destructive" className="h-5 px-1.5">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}

              {/* Admin Navigation */}
              {user.role === 'ADMIN' && (
                <>
                  <div className="pt-2">
                    <p className="px-3 text-xs font-medium text-muted-foreground mb-1">
                      Admin
                    </p>
                    {adminNavItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                        onClick={onClose}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}

              <Separator className="my-2" />

              {/* Profile & Settings */}
              <Link
                href="/profile"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                onClick={onClose}
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                onClick={onClose}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>

              {/* Logout */}
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={async () => {
                  await onLogout()
                  onClose()
                }}
              >
                <LogOut className="h-4 w-4" />
                Log out
              </Button>
            </div>
          </>
        ) : (
          <>
            <Separator />
            <div className="grid grid-cols-2 gap-2 px-3">
              <Button
                variant="outline"
                onClick={() => {
                  router.push('/login')
                  onClose()
                }}
              >
                Login
              </Button>
              <Button
                onClick={() => {
                  router.push('/register')
                  onClose()
                }}
              >
                Sign Up
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
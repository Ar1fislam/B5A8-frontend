// // frontend/components/layout/navbar/UserMenu.tsx
// frontend/components/layout/navbar/UserMenu.tsx
'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { User, Settings, LogOut, ChevronRight } from 'lucide-react'
import { getInitials } from '@/lib/utils'
import type { NavItem } from './NavItems'
import type { AuthUser } from '@/types'

interface UserMenuProps {
  user: AuthUser | null
  userNavItems: NavItem[]
  adminNavItems: NavItem[]
  onLogout: () => Promise<void>
}

function OnlineDot() {
  return (
    <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-background bg-emerald-500" />
  )
}

export function UserMenu({ user, userNavItems, adminNavItems, onLogout }: UserMenuProps) {
  const router = useRouter()

  if (!user) {
    return (
      <Card>
        <CardContent>User Not Found</CardContent>
      </Card>
    )
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full p-0 transition-transform active:scale-95"
        >
          <div className="relative">
            <Avatar className="h-9 w-9">
              <AvatarImage
                className="h-full w-full object-cover"
                src={user.profile?.profileImage ?? undefined}
                alt={user.profile?.fullName}
              />
              <AvatarFallback>{getInitials(user.profile?.fullName || user.email)}</AvatarFallback>
            </Avatar>

            {/* Green online indicator */}
            <OnlineDot />
          </div>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[320px] p-0 sm:w-[360px] data-[state=open]:duration-300 data-[state=closed]:duration-200"
      >
        <div className="flex h-full flex-col">
          <SheetHeader className="px-4 pt-4 pb-3">
            <SheetTitle className="text-base">Dashboard</SheetTitle>

            <div className="mt-3 flex items-center gap-3 rounded-lg border bg-card/60 p-3">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    className="h-full w-full object-cover"
                    src={user.profile?.profileImage ?? undefined}
                    alt={user.profile?.fullName}
                  />
                  <AvatarFallback>
                    {getInitials(user.profile?.fullName || user.email)}
                  </AvatarFallback>
                </Avatar>

                {/* Green online indicator */}
                <OnlineDot />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium leading-none">
                  {user.profile?.fullName || 'Traveler'}
                </p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>

                {/* Optional tiny status label */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-xs text-muted-foreground">Online</span>
                </div>
              </div>
            </div>
          </SheetHeader>

          <Separator />

          <ScrollArea className="flex-1">
            <div className="px-2 py-3">
              <div className="px-2 pb-2 text-xs font-medium text-muted-foreground">Main</div>

              <div className="space-y-1">
                {userNavItems.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground group-hover:text-foreground">
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <Badge variant="destructive" className="h-5 px-1.5">
                            {item.badge}
                          </Badge>
                        )}
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                    </Link>
                  </SheetClose>
                ))}
              </div>

              {user.role === 'ADMIN' && (
                <>
                  <Separator className="my-3" />
                  <div className="px-2 pb-2 text-xs font-medium text-muted-foreground">
                    Admin
                  </div>

                  <div className="space-y-1">
                    {adminNavItems.map((item) => (
                      <SheetClose asChild key={item.href}>
                        <Link
                          href={item.href}
                          className="group flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground group-hover:text-foreground">
                              {item.icon}
                            </span>
                            <span>{item.label}</span>
                          </div>

                          <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                </>
              )}

              <Separator className="my-3" />
              <div className="px-2 pb-2 text-xs font-medium text-muted-foreground">Account</div>

              <div className="space-y-1">
                <SheetClose asChild>
                  <button
                    type="button"
                    onClick={() => router.push('/profile')}
                    className="group flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
                  >
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                      <span>Profile</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                </SheetClose>

                <SheetClose asChild>
                  <button
                    type="button"
                    onClick={() => router.push('/settings')}
                    className="group flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
                  >
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                      <span>Settings</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                </SheetClose>
              </div>
            </div>
          </ScrollArea>

          <Separator />

          <div className="p-3">
            <SheetClose asChild>
              <Button variant="destructive" className="w-full" onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

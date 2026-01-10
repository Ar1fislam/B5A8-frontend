// // frontend/components/layout/navbar/DesktopNav.tsx

// frontend/components/layout/navbar/DesktopNav.tsx
'use client'

import Link from 'next/link'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'
import type { NavItem } from './NavItems'

interface DesktopNavProps {
  navItems: NavItem[]
  isActive: (path: string) => boolean
}

export function DesktopNav({ navItems, isActive }: DesktopNavProps) {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="gap-1">
        {navItems.map((item) => (
          <NavigationMenuItem key={item.href}>
            <NavigationMenuLink asChild>
              <Link
                href={item.href}
                className={cn(
                  'rounded-full px-3 py-2 text-sm font-medium transition-colors',
                  'hover:bg-accent hover:text-foreground',
                  isActive(item.href) ? 'bg-accent text-foreground' : 'text-muted-foreground'
                )}
              >
                {item.label}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}



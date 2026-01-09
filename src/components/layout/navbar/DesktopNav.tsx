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



// 'use client'

// import Link from 'next/link'
// import {
//   NavigationMenu,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
// } from '@/components/ui/navigation-menu'
// import { Button } from '@/components/ui/button'
// import { Search } from 'lucide-react'
// import { useRouter } from 'next/navigation'
// import { cn } from '@/lib/utils'
// import { NavItem } from './NavItems'

// interface DesktopNavProps {
//   navItems: NavItem[]
//   isActive: (path: string) => boolean
// }

// export function DesktopNav({ navItems, isActive }: DesktopNavProps) {
//   const router = useRouter()

//   return (
//     <div className="hidden md:flex items-center gap-4">
//       {/* Navigation Menu */}
//       <NavigationMenu className="ml-8">
//         <NavigationMenuList>
//           {navItems.map((item) => (
//             <NavigationMenuItem key={item.href}>
//               <Link href={item.href} passHref>
//                 <NavigationMenuLink
//                   className={cn(
//                     'group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50',
//                     isActive(item.href)
//                       ? 'bg-accent text-accent-foreground'
//                       : 'text-foreground/60'
//                   )}
//                 >
//                   <span className="flex items-center gap-2">
//                     {item.icon}
//                     {item.label}
//                   </span>
//                 </NavigationMenuLink>
//               </Link>
//             </NavigationMenuItem>
//           ))}
//         </NavigationMenuList>
//       </NavigationMenu>

//       {/* Search Button */}
//       <Button
//         variant="ghost"
//         size="sm"
//         className="gap-2"
//         onClick={() => router.push('/explore')}
//       >
//         <Search className="h-4 w-4" />
//         <span className="text-sm">Search travelers...</span>
//       </Button>
//     </div>
//   )
// }
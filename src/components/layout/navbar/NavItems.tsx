// frontend/components/layout/navbar/NavItems.tsx
import {
  Home,
  Compass,
  Users,
  Calendar,
  BarChart,
  MessageSquare,
  Star,
  Shield,
  Info,
  Contact,
  HelpCircle,
} from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: number
  adminOnly?: boolean
}

export const getNavItems = (pendingReviews: number = 0) => ({
  // Public navigation items
  public: [
    {
      label: 'Home',
      href: '/',
      icon:''
    },
    {
      label: 'Explore',
      href: '/explore',
      icon:''
    },
    {
      label: 'Find Match',
      href: '/matches',
      icon:''
    },
    {
      label: 'About',
      href: '/about',
      icon:''
    },
    {
      label: 'Contact',
      href: '/contact',
      icon:''
    },

  ],

  // User navigation items (when logged in)
  user: [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <BarChart className="h-4 w-4" />,
    },
    {
      label: 'Travel Plans',
      href: '/travel-plans',
      icon: <Calendar className="h-4 w-4" />,
    },
/*     {
      label: 'Messages',
      href: '/messages',
      icon: <MessageSquare className="h-4 w-4" />,
    }, */
    {
      label: 'Reviews',
      href: '/reviews',
      icon: <Star className="h-4 w-4" />,
      badge: pendingReviews > 0 ? pendingReviews : undefined,
    },
  ],

  // Admin navigation items
  admin: [
    {
      label: 'Admin Dashboard',
      href: '/admin/dashboard',
      icon: <Shield className="h-4 w-4" />,
      adminOnly: true,
    },
    {
      label: 'Manage Users',
      href: '/admin/users',
      icon: <Users className="h-4 w-4" />,
      adminOnly: true,
    },
    {
      label: 'Manage Plans',
      href: '/admin/travel-plans',
      icon: <Calendar className="h-4 w-4" />,
      adminOnly: true,
    },
  ],
})
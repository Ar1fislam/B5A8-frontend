'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { toast } from 'sonner'
import { authAPI } from '@/lib/api'
import type { AuthUser } from '@/types'

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: {
    email: string
    password: string
    fullName: string
  }) => Promise<void>
  logout: () => Promise<void>
  updateUser: (user: AuthUser) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isCheckedAuth, setIsCheckedAuth] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const checkAuth = useCallback(async () => {
    try {
      const result = await authAPI.getMe()
      setUser(result.data.user)
    } catch (error) {
      setUser(null)
    } finally {
      setIsCheckedAuth(true)
    }
  }, [])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted) {
      setIsLoading(true)
      checkAuth().finally(() => setIsLoading(false))
    }
  }, [isMounted, checkAuth])


// Route Protection
useEffect(() => {
  if (!isCheckedAuth) return

  const publicRoutes = [
    '/login',
    '/register',
    '/',
    '/explore',
    '/about',
    '/contact',
    '/api/auth',
    '/_next',
  ]

  const adminRoutes = ['/admin']

  const isPublicRoute = publicRoutes.some((route) =>
    route === '/' ? pathname === '/' : pathname.startsWith(route)
  )
  const isAdminRoute = adminRoutes.some((route) =>
    route === '/' ? pathname === '/' : pathname.startsWith(route)
  )

  // Get redirect attempt counter
  const redirectKey = `${pathname}-${user ? 'authenticated' : 'unauthenticated'}`
  const lastRedirect = sessionStorage.getItem('lastRedirect')
  let redirectCount = parseInt(sessionStorage.getItem('redirectCount') || '0')

  // Check for loop detection
  if (lastRedirect === redirectKey) {
    redirectCount++
    sessionStorage.setItem('redirectCount', redirectCount.toString())
    
    // Break infinite loop after 2 attempts
    if (redirectCount > 2) {
      // console.error('Infinite redirect loop detected. Breaking cycle.')
      sessionStorage.removeItem('redirectCount')
      sessionStorage.removeItem('lastRedirect')
      
      // Redirect to safe fallback
      if (user) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
      return
    }
  } else {
    redirectCount = 1
    sessionStorage.setItem('redirectCount', '1')
  }

  // Store current redirect attempt
  sessionStorage.setItem('lastRedirect', redirectKey)

  // Load route history from sessionStorage
  const historyStr = sessionStorage.getItem('routeHistory')
  const routeHistory: string[] = historyStr ? JSON.parse(historyStr) : []
  if (routeHistory.length > 10) routeHistory.shift()

  // Avoid duplicate consecutive routes
  if (routeHistory.length === 0 || routeHistory[routeHistory.length - 1] !== pathname) {
    routeHistory.push(pathname)
    sessionStorage.setItem('routeHistory', JSON.stringify(routeHistory))
  }

  // Handle access with loop prevention
  if (user) {
    

    // Admin route check
    if (isAdminRoute && user.role !== 'ADMIN') {
      // Find a safe route to redirect to (not admin route)
      const safeRoutes = routeHistory.filter(route => 
        !adminRoutes.some(adminRoute => route.startsWith(adminRoute))
      )
      const previous = safeRoutes[safeRoutes.length - 2] || '/dashboard'
      
      // Only redirect if not already on the target route
      if (previous !== pathname) {
        router.push(previous)
      }
      return
    }
    
    // If logged in, prevent access to login/register
    if (pathname === '/login' || pathname === '/register') {
      router.push('/dashboard')
      return
    }
    
  } else if (!isPublicRoute) {
    // For unauthenticated users, redirect to login
    if (pathname !== '/login') {
      router.push('/login')
    }
  }
  
  // Reset redirect count on successful navigation
  if (!isPublicRoute || (user && pathname !== '/verify-email')) {
    sessionStorage.removeItem('redirectCount')
    sessionStorage.removeItem('lastRedirect')
  }
}, [user, pathname, isCheckedAuth, router])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const result = await authAPI.login({ email, password })
      setUser(result.data.user)
      toast.success('Login successful!')
      router.push('/dashboard')
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Login failed')
      }
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: {
    email: string
    password: string
    fullName: string
  }) => {
    setIsLoading(true)
    try {
      const response = await authAPI.register(data)
      setUser(response.data.user)
      toast.success('Registration successful!')
      router.push('/dashboard')
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Registration failed')
      }
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await authAPI.logout()
      setUser(null)
      toast.success('Logged out successfully')
      router.push('/login')
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Logout failed')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = (updatedUser: AuthUser) => {
    setUser(updatedUser)
  }

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
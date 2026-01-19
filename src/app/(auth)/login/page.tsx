'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'

import {
  Eye,
  EyeOff,
  AtSign,
  KeyRound,
  Compass,
  Github,
  Chrome,
  Sparkles,
} from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },

  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      await login(data.email, data.password)
      toast.success('Login successful!')
      router.push('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  //demo login
  const DEMO = {
    admin: { email: 'admin@travelbuddy.local', password: 'Admin@12345' },
    user: { email: 'john@example.com', password: 'Demo@23456' },
  }

  const fillDemo = (role: 'admin' | 'user') => {
    setValue('email', DEMO[role].email, { shouldDirty: true })
    setValue('password', DEMO[role].password, { shouldDirty: true })
    clearErrors(['email', 'password'])
    setShowPassword(false)
  }


  return (
    <div className="relative mx-auto grid min-h-[calc(100vh-8rem)] w-full max-w-6xl items-center gap-6 px-4 py-8 md:grid-cols-2 md:px-6">
      {/* Decorative background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/15 blur-3xl animate-app-float" />
        <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-accent/20 blur-3xl animate-app-float [animation-delay:-5s]" />
      </div>

      {/* Left panel (hidden on small devices) */}
      <div className="hidden md:block">
        <div className="rounded-2xl border bg-card/60 p-8 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Compass className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">TravelBuddy</p>
              <p className="text-sm text-muted-foreground">Plan. Match. Go together.</p>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <h2 className="text-2xl font-semibold leading-tight">
              Pick up where you left off
            </h2>
            <p className="text-sm text-muted-foreground">
              Sign in to manage travel plans, review matches, and keep conversations moving.
            </p>
          </div>

          <div className="mt-8 grid gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              Cleaner profiles and smarter matching.
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              Built for mobile, tablet, and desktop.
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="animate-app-fade-up overflow-hidden border bg-card/70 backdrop-blur">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Compass className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-xl">Sign in</CardTitle>
              <CardDescription className="text-sm">
                Welcome back—let’s get you into your dashboard.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        

        <CardContent className="space-y-6">
          {/* Demo buttons */}
        <div className="flex gap-2">
          <Button type="button" variant="default" size="sm" onClick={() => fillDemo('user')}>
            User Demo
          </Button>
          <Button type="button" variant="default" size="sm" onClick={() => fillDemo('admin')}>
            Admin Demo
          </Button>
        </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <AtSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-9"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Your password"
                  className="pl-9 pr-10"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Row */}
            <div className="flex items-center justify-between gap-2">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border bg-background"
                />
                Keep me signed in
              </label>

              <Link
                href="/contact"
                className="text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Need help?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in…' : 'Continue'}
            </Button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">Or</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button type="button" variant="outline" className="w-full">
                <Chrome className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button type="button" variant="outline" className="w-full">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </div>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            New here?{' '}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

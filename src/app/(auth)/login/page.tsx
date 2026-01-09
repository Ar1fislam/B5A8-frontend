// 'use client'

// import { useState } from 'react'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { z } from 'zod'
// import { Button } from '@/components/ui/button'
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { useAuth } from '@/lib/auth-context'
// import { toast } from 'sonner'
// import { Eye, EyeOff, Mail, Lock, Plane } from 'lucide-react'

// const loginSchema = z.object({
//   email: z.string().email('Invalid email address'),
//   password: z.string().min(1, 'Password is required'),
// })

// type LoginFormData = z.infer<typeof loginSchema>

// export default function LoginPage() {
//   const router = useRouter()
//   const { login } = useAuth()
//   const [showPassword, setShowPassword] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginFormData>({
//     resolver: zodResolver(loginSchema),
//   })

//   const onSubmit = async (data: LoginFormData) => {
//     setIsLoading(true)
//     try {
//       await login(data.email, data.password)
//       toast.success('Login successful!')
//       router.push('/dashboard')
//     } catch (error) {
//       console.error('Login error:', error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/5 to-secondary/5 p-4">
//       <Card className="w-full max-w-md shadow-lg">
//         <CardHeader className="space-y-1">
//           <div className="flex items-center justify-center mb-2">
//             <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
//               <Plane className="h-6 w-6 text-primary" />
//             </div>
//           </div>
//           <CardTitle className="text-2xl font-bold text-center">
//             Welcome back
//           </CardTitle>
//           <CardDescription className="text-center">
//             Sign in to your account to continue your travel journey
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="john@example.com"
//                   className="pl-10"
//                   {...register('email')}
//                   disabled={isLoading}
//                 />
//               </div>
//               {errors.email && (
//                 <p className="text-sm text-destructive">
//                   {errors.email.message}
//                 </p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   id="password"
//                   type={showPassword ? 'text' : 'password'}
//                   placeholder="••••••••"
//                   className="pl-10 pr-10"
//                   {...register('password')}
//                   disabled={isLoading}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-4 w-4 text-muted-foreground" />
//                   ) : (
//                     <Eye className="h-4 w-4 text-muted-foreground" />
//                   )}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="text-sm text-destructive">
//                   {errors.password.message}
//                 </p>
//               )}
//             </div>

//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   id="remember"
//                   className="h-4 w-4 rounded border-gray-300"
//                 />
//                 <Label htmlFor="remember" className="text-sm">
//                   Remember me
//                 </Label>
//               </div>
//               <Link
//                 href="/forgot-password"
//                 className="text-sm text-primary hover:underline"
//               >
//                 Forgot password?
//               </Link>
//             </div>

//             <Button type="submit" className="w-full" disabled={isLoading}>
//               {isLoading ? 'Signing in...' : 'Sign in'}
//             </Button>
//           </form>

//           <div className="mt-6 text-center text-sm">
//             Don&apos;t have an account?{' '}
//             <Link
//               href="/register"
//               className="text-primary font-medium hover:underline"
//             >
//               Sign up
//             </Link>
//           </div>

//           <div className="relative my-6">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t" />
//             </div>
//             <div className="relative flex justify-center text-xs uppercase">
//               <span className="bg-background px-2 text-muted-foreground">
//                 Or continue with
//               </span>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <Button variant="outline" type="button" disabled={isLoading}>
//               <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
//                 <path
//                   d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                   fill="#4285F4"
//                 />
//                 <path
//                   d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                   fill="#34A853"
//                 />
//                 <path
//                   d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                   fill="#FBBC05"
//                 />
//                 <path
//                   d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                   fill="#EA4335"
//                 />
//               </svg>
//               Google
//             </Button>
//             <Button variant="outline" type="button" disabled={isLoading}>
//               <svg
//                 className="mr-2 h-4 w-4"
//                 fill="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
//               </svg>
//               GitHub
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

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

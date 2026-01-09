/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/admin/users/page.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import * as Dialog from '@radix-ui/react-dialog'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  Search,
  Users,
  Mail,
  MoreVertical,
  Eye,
  Shield,
  ShieldOff,
  X,
} from 'lucide-react'

import { useAuth } from '@/lib/auth-context'
import { adminAPI } from '@/lib/api'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'
import { GetUserByAdmin } from '@/types'

export default function AdminUsersPage() {
  const router = useRouter()
  const { user: currentUser } = useAuth()

  const [users, setUsers] = useState<GetUserByAdmin[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [selectedRole, setSelectedRole] = useState<'all' | 'user' | 'admin'>('all')

  // View modal state (fixes “View user doesn’t work” by not relying on a route)
  const [viewOpen, setViewOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<GetUserByAdmin | null>(null)

  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedStatus, selectedRole])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const filters: any = {}
      if (searchQuery) filters.search = searchQuery
      if (selectedStatus !== 'all') filters.status = selectedStatus
      if (selectedRole !== 'all') filters.role = selectedRole.toUpperCase()

      const result = await adminAPI.getAllUsers(page, 20, filters)
      setUsers(result.data?.users || [])
      setTotalPages(result.data?.pagination?.pages || 1)
    } catch (error) {
      toast.error('Failed to load users')
      console.error('Admin users error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchUsers()
  }

  const handleStatusUpdate = async (userId: string, isActive: boolean) => {
    try {
      await adminAPI.updateUserStatus(userId, { isActive })
      toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`)
      fetchUsers()
    } catch (error) {
      toast.error('Failed to update user status')
    }
  }

  const openUserView = (u: GetUserByAdmin) => {
    setSelectedUser(u)
    setViewOpen(true)
  }

  const chips = useMemo(() => {
    const statusLabel =
      selectedStatus === 'all' ? 'Any status' : selectedStatus === 'active' ? 'Active' : 'Inactive'
    const roleLabel =
      selectedRole === 'all' ? 'Any role' : selectedRole === 'admin' ? 'Admin' : 'User'
    return { statusLabel, roleLabel }
  }, [selectedRole, selectedStatus])

  return (
    <div className="container py-8">
      {/* Header banner (new design) */}
      <Card className="relative mb-8 overflow-hidden rounded-3xl border bg-card/60 backdrop-blur">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/12 blur-3xl animate-app-float" />
          <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-accent/18 blur-3xl animate-app-float [animation-delay:-6s]" />
        </div>

        <CardContent className="relative p-6 sm:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="animate-app-fade-up">
              <p className="text-xs text-muted-foreground">Admin Console</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                User control room
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Search accounts, check activity, and control access without leaving the page.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="outline" className="rounded-xl" onClick={() => router.push('/explore')}>
                Open Explore
              </Button>
              <Button className="rounded-xl" onClick={() => toast.info('Create user feature coming soon!')}>
                Create user
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search + filters (new look, no Tabs) */}
      <Card className="mb-6 rounded-3xl border bg-card/60 backdrop-blur">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <form onSubmit={handleSearch} className="w-full lg:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search name or email…"
                  className="h-11 rounded-2xl pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Status</span>
              {(['all', 'active', 'inactive'] as const).map((s) => (
                <Button
                  key={s}
                  type="button"
                  size="sm"
                  className="rounded-full"
                  variant={selectedStatus === s ? 'default' : 'outline'}
                  onClick={() => {
                    setPage(1)
                    setSelectedStatus(s)
                  }}
                >
                  {s === 'all' ? 'Any' : s}
                </Button>
              ))}

              <span className="ml-1 text-xs text-muted-foreground">Role</span>
              {(['all', 'user', 'admin'] as const).map((r) => (
                <Button
                  key={r}
                  type="button"
                  size="sm"
                  className="rounded-full"
                  variant={selectedRole === r ? 'default' : 'outline'}
                  onClick={() => {
                    setPage(1)
                    setSelectedRole(r)
                  }}
                >
                  {r === 'all' ? 'Any' : r}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full bg-muted px-2 py-1">{chips.statusLabel}</span>
            <span className="rounded-full bg-muted px-2 py-1">{chips.roleLabel}</span>
            <span className="rounded-full bg-muted px-2 py-1">
              Page {page}/{totalPages}
            </span>
            <span className="rounded-full bg-muted px-2 py-1">
              Results {users.length}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Users list */}
      <Card className="rounded-3xl border bg-card/60 backdrop-blur">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Accounts</CardTitle>
          <CardDescription>Open a user card to view details or change status.</CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-16 rounded-2xl border bg-background/40 animate-pulse" />
              ))}
            </div>
          ) : users.length ? (
            <>
              {/* Mobile cards */}
              <div className="grid gap-3 md:hidden">
                {users.map((u) => (
                  <Card key={u.id} className="rounded-2xl border bg-background/40 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-11 w-11 overflow-hidden rounded-2xl bg-muted flex items-center justify-center">
                          {u.profile?.profileImage ? (
                            <Image
                              src={u.profile.profileImage}
                              alt={u.profile.fullName || 'User'}
                              width={44}
                              height={44}
                              className="h-11 w-11 object-cover"
                            />
                          ) : (
                            <Users className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-medium">{u.profile?.fullName || 'No Name'}</p>
                          <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="outline" className="rounded-xl">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openUserView(u)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          {u.id !== currentUser?.id && (
                            <DropdownMenuItem onClick={() => handleStatusUpdate(u.id, !u.isActive)}>
                              {u.isActive ? (
                                <>
                                  <ShieldOff className="mr-2 h-4 w-4" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <Shield className="mr-2 h-4 w-4" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge variant={u.role === 'ADMIN' ? 'destructive' : 'outline'}>{u.role}</Badge>
                      <Badge variant={u.isActive ? 'default' : 'secondary'}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="secondary">
                        Trips: {u._count?.travelPlans || 0}
                      </Badge>
                      <Badge variant="secondary">
                        Reviews: {u._count?.reviewsReceived || 0}
                      </Badge>
                    </div>

                    <p className="mt-2 text-xs text-muted-foreground">
                      Joined: {formatDate(u.createdAt)}
                    </p>
                  </Card>
                ))}
              </div>

              {/* Desktop table (restyled) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="py-3 px-4 text-left font-medium">Account</th>
                      <th className="py-3 px-4 text-left font-medium">Flags</th>
                      <th className="py-3 px-4 text-left font-medium">Joined</th>
                      <th className="py-3 px-4 text-left font-medium">Activity</th>
                      <th className="py-3 px-4 text-left font-medium">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b transition hover:bg-accent/20">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 overflow-hidden rounded-2xl bg-muted flex items-center justify-center">
                              {u.profile?.profileImage ? (
                                <Image
                                  src={u.profile.profileImage}
                                  alt={u.profile.fullName || 'User'}
                                  width={40}
                                  height={40}
                                  className="h-10 w-10 object-cover"
                                />
                              ) : (
                                <Users className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-medium">{u.profile?.fullName || 'No Name'}</p>
                              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                <span className="truncate">{u.email}</span>
                              </p>
                              {u.profile?.currentLocation && (
                                <p className="mt-1 text-xs text-muted-foreground truncate">
                                  {u.profile.currentLocation}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-2">
                            <Badge variant={u.role === 'ADMIN' ? 'destructive' : 'outline'}>
                              {u.role}
                            </Badge>
                            <Badge variant={u.isActive ? 'default' : 'secondary'}>
                              {u.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            {u.isPremium && <Badge>Premium</Badge>}
                          </div>
                        </td>

                        <td className="py-4 px-4 text-sm text-muted-foreground">
                          {formatDate(u.createdAt)}
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-2 text-sm">
                            <span className="rounded-full bg-muted px-3 py-1">
                              Trips <span className="font-medium text-foreground">{u._count?.travelPlans || 0}</span>
                            </span>
                            <span className="rounded-full bg-muted px-3 py-1">
                              Reviews <span className="font-medium text-foreground">{u._count?.reviewsReceived || 0}</span>
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="outline" className="rounded-xl">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openUserView(u)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>

                              {u.id !== currentUser?.id && (
                                <DropdownMenuItem onClick={() => handleStatusUpdate(u.id, !u.isActive)}>
                                  {u.isActive ? (
                                    <>
                                      <ShieldOff className="mr-2 h-4 w-4" />
                                      Deactivate
                                    </>
                                  ) : (
                                    <>
                                      <Shield className="mr-2 h-4 w-4" />
                                      Activate
                                    </>
                                  )}
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="py-14 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                <Users className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight">No users found</h3>
              <p className="mt-1 text-sm text-muted-foreground">Try adjusting search or filters.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between border-t pt-6">
              <div className="text-sm text-muted-foreground">
                Page <span className="text-foreground font-medium">{page}</span> of{' '}
                <span className="text-foreground font-medium">{totalPages}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Radix View modal (this is the “View user” fix) */}
      <Dialog.Root open={viewOpen} onOpenChange={setViewOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border bg-background p-6 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Dialog.Title className="text-lg font-semibold tracking-tight">
                  User details
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                  Quick overview for moderation actions.
                </Dialog.Description>
              </div>

              <Dialog.Close asChild>
                <Button size="icon" variant="outline" className="rounded-xl">
                  <X className="h-4 w-4" />
                </Button>
              </Dialog.Close>
            </div>

            {selectedUser && (
              <div className="mt-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 overflow-hidden rounded-2xl bg-muted flex items-center justify-center">
                    {selectedUser.profile?.profileImage ? (
                      <Image
                        src={selectedUser.profile.profileImage}
                        alt={selectedUser.profile?.fullName || 'User'}
                        width={56}
                        height={56}
                        className="h-14 w-14 object-cover"
                      />
                    ) : (
                      <Users className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {selectedUser.profile?.fullName || 'No Name'}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">{selectedUser.email}</p>
                    {selectedUser.profile?.currentLocation && (
                      <p className="truncate text-xs text-muted-foreground">
                        {selectedUser.profile.currentLocation}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant={selectedUser.role === 'ADMIN' ? 'destructive' : 'outline'}>
                    {selectedUser.role}
                  </Badge>
                  <Badge variant={selectedUser.isActive ? 'default' : 'secondary'}>
                    {selectedUser.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  {selectedUser.isPremium && <Badge>Premium</Badge>}
                </div>

                <div className="grid gap-2 rounded-2xl border bg-muted/30 p-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Joined</span>
                    <span className="font-medium">{formatDate(selectedUser.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Travel plans</span>
                    <span className="font-medium">{selectedUser._count?.travelPlans || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Reviews received</span>
                    <span className="font-medium">{selectedUser._count?.reviewsReceived || 0}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => {
                      setViewOpen(false)
                      setSelectedUser(null)
                    }}
                  >
                    Close
                  </Button>

                  {selectedUser.id !== currentUser?.id && (
                    <Button
                      className="rounded-xl"
                      variant={selectedUser.isActive ? 'destructive' : 'default'}
                      onClick={async () => {
                        await handleStatusUpdate(selectedUser.id, !selectedUser.isActive)
                        setViewOpen(false)
                        setSelectedUser(null)
                      }}
                    >
                      {selectedUser.isActive ? 'Deactivate user' : 'Activate user'}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}


// /* eslint-disable @typescript-eslint/no-explicit-any */
// //src\app\admin\users\page.tsx
// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { Badge } from '@/components/ui/badge'
// import { 
//   Search, 
//   Filter, 
//   Users, 
//   UserPlus, 
//   Download,
//   MoreVertical,
//   Shield,
//   ShieldOff,
//   Mail,
//   Calendar,
//   Eye
// } from 'lucide-react'
// import { useAuth } from '@/lib/auth-context'
// import { adminAPI } from '@/lib/api'
// import { toast } from 'sonner'
// import { formatDate } from '@/lib/utils'
// import { GetUserByAdmin } from '@/types'
// import Image from 'next/image'

// interface AdminUser {
//   id: string
//   email: string
//   role: 'USER' | 'ADMIN'
//   isPremium: boolean
//   isActive: boolean
//   createdAt: string
//   profile?: {
//     fullName: string
//     profileImage?: string
//     currentLocation?: string
//   }
//   _count?: {
//     travelPlans: number
//     reviewsReceived: number
//   }
// }

// export default function AdminUsersPage() {
//   const router = useRouter()
//   const { user: currentUser } = useAuth()

//   const [users, setUsers] = useState<GetUserByAdmin[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [searchQuery, setSearchQuery] = useState('')
//   const [page, setPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)
//   const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive'>('all')
//   const [selectedRole, setSelectedRole] = useState<'all' | 'user' | 'admin'>('all')

//   useEffect(() => {
//     fetchUsers()
//   }, [page, selectedStatus, selectedRole])

//   const fetchUsers = async () => {
//     setIsLoading(true)
//     try {
//       const filters: any = {}
//       if (searchQuery) filters.search = searchQuery
//       if (selectedStatus !== 'all') filters.status = selectedStatus
//       if (selectedRole !== 'all') filters.role = selectedRole.toUpperCase()

//       const result = await adminAPI.getAllUsers(page, 20, filters)
//       setUsers(result.data?.users || [])
//       setTotalPages(result.data?.pagination?.pages || 1)
//     } catch (error) {
//       toast.error('Failed to load users')
//       console.error('Admin users error:', error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault()
//     setPage(1)
//     fetchUsers()
//   }

//   const handleStatusUpdate = async (userId: string, isActive: boolean) => {
//     try {
//       await adminAPI.updateUserStatus(userId, { isActive })
//       toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`)
//       fetchUsers()
//     } catch (error) {
//       toast.error('Failed to update user status')
//     }
//   }

//   const handleExport = () => {
//     toast.info('Export feature coming soon!')
//   }

//   const handleViewDetails = (userId: string) => {
//     router.push(`/admin/users/${userId}`)
//   }

//   const stats = {
//     total: users.length,
//     active: users.filter(u => u.isActive).length,
//     inactive: users.filter(u => !u.isActive).length,
//     admins: users.filter(u => u.role === 'ADMIN').length,
//     users: users.filter(u => u.role === 'USER').length
//   }

//   return (
//     <div className="container py-8">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold mb-2">User Management</h1>
//         <p className="text-muted-foreground">
//           Manage user accounts, permissions, and activity
//         </p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground">Total Users</p>
//                 <p className="text-2xl font-bold">{stats.total}</p>
//               </div>
//               <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
//                 <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground">Active Users</p>
//                 <p className="text-2xl font-bold">{stats.active}</p>
//               </div>
//               <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
//                 <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground">Admins</p>
//                 <p className="text-2xl font-bold">{stats.admins}</p>
//               </div>
//               <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
//                 <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground">Inactive</p>
//                 <p className="text-2xl font-bold">{stats.inactive}</p>
//               </div>
//               <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
//                 <ShieldOff className="h-6 w-6 text-amber-600 dark:text-amber-400" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Filters & Search */}
//       <Card className="mb-8">
//         <CardContent className="p-6">
//           <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
//             <form onSubmit={handleSearch} className="flex-1 w-full">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search users by name, email..."
//                   className="pl-10 w-full lg:w-96"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//               </div>
//             </form>

//             <div className="flex flex-wrap gap-3">
//               <Tabs value={selectedStatus} onValueChange={(v: any) => setSelectedStatus(v)}>
//                 <TabsList>
//                   <TabsTrigger value="all">All Status</TabsTrigger>
//                   <TabsTrigger value="active">Active</TabsTrigger>
//                   <TabsTrigger value="inactive">Inactive</TabsTrigger>
//                 </TabsList>
//               </Tabs>

//               <Tabs value={selectedRole} onValueChange={(v: any) => setSelectedRole(v)}>
//                 <TabsList>
//                   <TabsTrigger value="all">All Roles</TabsTrigger>
//                   <TabsTrigger value="user">Users</TabsTrigger>
//                   <TabsTrigger value="admin">Admins</TabsTrigger>
//                 </TabsList>
//               </Tabs>

//               {/* <Button variant="outline" onClick={handleExport} className="gap-2">
//                 <Download className="h-4 w-4" />
//                 Export
//               </Button> */}
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Users Table */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Users</CardTitle>
//           <CardDescription>
//             Manage all registered users in the system
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {isLoading ? (
//             <div className="space-y-4">
//               {[...Array(5)].map((_, i) => (
//                 <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
//               ))}
//             </div>
//           ) : users.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b">
//                     <th className="text-left py-3 px-4 font-medium">User</th>
//                     <th className="text-left py-3 px-4 font-medium">Role</th>
//                     <th className="text-left py-3 px-4 font-medium">Status</th>
//                     <th className="text-left py-3 px-4 font-medium">Joined</th>
//                     <th className="text-left py-3 px-4 font-medium">Activity</th>
//                     <th className="text-left py-3 px-4 font-medium">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {users.map((user) => (
//                     <tr key={user.id} className="border-b hover:bg-muted/50">
//                       <td className="py-3 px-4">
//                         <div className="flex items-center gap-3">
//                           <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
//                             {user.profile?.profileImage ? (
//                               <Image 
//                                 src={user.profile.profileImage} 
//                                 alt={user.profile.fullName}
//                                 className="h-10 w-10 rounded-full object-cover"
//                                 width={40}
//                                 height={40}
//                               />
//                             ) : (
//                               <Users className="h-5 w-5 text-muted-foreground" />
//                             )}
//                           </div>
//                           <div>
//                             <p className="font-medium">
//                               {user.profile?.fullName || 'No Name'}
//                             </p>
//                             <div className="flex items-center gap-1 text-sm text-muted-foreground">
//                               <Mail className="h-3 w-3" />
//                               <span>{user.email}</span>
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="py-3 px-4">
//                         <Badge variant={user.role === 'ADMIN' ? 'destructive' : 'outline'}>
//                           {user.role}
//                         </Badge>
//                       </td>
//                       <td className="py-3 px-4">
//                         <Badge variant={user.isActive ? 'default' : 'secondary'}>
//                           {user.isActive ? 'Active' : 'Inactive'}
//                         </Badge>
//                       </td>
//                       <td className="py-3 px-4 text-sm text-muted-foreground">
//                         {formatDate(user.createdAt)}
//                       </td>
//                       <td className="py-3 px-4">
//                         <div className="space-y-1">
//                           <div className="text-sm">
//                             <span className="font-medium">{user._count?.travelPlans || 0}</span> trips
//                           </div>
//                           <div className="text-sm text-muted-foreground">
//                             <span className="font-medium">{user._count?.reviewsReceived || 0}</span> reviews
//                           </div>
//                         </div>
//                       </td>
//                       <td className="py-3 px-4">
//                         <div className="flex gap-2">
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={() => handleViewDetails(user.id)}
//                             className="gap-1"
//                           >
//                             <Eye className="h-3 w-3" />
//                             View
//                           </Button>
//                           {user.id !== currentUser?.id && (
//                             <Button
//                               size="sm"
//                               variant={user.isActive ? "destructive" : "default"}
//                               onClick={() => handleStatusUpdate(user.id, !user.isActive)}
//                             >
//                               {user.isActive ? 'Deactivate' : 'Activate'}
//                             </Button>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
//                 <Users className="h-8 w-8 text-muted-foreground" />
//               </div>
//               <h3 className="font-semibold text-lg mb-2">No users found</h3>
//               <p className="text-muted-foreground">
//                 Try adjusting your search filters
//               </p>
//             </div>
//           )}

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex items-center justify-between mt-6 pt-6 border-t">
//               <div className="text-sm text-muted-foreground">
//                 Page {page} of {totalPages}
//               </div>
//               <div className="flex gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setPage(p => Math.max(1, p - 1))}
//                   disabled={page === 1}
//                 >
//                   Previous
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setPage(p => Math.min(totalPages, p + 1))}
//                   disabled={page === totalPages}
//                 >
//                   Next
//                 </Button>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
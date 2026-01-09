'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { authAPI } from '@/lib/api'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageUpload } from '@/components/upload/image-upload'
import ProfileEditForm from '@/components/profile/edit-form'

export interface ProfileFormData {
  fullName: string
  bio: string
  travelInterests: string[]
  visitedCountries: string[]
  currentLocation: string
  phoneNumber: string
}

export default function EditProfilePage() {
  const { user, updateUser } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState<ProfileFormData>({
    fullName: '',
    bio: '',
    travelInterests: [],
    visitedCountries: [],
    currentLocation: '',
    phoneNumber: '',
  })

  useEffect(() => {
    if (user?.profile) {
      setProfileData({
        fullName: user.profile.fullName || '',
        bio: user.profile.bio || '',
        travelInterests: user.profile.travelInterests || [],
        visitedCountries: user.profile.visitedCountries || [],
        currentLocation: user.profile.currentLocation || '',
        phoneNumber: user.profile.phoneNumber || '',
      })
    }
  }, [user])

  // ✅ FIX: Add this function to handle image upload completion
  const handleImageUploadComplete = async () => {
    try {
      // Get updated profile with new image URL
      const result = await authAPI.getMe()

      // Update auth context with new user data
      updateUser(result.data.user)

      toast.success('Profile image updated successfully!')

      // Optionally refresh the page data
      fetchUserProfile()
    } catch (error) {
      toast.error('Failed to update profile with new image')
    }
  }

  // ✅ FIX: Add function to fetch fresh user data
  const fetchUserProfile = async () => {
    try {
      const result = await authAPI.getMe()
      updateUser(result.data.user)
    } catch (error) {
      console.error('Failed to refresh profile:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const result = await authAPI.getMe()
      updateUser(result.data.user)
      toast.success('Profile updated successfully!')
      router.push('/profile') // Changed to /profile (own profile)
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
<div className="container py-8">
  <div className="mx-auto w-full max-w-4xl">
    <Card className="rounded-3xl overflow-hidden">
      <CardHeader className="bg-linear-to-r from-primary/10 via-background to-secondary/10">
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="space-y-8">
          <div className="rounded-3xl border bg-card/60 backdrop-blur p-5">
            <h3 className="text-lg font-medium mb-4">Profile Picture</h3>
            <ImageUpload
              type="profile"
              currentImage={user?.profile?.profileImage ?? undefined}
              onUploadComplete={handleImageUploadComplete}
            />
          </div>

          <ProfileEditForm
            data={profileData}
            onChange={setProfileData}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  </div>
</div>

  )
}

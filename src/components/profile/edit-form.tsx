// // frontend/components/profile/edit-form.tsx

// frontend/components/profile/edit-form.tsx
'use client'

import type React from 'react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

import { MapPin, Phone, Sparkles, Globe, User, X } from 'lucide-react'
import type { ProfileFormData } from '@/app/profile/edit/page'

interface ProfileEditFormProps {
  data: ProfileFormData
  onChange: (data: ProfileFormData) => void
  onSubmit: (e: React.FormEvent) => void
  isLoading: boolean
}

function SectionCard({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string
  subtitle?: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-3xl border bg-card/60 backdrop-blur p-5 shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <div className="h-10 w-10 rounded-2xl bg-muted flex items-center justify-center">
          {icon}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold leading-tight">{title}</h3>
          {subtitle ? (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          ) : null}
        </div>
      </div>
      {children}
    </div>
  )
}

function ChipInput({
  label,
  placeholder,
  items,
  onAdd,
  onRemove,
  inputValue,
  setInputValue,
  badgeVariant = 'secondary',
}: {
  label: string
  placeholder: string
  items: string[]
  onAdd: (value: string) => void
  onRemove: (value: string) => void
  inputValue: string
  setInputValue: (v: string) => void
  badgeVariant?: 'secondary' | 'outline'
}) {
  const count = useMemo(() => items.length, [items.length])

  const add = () => {
    const v = inputValue.trim()
    if (!v) return
    onAdd(v)
    setInputValue('')
  }

  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between gap-3">
        <Label className="text-sm">{label}</Label>
        <span className="text-xs text-muted-foreground">{count === 0 ? 'None yet' : `${count} added`}</span>
      </div>

      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className="rounded-2xl"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              add()
            }
          }}
        />
        <Button type="button" onClick={add} className="rounded-2xl">
          Add
        </Button>
      </div>

      {items.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {items.map((item) => (
            <Badge key={item} variant={badgeVariant} className="rounded-full gap-1 py-1">
              {item}
              <button
                type="button"
                onClick={() => onRemove(item)}
                className="ml-1 rounded-full hover:opacity-80"
                aria-label={`Remove ${item}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProfileEditForm({
  data,
  onChange,
  onSubmit,
  isLoading,
}: ProfileEditFormProps) {
  const [interestInput, setInterestInput] = useState('')
  const [countryInput, setCountryInput] = useState('')

  const initials = useMemo(() => {
    const name = (data.fullName || '').trim()
    if (!name) return 'U'
    return name.split(' ').slice(0, 2).map((p) => p.charAt(0).toUpperCase()).join('')
  }, [data.fullName])

  const addInterest = (value: string) => {
    const v = value.trim()
    if (!v) return
    if (data.travelInterests.includes(v)) return
    onChange({ ...data, travelInterests: [...data.travelInterests, v] })
  }

  const removeInterest = (interest: string) => {
    onChange({
      ...data,
      travelInterests: data.travelInterests.filter((i: string) => i !== interest),
    })
  }

  const addCountry = (value: string) => {
    const v = value.trim()
    if (!v) return
    if (data.visitedCountries.includes(v)) return
    onChange({ ...data, visitedCountries: [...data.visitedCountries, v] })
  }

  const removeCountry = (country: string) => {
    onChange({
      ...data,
      visitedCountries: data.visitedCountries.filter((c: string) => c !== country),
    })
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-3xl">
        {/* Unique header */}
        <div className="relative overflow-hidden rounded-3xl border bg-linear-to-r from-primary/10 via-background to-secondary/10 p-6 mb-6">
          <div className="pointer-events-none absolute -top-16 -right-20 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
          <div className="flex items-center justify-between gap-4 relative">
            <div className="flex items-center gap-4 min-w-0">
              <div className="h-14 w-14 rounded-3xl bg-muted border flex items-center justify-center text-lg font-semibold">
                {initials}
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-semibold truncate">Edit your profile</h2>
                <p className="text-sm text-muted-foreground truncate">
                  Make your profile stand out to the right travel buddies.
                </p>
              </div>
            </div>

            <Badge variant="secondary" className="rounded-full">
              Visible to others
            </Badge>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <SectionCard
            title="Basics"
            subtitle="Your name and where you’re currently based."
            icon={<User className="h-4 w-4 text-muted-foreground" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  Full name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fullName"
                  value={data.fullName}
                  onChange={(e) => onChange({ ...data, fullName: e.target.value })}
                  required
                  placeholder="e.g., Ayesha Rahman"
                  className="rounded-2xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentLocation" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Current location
                </Label>
                <Input
                  id="currentLocation"
                  value={data.currentLocation}
                  onChange={(e) => onChange({ ...data, currentLocation: e.target.value })}
                  placeholder="City, Country"
                  className="rounded-2xl"
                />
                <p className="text-xs text-muted-foreground">Example: Dhaka, Bangladesh.</p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Phone number
                </Label>
                <Input
                  id="phoneNumber"
                  value={data.phoneNumber}
                  onChange={(e) => onChange({ ...data, phoneNumber: e.target.value })}
                  placeholder="+8801XXXXXXXXX"
                  className="rounded-2xl"
                />
                <p className="text-xs text-muted-foreground">Optional—share only if you want.</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="About you"
            subtitle="A short bio helps people decide to connect."
            icon={<Sparkles className="h-4 w-4 text-muted-foreground" />}
          >
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={data.bio}
                onChange={(e) => onChange({ ...data, bio: e.target.value })}
                rows={5}
                placeholder="Your travel style, what you enjoy, and what kind of travel buddy you're looking for..."
                className="rounded-2xl"
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Travel profile"
            subtitle="Add a few tags—keep it simple."
            icon={<Globe className="h-4 w-4 text-muted-foreground" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChipInput
                label="Travel interests"
                placeholder="e.g., hiking, street food"
                items={data.travelInterests}
                onAdd={addInterest}
                onRemove={removeInterest}
                inputValue={interestInput}
                setInputValue={setInterestInput}
                badgeVariant="secondary"
              />

              <ChipInput
                label="Visited countries"
                placeholder="e.g., Thailand"
                items={data.visitedCountries}
                onAdd={addCountry}
                onRemove={removeCountry}
                inputValue={countryInput}
                setInputValue={setCountryInput}
                badgeVariant="outline"
              />
            </div>
          </SectionCard>

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="rounded-2xl"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="rounded-2xl">
              {isLoading ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

















// 'use client'

// import { useState } from 'react'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea'
// import { Label } from '@/components/ui/label'
// import { Badge } from '@/components/ui/badge'
// import { X } from 'lucide-react'
// import { ProfileFormData } from '@/app/profile/edit/page'

// interface ProfileEditFormProps {
//   data: ProfileFormData
//   onChange: (data: ProfileFormData) => void
//   onSubmit: (e: React.FormEvent) => void
//   isLoading: boolean
// }

// export default function ProfileEditForm({
//   data,
//   onChange,
//   onSubmit,
//   isLoading
// }: ProfileEditFormProps) {
//   const [interestInput, setInterestInput] = useState('')
//   const [countryInput, setCountryInput] = useState('')

//   const addInterest = () => {
//     if (interestInput.trim() && !data.travelInterests.includes(interestInput.trim())) {
//       onChange({
//         ...data,
//         travelInterests: [...data.travelInterests, interestInput.trim()]
//       })
//       setInterestInput('')
//     }
//   }

//   const removeInterest = (interest: string) => {
//     onChange({
//       ...data,
//       travelInterests: data.travelInterests.filter((i: string) => i !== interest)
//     })
//   }

//   const addCountry = () => {
//     if (countryInput.trim() && !data.visitedCountries.includes(countryInput.trim())) {
//       onChange({
//         ...data,
//         visitedCountries: [...data.visitedCountries, countryInput.trim()]
//       })
//       setCountryInput('')
//     }
//   }

//   const removeCountry = (country: string) => {
//     onChange({
//       ...data,
//       visitedCountries: data.visitedCountries.filter((c: string) => c !== country)
//     })
//   }

//   return (
//     <form onSubmit={onSubmit} className="space-y-6">
//       <div>
//         <Label htmlFor="fullName">Full Name *</Label>
//         <Input
//           id="fullName"
//           value={data.fullName}
//           onChange={(e) => onChange({ ...data, fullName: e.target.value })}
//           required
//         />
//       </div>

//       <div>
//         <Label htmlFor="bio">Bio</Label>
//         <Textarea
//           id="bio"
//           value={data.bio}
//           onChange={(e) => onChange({ ...data, bio: e.target.value })}
//           rows={4}
//           placeholder="Tell others about yourself..."
//         />
//       </div>

//       <div>
//         <Label htmlFor="currentLocation">Current Location</Label>
//         <Input
//           id="currentLocation"
//           value={data.currentLocation}
//           onChange={(e) => onChange({ ...data, currentLocation: e.target.value })}
//           placeholder="City, Country"
//         />
//       </div>

//       <div>
//         <Label>Travel Interests</Label>
//         <div className="flex gap-2 mb-3">
//           <Input
//             value={interestInput}
//             onChange={(e) => setInterestInput(e.target.value)}
//             placeholder="Add an interest (e.g., hiking, food tours)"
//             onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
//           />
//           <Button type="button" onClick={addInterest}>Add</Button>
//         </div>
//         <div className="flex flex-wrap gap-2">
//           {data.travelInterests.map((interest: string, index: number) => (
//             <Badge key={index} variant="secondary" className="gap-1">
//               {interest}
//               <button type="button" onClick={() => removeInterest(interest)}>
//                 <X className="h-3 w-3" />
//               </button>
//             </Badge>
//           ))}
//         </div>
//       </div>

//       <div>
//         <Label>Visited Countries</Label>
//         <div className="flex gap-2 mb-3">
//           <Input
//             value={countryInput}
//             onChange={(e) => setCountryInput(e.target.value)}
//             placeholder="Add a country"
//             onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCountry())}
//           />
//           <Button type="button" onClick={addCountry}>Add</Button>
//         </div>
//         <div className="flex flex-wrap gap-2">
//           {data.visitedCountries.map((country: string, index: number) => (
//             <Badge key={index} variant="outline" className="gap-1">
//               {country}
//               <button type="button" onClick={() => removeCountry(country)}>
//                 <X className="h-3 w-3" />
//               </button>
//             </Badge>
//           ))}
//         </div>
//       </div>

//       <div>
//         <Label htmlFor="phoneNumber">Phone Number</Label>
//         <Input
//           id="phoneNumber"
//           value={data.phoneNumber}
//           onChange={(e) => onChange({ ...data, phoneNumber: e.target.value })}
//           placeholder="+1234567890"
//         />
//       </div>

//       <div className="flex gap-4 pt-4">
//         <Button type="submit" disabled={isLoading}>
//           {isLoading ? 'Saving...' : 'Save Changes'}
//         </Button>
//         <Button type="button" variant="outline" onClick={() => window.history.back()}>
//           Cancel
//         </Button>
//       </div>
//     </form>
//   )
// }
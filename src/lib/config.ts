export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
export const SITE_NAME = 'Travel Buddy & Meetup'
export const SITE_DESCRIPTION = 'Find travel buddy and plan tours'

// Stripe config
export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''

// Cloudinary config
export const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ''

// Feature flags
export const FEATURES = {
  PAYMENT_ENABLED: process.env.NEXT_PUBLIC_PAYMENT_ENABLED === 'true',
  MAPS_ENABLED: process.env.NEXT_PUBLIC_MAPS_ENABLED === 'true',
}
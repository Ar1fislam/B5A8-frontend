// frontend/types/index.ts

// ==================== ENUMS ====================
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum TravelType {
  SOLO = 'SOLO',
  FAMILY = 'FAMILY',
  FRIENDS = 'FRIENDS',
  COUPLE = 'COUPLE',
  BUSINESS = 'BUSINESS',
}

export enum MatchStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

// ==================== BASE TYPES ====================
export interface BaseEntity {
  id: string
  createdAt: Date | string
  updatedAt: Date | string
}

// ==================== USER & PROFILE ====================
export interface Profile extends BaseEntity {
  id: string
  userId: string
  fullName: string
  bio?: string | null
  profileImage?: string | null
  dateOfBirth?: Date | string | null
  travelInterests: string[]
  visitedCountries: string[]
  currentLocation?: string | null
  phoneNumber?: string | null
  socialLinks: string[]

  // Relations
  user?: User
}

export interface User extends BaseEntity {
  id: string
  email: string
  role: Role
  isPremium: boolean
  isActive: boolean

  // Optional relations (include based on your needs)
  profile?: Profile | null
  travelPlans?: TravelPlan[]
  reviewsGiven?: Review[]
  reviewsReceived?: Review[]
  subscriptions?: Subscription[]
  matchesInitiated?: Match[]
  matchesReceived?: Match[]
  sentMessages?: Message[]
  receivedMessages?: Message[]
  tripPhotos?: TripPhoto[]
}

export interface UserWithProfile extends User {
  profile: Profile
}



export interface ProfileUser {
  id: string
  email?: string
  role?: 'USER' | 'ADMIN'
  isPremium?: boolean
  profile: {
    id: string
    userId: string
    fullName: string
    bio?: string
    profileImage?: string
    dateOfBirth?: Date | string
    travelInterests?: string[]
    visitedCountries?: string[]
    currentLocation?: string
    phoneNumber?: string
    socialLinks?: string[]
    createdAt: Date | string
    updatedAt: Date | string
  }
  travelPlans?: Array<{
    id: string
    destination: string
    startDate: Date | string
    endDate: Date | string
    budget: string
    travelType: string
    description: string
    isPublic: boolean
    userId: string
    createdAt: Date | string
    updatedAt: Date | string
  }>
  reviewsReceived?: Array<{
    id: string
    rating: number
    comment: string
    authorId: string
    subjectId: string
    travelPlanId: string
    createdAt: string
    updatedAt: string
    author: {
      profile: {
        fullName: string
        profileImage?: string
      }
    }
  }>
  _count: {
    travelPlans: number
    reviewsReceived: number
  }
}

// ==================== ADMIN ====================
export interface UpdatedUserStatus {
  id: string
  email: string
  role: string
  isActive: boolean
  isPremium: boolean
  profile: {
    fullName: string
  }
  updatedAt: Date | string
}

export interface GetUserByAdmin {
  id: string
  email: string
  role: string
  isActive: boolean
  isPremium: boolean
  profile: {
    fullName: string
    profileImage?: string
    currentLocation?: string
  }
  _count: {
    travelPlans: number
    reviewsReceived: number
    subscriptions: number
  }
  createdAt: Date | string
  updatedAt: Date | string
}

export interface UserDetails {
  id: string
  email: string
  role: string
  isActive: boolean
  isPremium: boolean
  profile: Profile
  travelPlans?: Array<{
    id: string
    destination: string
    startDate: string
    endDate: string
    budget: string
    travelType: string
    description: string
    isPublic: boolean
    userId: string
    createdAt: string
    updatedAt: string
    matches?: Array<{
      id: string
      status: string
      initiatorId: string
      receiverId: string
      travelPlanId: string
      createdAt: Date | string
      updatedAt: Date | string
    }>
  }>
  reviewsReceived?: Array<{
    id: string
    rating: number
    comment: string
    authorId: string
    subjectId: string
    travelPlanId: string
    createdAt: string
    updatedAt: string
    author: {
      profile: {
        fullName: string
      }
    }
  }>
  reviewsGiven?: Array<{
    id: string
    rating: number
    comment: string
    authorId: string
    subjectId: string
    travelPlanId: string
    createdAt: string
    updatedAt: string
    author: {
      profile: {
        fullName: string
      }
    }
  }>
  subscriptions?: Subscription[]
  matchesInitiated?: Array<{
    id: string
    status: string
    initiatorId: string
    receiverId: string
    travelPlanId: string
    createdAt: string
    updatedAt: string
    receiver: {
      profile: {
        fullName: string
      }
    }
  }>
  matchesReceived?: Array<{
    id: string
    status: string
    initiatorId: string
    receiverId: string
    travelPlanId: string
    createdAt: string
    updatedAt: string
    receiver: {
      profile: {
        fullName: string
      }
    }
  }>
  createdAt: Date | string
  updatedAt: Date | string
}

export interface TravelPlanByAdmin {
  id: string
  destination: string
  startDate: string
  endDate: string
  budget: string
  travelType: string
  description: string
  isPublic: boolean
  userId: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    email: string
    profile: {
      fullName: string
      profileImage: string
    }
  }
  matches: Array<{
    id: string
    status: string
    initiatorId: string
    receiverId: string
    travelPlanId: string
    createdAt: string
    updatedAt: string
  }>
  _count: {
    matches: number
    reviews: number
  }
}

// ==================== TRAVEL PLAN ====================
interface TravelPlanUser extends User {
  _count?: {
    reviewsReceived: number
    travelPlans: number
  }
}

/* export interface TravelPlan extends BaseEntity {
  id: string
  destination: string
  startDate: Date | string
  endDate: Date | string
  budget: string
  travelType: TravelType
  description?: string | null
  isPublic: boolean

  // Foreign keys
  userId: string

  // Relations
  user?: TravelPlanUser
  matches?: Match[]
  reviews?: Review[]
  tripPhotos?: TripPhoto[]

  // Stats
  _count?: {
    matches: number
  }
} */

export interface TravelPlan extends BaseEntity {
  id: string
  destination: string
  startDate: string
  endDate: string
  budget: string
  travelType: 'SOLO' | 'FAMILY' | 'FRIENDS' | 'COUPLE' | 'BUSINESS'
  description: string
  isPublic: boolean
  userId: string
  savedByMe?: boolean
  createdAt: Date | string
  updatedAt: Date | string
  user: {
    id?: string
    profile: {
      fullName: string
      profileImage: string | null
      bio?: string
      currentLocation?: string
      travelInterests?: string[]
      visitedCountries?: string[]
    }
    reviewsReceived?: Array<{
      id: string
      rating: number
      comment: string
      authorId: string
      subjectId: string
      travelPlanId: string
      createdAt: string
      updatedAt: string
      author: {
        profile: {
          fullName: string
        }
      }
    }>
    _count?: {
      reviewsReceived: number
      travelPlans: number
    }
    averageRating?: number
    reviewCount?: number
  }
  matches?: Array<{
    id: string
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
    initiatorId: string
    receiverId: string
    travelPlanId: string
    createdAt: string
    updatedAt: string
    initiator: {
      profile: {
        fullName: string
        profileImage: string | null
      }
    }
  }>
  tripPhotos?: TripPhoto[]
  _count?: {
    matches?: number
    reviewsReceived?: number
    travelPlans?: number
  }
}

/* export interface TravelPlanWithRelations extends TravelPlan {
  user?: User
  tripPhotos?: TripPhoto[]
  matches?: Match[]
} */

// ==================== TRIP PHOTO ====================
export interface TripPhoto extends BaseEntity {
  id: string
  url: string
  caption?: string | null
  orderIndex: number
  isPrimary: boolean

  // Foreign keys
  travelPlanId: string
  uploadedById?: string | null

  // Relations
  travelPlan?: TravelPlan
  uploadedBy?: User | null
}

// ==================== REVIEW ====================
/* export interface Review extends BaseEntity {
  id: string
  rating: number
  comment?: string | null

  // Foreign keys
  authorId: string
  subjectId: string
  travelPlanId?: string | null

  // Relations
  author: User
  subject: User
  travelPlan?: TravelPlan | null
} */

export interface Review extends BaseEntity {
  id: string
  rating: number
  comment?: string | null

  authorId: string
  subjectId: string
  travelPlanId?: string | null

  createdAt: string
  updatedAt: string

  author: {
    id?: string
    email?: string
    profile: {
      fullName: string
      profileImage?: string | null
    } | null
  }

  subject?: {
    id: string
    email: string
    profile?: {
      fullName: string
      profileImage?: string | null
    } | null
  }

  travelPlan?: {
    id: string
    destination: string
    startDate: string
    endDate: string
    travelType: string
  } | null
}

export interface FrontendReview extends BaseEntity {
  id: string
  rating: number
  comment?: string
  author: {
    id: string
    profile?: {
      fullName: string
      profileImage?: string
    }
  }
  subject: {
    id: string
    profile?: {
      fullName: string
      profileImage?: string
    }
  }
  travelPlanId?: string
  travelPlan?: {
    id: string
    destination: string
  }
}

export interface ReviableTrip {
  id: string
  destination: string
  startDate: Date | string
  endDate: Date | string
}

export interface CanReview {
  canReview: boolean
  reason?: string
  trips?: ReviableTrip[]
}

// ==================== MATCH ====================
export interface Match extends BaseEntity {
  id: string
  status: MatchStatus

  // Foreign keys
  initiatorId: string
  receiverId: string
  travelPlanId?: string | null

  // Relations
  initiator: User
  receiver: User
  travelPlan?: TravelPlan | null
  messages?: Message[]
}

export interface UserWithStats extends UserWithProfile {
  averageRating: number
  reviewCount: number
}

export interface MatchWithRelations extends Match {
  initiator: UserWithStats
  receiver: UserWithStats
  travelPlan?: TravelPlan
  messages?: Message[]
}

// ==================== SUBSCRIPTION ====================

export interface StripeData {
  status: string
  currentPeriodStart: Date | string
  currentPeriodEnd: Date | string
  cancelAtPeriodEnd: boolean
  priceId: string
}

export interface Subscription extends BaseEntity {
  id: string
  stripeSubId?: string | null
  status: string
  currentPeriodStart: Date | string
  currentPeriodEnd: Date | string

  // Foreign key
  userId: string

  // Relation
  user?: User

  // Stripe Data
  stripeData?: StripeData
}

// ==================== MESSAGE ====================
export interface Message extends BaseEntity {
  id: string
  content: string
  senderId: string
  receiverId: string
  matchId?: string | null
  read: boolean
  deleted: boolean
  deletedAt?: Date | string | null

  // Relations
  sender: User
  receiver: User
  match?: Match | null
}

// ==================== API RESPONSE TYPES ====================
export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T
  error?: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// ==================== DASHBOARD TYPES ====================
export interface DashboardTotals {
  users: number
  activeUsers: number
  travelPlans: number
  activeTravelPlans: number
  reviews: number
  matches: number
  subscriptions: number
}

export interface RecentSignup {
  id: string
  email: string
  profile: {
    fullName: string
  }
  createdAt: string
}

export interface DashboardStats {
  totals: DashboardTotals
  recentSignups: RecentSignup[]
}

// ==================== FORM & INPUT TYPES ====================
export interface CreateTravelPlanInput {
  destination: string
  startDate: Date | string
  endDate: Date | string
  budget: string
  travelType: TravelType
  description?: string
  isPublic?: boolean
}

export type UpdateTravelPlanInput = Partial<CreateTravelPlanInput>

export interface UpdateProfileInput {
  fullName?: string
  bio?: string
  profileImage?: string | null
  dateOfBirth?: Date | string
  travelInterests?: string[]
  visitedCountries?: string[]
  currentLocation?: string
  phoneNumber?: string
  socialLinks?: string[]
}

export interface CreateMatchInput {
  receiverId: string
  travelPlanId?: string
  message?: string
}

export interface SendMessageInput {
  receiverId: string
  matchId?: string
  content: string
}

// ==================== FILTER TYPES ====================
export interface TravelPlanFilters {
  destination?: string
  startDate?: Date
  endDate?: Date
  travelType?: TravelType
  budgetRange?: {
    min?: number
    max?: number
  }
  isPublic?: boolean
  userId?: string
  interests?: string[]
}

export interface UserFilters {
  search?: string
  role?: Role
  isPremium?: boolean
  isActive?: boolean
  hasProfile?: boolean
}

// ==================== AUTH TYPES ====================
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  fullName: string
}

export interface AuthResponse {
  user: AuthUser
}

export interface AuthProfile extends BaseEntity {
  userId: string
  fullName: string
  bio: string
  profileImage: string | null
  dateOfBirth: Date | string
  travelInterests: string[]
  visitedCountries: string[]
  currentLocation: string
  phoneNumber: string
  socialLinks: string[]
}

export interface AuthUser extends BaseEntity {
  email: string
  role: string
  isPremium: boolean
  isActive: boolean
  profile: Profile
}

// ==================== COMPONENT PROP TYPES ====================
export interface TravelPlanCardProps {
  plan: TravelPlan
  showUserInfo?: boolean
  onLike?: (planId: string) => void
  onMessage?: (userId: string) => void
  onViewDetails?: (planId: string) => void
}

export interface MatchCardProps {
  match: MatchWithRelations
  currentUserId: string
  onAccept?: (matchId: string) => void
  onReject?: (matchId: string) => void
  onMessage?: (matchId: string) => void
}

export interface MessageThreadProps {
  matchId: string
  currentUser: UserWithProfile
  otherUser: UserWithProfile
  messages: Message[]
  onSendMessage: (content: string) => Promise<void>
}

// ==================== UTILITY TYPES ====================
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type Nullable<T> = T | null
export type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>

// Type guards
export function isUserWithProfile(
  user: User | unknown
): user is UserWithProfile {
  return (
    typeof user === 'object' &&
    user !== null &&
    'profile' in user &&
    (user as User).profile !== undefined
  )
}

export function isTravelPlanWithRelations(plan: unknown): plan is TravelPlan {
  return typeof plan === 'object' && plan !== null && 'user' in plan
}

// ==================== Response Types ====================

export interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export type SingleTravelPlan = Omit<TravelPlan, '_count'> & {
  matches: Match[]
}

export interface TravelPlansData {
  plans: TravelPlan[]
  pagination: Pagination
}

export type TravelPlansResponse = ApiResponse<TravelPlansData>

export interface MatchesData {
  matches: Match[]
  pagination: Pagination
}

export type MatchesResponse = ApiResponse<MatchesData>

export interface SubscriptionData {
  subscription: Subscription
}

export type SubscriptionResponse = ApiResponse<SubscriptionData>

export type MessageResponse = ApiResponse<Message>

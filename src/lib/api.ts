import { TravelPlanFormData } from '@/app/travel-plans/[id]/edit/page'
import {
  ApiResponse,
  AuthProfile,
  AuthResponse,
  AuthUser,
  CanReview,
  CreateMatchInput,
  CreateTravelPlanInput,
  DashboardStats,
  GetUserByAdmin,
  LoginCredentials,
  MatchesResponse,
  MatchWithRelations,
  Pagination,
  Profile,
  ProfileUser,
  RegisterCredentials,
  Review,
  SingleTravelPlan,
  Subscription,
  SubscriptionResponse,
  TravelPlan,
  TravelPlanByAdmin,
  TravelPlanFilters,
  TravelPlansResponse,
  UpdatedUserStatus,
  UpdateProfileInput,
  UpdateTravelPlanInput,
  User,
  UserDetails,
} from '@/types'
import { toast } from 'sonner'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
const NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default'

class ApiError<TData = unknown> extends Error {
  constructor(message: string, public status?: number, public data?: TData) {
    super(message)
    this.name = 'ApiError'
  }
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    const config: RequestInit = {
      ...options,
      credentials: 'include', // For cookie-based auth
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T
      }

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new ApiError(
          data?.message || 'Something went wrong',
          response.status,
          data
        )
      }

      return data
    } catch (error) {
      if (error instanceof ApiError) {
        // Show error toast
        toast.error(error.message)
        throw error
      }

      // Network error
      toast.error('Network error. Please check your connection.')
      throw new ApiError('Network error')
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<TResponse, TBody>(
    endpoint: string,
    body?: TBody,
    options?: RequestInit
  ): Promise<TResponse> {
    return this.request<TResponse>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async put<TResponse, TBody>(
    endpoint: string,
    body?: TBody,
    options?: RequestInit
  ): Promise<TResponse> {
    return this.request<TResponse>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async patch<TResponse, TBody>(
    endpoint: string,
    body?: TBody,
    options?: RequestInit
  ): Promise<TResponse> {
    return this.request<TResponse>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

export const toQueryString = (
  params: Record<string, string | number | boolean>
) => {
  return new URLSearchParams(
    Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => [key, String(value)])
  ).toString()
}

export const api = new ApiClient()

// Auth endpoints
export const authAPI = {
  register: (data: RegisterCredentials): Promise<ApiResponse<AuthResponse>> =>
    api.post('/auth/register', data),
  login: (data: LoginCredentials) =>
    api.post<ApiResponse<AuthResponse>, LoginCredentials>('/auth/login', data),
  logout: (): Promise<ApiResponse> => api.post('/auth/logout'),
  getMe: (): Promise<ApiResponse<{ user: AuthUser }>> => api.get('/auth/me'),
}

// User endpoints
export const userAPI = {
  getProfile: (): Promise<ApiResponse<{ user: ProfileUser }>> =>
    api.get('/users/profile'),
  getTopRatedTravelers: (): Promise<
    ApiResponse<
      {
        id: string
        name: string
        location: string
        rating: number
        trips: number
        image: string
      }[]
    >
  > => api.get('/users/top-rated-travelers'),
  updateProfile: (
    data: UpdateProfileInput
  ): Promise<ApiResponse<{ user: ProfileUser }>> =>
    api.patch('/users/profile', data),
  getPublicProfile: (id: string): Promise<ApiResponse<{ user: ProfileUser }>> =>
    api.get(`/users/${id}`),
  searchUsers: (query: string, page = 1, limit = 10) =>
    api.get(
      `/users?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    ),
}

// Travel Plan endpoints
export const travelPlanAPI = {
  create: (data: CreateTravelPlanInput) => api.post('/travel-plans', data),
  getMyPlans: (page = 1, limit = 10): Promise<TravelPlansResponse> =>
    api.get(`/travel-plans/my-plans?page=${page}&limit=${limit}`),
  getById: (id: string): Promise<ApiResponse<{ travelPlan: TravelPlan }>> =>
    api.get(`/travel-plans/${id}`),
  update: (id: string, data: TravelPlanFormData) =>
    api.patch(`/travel-plans/${id}`, data),
  delete: (id: string) => api.delete(`/travel-plans/${id}`),
  search: (
    filters: TravelPlanFilters,
    page = 1,
    limit = 10
  ): Promise<TravelPlansResponse> => {
    const params = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        if (value instanceof Date) {
          params.append(key, value.toISOString())
        } else if (Array.isArray(value)) {
          // Convert array to comma-separated string
          params.append(key, value.join(','))
        } else if (typeof value === 'object' && value !== null) {
          // Flatten nested objects like budgetRange
          Object.entries(value).forEach(([nestedKey, nestedValue]) => {
            if (nestedValue !== undefined) {
              params.append(`${key}[${nestedKey}]`, String(nestedValue))
            }
          })
        } else {
          params.append(key, String(value))
        }
      }
    })

    // Add pagination
    params.append('page', String(page))
    params.append('limit', String(limit))

    return api.get(`/travel-plans/search?${params.toString()}`)
  },
  likeTravelPlan: (id: string): Promise<ApiResponse<{ isSaved: boolean }>> =>
    api.post(`/travel-plans/${id}/save`),
}

export interface ReviewInput {
  subjectId: string
  travelPlanId?: string
  rating: number
  comment: string
}

// Review endpoints
export const reviewAPI = {
  create: (data: ReviewInput) =>
    api.post<ApiResponse<{ review: Review }>, ReviewInput>('/reviews', data),

  getMyReviews: (type = 'received', page = 1, limit = 10) =>
    api.get<
      ApiResponse<{
        reviews: Review[]
        averageRating: number
        totalReviews: number
        pagination: {
          page: number
          limit: number
          total: number
          pages: number
        }
      }>
    >(`/reviews/my-reviews?type=${type}&page=${page}&limit=${limit}`),

  getPendingReviews: (page = 1, limit = 10) =>
    api.get<
      ApiResponse<{
        reviews: Review[]
        pagination: {
          page: number
          limit: number
          total: number
          pages: number
        }
      }>
    >(`/reviews/pending-reviews?page=${page}&limit=${limit}`),

  update: (id: string, data: { rating?: number; comment?: string }) =>
    api.patch<
      ApiResponse<{ review: Review }>,
      { rating?: number; comment?: string }
    >(`/reviews/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<{ message: string }>>(`/reviews/${id}`),

  getTravelPlanReviews: (travelPlanId: string) =>
    api.get<ApiResponse<{ reviews: Review[] }>>(
      `/reviews/travel-plan/${travelPlanId}`
    ),

  checkCanReview: (userId: string) =>
    api.get<ApiResponse<CanReview>>(`/reviews/can-review/${userId}`),
}

// Match endpoints
export const matchAPI = {
  create: (data: CreateMatchInput) => api.post('/matches', data),
  getMyMatches: (query: {
    type: 'sent' | 'received'
    travelPlanId?: string
    status?: string
    page?: number
    limit?: number
  }): Promise<
    ApiResponse<{ matches: MatchWithRelations[]; pagination: Pagination }>
  > => api.get(`/matches?${toQueryString(query)}`),
  updateStatus: (id: string, status: string) =>
    api.patch(`/matches/${id}/status`, { status }),
  delete: (id: string) => api.delete(`/matches/${id}`),
  getSuggestions: (travelPlanId?: string, limit = 10) =>
    api.get(`/matches/suggestions?travelPlanId=${travelPlanId}&limit=${limit}`),
}

// Payment endpoints
export const paymentAPI = {
  createSubscription: (
    priceId: string
  ): Promise<ApiResponse<{ sessionId: string; url: string }>> =>
    api.post('/payments/create-subscription', { priceId }),
  createOneTimePayment: (amount: number, description: string) =>
    api.post('/payments/create-payment', { amount, description }),
  getSubscription: (): Promise<SubscriptionResponse> =>
    api.get('/payments/subscription'),
  cancelSubscription: () => api.post('/payments/cancel-subscription'),

  purchaseVerifiedBadge: () =>
    api.post('/payments/create-payment', {
      amount: 19.99,
      description: 'Verified Traveler Badge',
    }),
}

// Upload endpoints
export const uploadAPI = {
  uploadProfileImage: (file: File) => {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('upload_preset', NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)

    return fetch(`${API_BASE_URL}/upload/profile-image`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    }).then((res) => res.json())
  },

  uploadTripPhotos: (files: File[], travelPlanId?: string) => {
    const formData = new FormData()
    files.forEach((file) => formData.append('photos', file))
    if (travelPlanId) formData.append('travelPlanId', travelPlanId)

    return fetch(`${API_BASE_URL}/upload/trip-photos`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    }).then((res) => res.json())
  },

  deleteImage: (url: string) =>
    api.delete('/upload', { body: JSON.stringify({ url }) }),
}

// Admin endpoints
export const adminAPI = {
  getDashboardStats: (): Promise<ApiResponse<DashboardStats>> =>
    api.get('/admin/dashboard'),
  getAnalytics: () => api.get('/admin/analytics'),
  getAllUsers: (
    page = 1,
    limit = 20,
    filters?: string
  ): Promise<
    ApiResponse<{ users: GetUserByAdmin[]; pagination: Pagination }>
  > =>
    api.get(
      `/admin/users?page=${page}&limit=${limit}&${new URLSearchParams(
        filters
      ).toString()}`
    ),
  getUserDetails: (id: string): Promise<ApiResponse<{ user: UserDetails }>> =>
    api.get(`/admin/users/${id}`),
  updateUserStatus: (
    id: string,
    data: { isActive?: boolean; isPremium?: boolean; role?: string }
  ): Promise<ApiResponse<{ user: UpdatedUserStatus }>> =>
    api.patch(`/admin/users/${id}`, data),
  getAllTravelPlans: (
    page = 1,
    limit = 20,
    filters?: string
  ): Promise<
    ApiResponse<{ travelPlans: TravelPlanByAdmin[]; pagination: Pagination }>
  > =>
    api.get(
      `/admin/travel-plans?page=${page}&limit=${limit}&${new URLSearchParams(
        filters
      ).toString()}`
    ),
  deleteTravelPlan: (id: string) => api.delete(`/admin/travel-plans/${id}`),
}

// Message endpoints
export const messageAPI = {
  send: (data: { receiverId: string; content: string; matchId?: string }) =>
    api.post('/messages/send', data),

  getConversations: () => api.get('/messages/conversations'),

  getConversation: (userId: string, page = 1, limit = 50) =>
    api.get(`/messages/conversation/${userId}?page=${page}&limit=${limit}`),

  markAsRead: (messageIds: string[]) =>
    api.post('/messages/read', { messageIds }),

  deleteMessage: (messageId: string) => api.delete(`/messages/${messageId}`),
}

export const otpAPI = {
  sendOtp: (data: { email: string; name?: string }) =>
    api.post<
      ApiResponse<{ message: string }>,
      { email: string; name?: string }
    >('/otp/send', data),

  verifyOtp: (data: { email: string; otp: string }) =>
    api.post<ApiResponse<{ message: string }>, { email: string; otp: string }>(
      '/otp/verify',
      data
    ),
}

export type UserRole = "CUSTOMER" | "SELLER" | "MANAGER" | "ADMIN" | "SUPER_ADMIN"

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string | null
  avatar?: string | null
  role: UserRole
  isVerified: boolean
  isBanned: boolean
  createdAt: string
  updatedAt: string
}

export interface ApiEnvelope<T = unknown> {
  success: boolean
  statusCode: number
  message: string
  data?: T
  error?: string | Record<string, unknown>
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
}

export interface LoginRequest {
  email: string
  password: string
  rememberMe: boolean
}

export interface VerifyEmailRequest {
  email: string
  otp: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
}

export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  phone?: string | null
  avatar?: string | null
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface RegisterResponse {
  success: boolean
  message: string
  email: string
}

export interface VerifyEmailResponse {
  user: User
  accessToken?: string
}

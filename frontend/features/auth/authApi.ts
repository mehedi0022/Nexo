import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react"

import { clearCredentials, markSessionChecked, setCredentials } from "./authSlice"
import type {
  ApiEnvelope,
  ChangePasswordRequest,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  UpdateProfileRequest,
  User,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${API_BASE_URL}/api`,
  credentials: "include",
})

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions)

  if (result.error?.status !== 401) {
    return result
  }

  const refreshResponse = await fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include",
  })

  if (!refreshResponse.ok) {
    api.dispatch(clearCredentials())
    return result
  }

  return rawBaseQuery(args, api, extraOptions)
}

const unwrapEnvelope = <T>(response: ApiEnvelope<T>) => response.data as T

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Session"],
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiEnvelope<RegisterResponse>) =>
        unwrapEnvelope(response),
    }),
    login: builder.mutation<ApiEnvelope, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await queryFulfilled
        dispatch(authApi.endpoints.getMe.initiate(undefined, { forceRefetch: true }))
      },
      invalidatesTags: ["Session"],
    }),
    verifyEmail: builder.mutation<VerifyEmailResponse, VerifyEmailRequest>({
      query: (body) => ({
        url: "/auth/verify-email",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiEnvelope<VerifyEmailResponse>) =>
        unwrapEnvelope(response),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled
        dispatch(setCredentials(data.user))
      },
      invalidatesTags: ["Session"],
    }),
    forgotPassword: builder.mutation<ApiEnvelope, { email: string }>({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<ApiEnvelope, ResetPasswordRequest>({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
    }),
    getMe: builder.query<User, void>({
      query: () => "/auth/me",
      transformResponse: (response: ApiEnvelope<User>) => unwrapEnvelope(response),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setCredentials(data))
        } catch {
          dispatch(markSessionChecked())
        }
      },
      providesTags: ["Session"],
    }),
    getProfile: builder.query<User, void>({
      query: () => "/auth/profile",
      transformResponse: (response: ApiEnvelope<User>) => unwrapEnvelope(response),
      providesTags: ["Session"],
    }),
    updateProfile: builder.mutation<User, UpdateProfileRequest>({
      query: (body) => ({
        url: "/auth/update-profile",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiEnvelope<User>) => unwrapEnvelope(response),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled
        dispatch(setCredentials(data))
      },
      invalidatesTags: ["Session"],
    }),
    changePassword: builder.mutation<ApiEnvelope, ChangePasswordRequest>({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        body,
      }),
    }),
    logout: builder.mutation<ApiEnvelope, void>({
      async queryFn() {
        const response = await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        })
        const data = (await response.json().catch(() => ({
          success: response.ok,
          statusCode: response.status,
          message: response.ok ? "Logged out" : "Logout failed",
        }))) as ApiEnvelope

        if (!response.ok) {
          return {
            error: {
              status: response.status,
              data,
            } as FetchBaseQueryError,
          }
        }

        return { data }
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await queryFulfilled
        dispatch(clearCredentials())
        dispatch(authApi.util.resetApiState())
      },
      invalidatesTags: ["Session"],
    }),
  }),
})

export const {
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useGetMeQuery,
  useGetProfileQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useResetPasswordMutation,
  useUpdateProfileMutation,
  useVerifyEmailMutation,
} = authApi

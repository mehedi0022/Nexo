import type { FetchBaseQueryError } from "@reduxjs/toolkit/query"

import type { ApiEnvelope } from "../types"

export function getErrorMessage(error: unknown) {
  if (!error) {
    return "Something went wrong. Please try again."
  }

  const queryError = error as FetchBaseQueryError
  const data = queryError.data as ApiEnvelope | undefined

  if (typeof data?.error === "string") {
    return data.error
  }

  if (data?.message) {
    return data.message
  }

  if ("message" in (error as Record<string, unknown>)) {
    return String((error as Record<string, unknown>).message)
  }

  return "Something went wrong. Please try again."
}

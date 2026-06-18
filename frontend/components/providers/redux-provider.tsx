"use client"

import * as React from "react"
import { Provider } from "react-redux"

import { useGetMeQuery } from "@/features/auth/authApi"
import { store } from "@/store/store"

function SessionInitializer() {
  useGetMeQuery()
  return null
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SessionInitializer />
      {children}
    </Provider>
  )
}

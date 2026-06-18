import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import type { User } from "./types"

interface AuthState {
  user: User | null
  initialized: boolean
}

const initialState: AuthState = {
  user: null,
  initialized: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.initialized = true
    },
    clearCredentials: (state) => {
      state.user = null
      state.initialized = true
    },
    markSessionChecked: (state) => {
      state.initialized = true
    },
  },
})

export const { clearCredentials, markSessionChecked, setCredentials } =
  authSlice.actions
export const authReducer = authSlice.reducer

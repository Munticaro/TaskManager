import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'app',
  initialState: {
    error: null as null | string,
    status: 'idle' as RequestStatusType,
    isInitialized: false,
  },
  reducers: {
    setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status
    },
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error
    },
    setAppInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized
    },
  },
})

export const appActions = slice.actions
export const appSlice = slice.reducer

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type AppState = ReturnType<typeof slice.getInitialState>

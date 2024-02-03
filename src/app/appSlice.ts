import { Action, createSlice, PayloadAction } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'app',
  initialState: {
    error: null as null | string,
    status: 'idle' as RequestStatusType,
    isInitialized: false,
  },
  reducers: {
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error
    },
    setAppInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action: Action) => {
          return action.type.endsWith('/pending')
        },
        (state, action) => {
          state.status = 'loading'
        },
      )
      .addMatcher(
        (action: Action) => {
          return action.type.endsWith('/fulfilled')
        },
        (state, action) => {
          state.status = 'succeeded'
        },
      )
      .addMatcher(
        (action: Action) => {
          return action.type.endsWith('/rejected')
        },
        (state, action) => {
          state.status = 'failed'
        },
      )
  },
})

export const appActions = slice.actions
export const appSlice = slice.reducer

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type AppState = ReturnType<typeof slice.getInitialState>

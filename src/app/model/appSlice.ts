import { AnyAction, createSlice, isFulfilled, isPending, isRejected, PayloadAction } from '@reduxjs/toolkit'
import { todolistThunks } from 'features/todolistLists/model/todolist/todolistsSlice'
import { tasksThunks } from 'features/todolistLists/model/task/taskSlice'

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
      .addMatcher(isPending, (state, action) => {
        state.status = 'loading'
      })
      .addMatcher(isFulfilled, (state, action) => {
        state.status = 'succeeded'
      })
      .addMatcher(isRejected, (state, action: AnyAction) => {
        state.status = 'failed'
        if (action.payload) {
          if (
            action.type === todolistThunks.addTodolist.rejected.type ||
            action.type === tasksThunks.addTask.rejected.type
          )
            return
          state.error = action.payload.messages[0]
        } else {
          state.error = action.error.message ? action.error.message : 'Some error occurred'
        }
      })
  },
})

export const appActions = slice.actions
export const appSlice = slice.reducer

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type AppState = ReturnType<typeof slice.getInitialState>

import { createSlice, isAnyOf } from '@reduxjs/toolkit'
import { appActions } from 'app/model/appSlice'
import { authApi } from 'features/auth/api/authApi'
import { createAppAsyncThunk } from 'common/utils'
import { clearTodolistsAndTasks } from 'common/actions/common.actions'
import { LoginParamsType } from 'features/auth/api/authApi.types'
import { ResultCode } from 'common/enums'

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>(
  'auth/login',
  async (arg, { rejectWithValue }) => {
    const res = await authApi.login(arg)
    if (res.data.resultCode === ResultCode.Success) {
      return { isLoggedIn: true }
    } else {
      return rejectWithValue(res.data)
    }
  },
)

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, void>('auth/logout', async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  const res = await authApi.logout()
  if (res.data.resultCode === ResultCode.Success) {
    dispatch(clearTodolistsAndTasks({}, []))
    return { isLoggedIn: false }
  } else {
    return rejectWithValue(res.data)
  }
})

const isInitializedApp = createAppAsyncThunk<{ isLoggedIn: boolean }, void>(
  'app/initializeApp',
  async (_, { rejectWithValue, dispatch }) => {
    const res = await authApi.me().finally(() => {
      dispatch(appActions.setAppInitialized({ isInitialized: true }))
    })
    if (res.data.resultCode === ResultCode.Success) {
      return { isLoggedIn: true }
    } else {
      return rejectWithValue(res.data)
    }
  })

const slice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(authThunks.login.fulfilled, authThunks.logout.fulfilled, authThunks.isInitializedApp.fulfilled),
      (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
      },
    )
  },
})

export const authSlice = slice.reducer

export const authThunks = { login, logout, isInitializedApp }

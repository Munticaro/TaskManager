import { createSlice } from '@reduxjs/toolkit'
import { appActions } from 'app/appSlice'
import { authApi } from 'features/auth/api/authApi'
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from 'common/utils'
import { clearTodolistsAndTasks } from 'common/actions/common.actions'
import { LoginParamsType } from 'features/auth/api/authApi.types'
import { ResultCode } from 'common/enums'
import { thunkTryCatch } from 'common/utils/thunkTryCatch'

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>('auth/login', async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    try {
        const res = await authApi.login(arg)
        if (res.data.resultCode === ResultCode.Success) {
            dispatch(appActions.setAppStatus({ status: 'succeeded' }))
            return { isLoggedIn: true }
        } else {
            const isShowAppError = !res.data.fieldsErrors.length
            handleServerAppError(res.data, dispatch, isShowAppError)
            return rejectWithValue(res.data)
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, void>('auth/logout', async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    try {
        const res = await authApi.logout()
        if (res.data.resultCode === ResultCode.Success) {
            dispatch(clearTodolistsAndTasks({}, []))
            dispatch(appActions.setAppStatus({ status: 'succeeded' }))
            return { isLoggedIn: false }
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})

const isInitializedApp = createAppAsyncThunk<{ isLoggedIn: boolean }, void>(
    'app/initializeApp',
    async (_, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        return thunkTryCatch(thunkAPI, async () => {
            const res = await authApi.me()
            if (res.data.resultCode === ResultCode.Success) {
                dispatch(appActions.setAppStatus({ status: 'succeeded' }))
                return { isLoggedIn: true }
            } else {
                handleServerAppError(res.data, dispatch, false)
                return rejectWithValue(null)
            }
        }).finally(() => {
            dispatch(appActions.setAppInitialized({ isInitialized: true }))
        })
    },
)

const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
            .addCase(isInitializedApp.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
    },
})

export const authActions = slice.actions
export const authSlice = slice.reducer

export const authThunks = { login, logout, isInitializedApp }

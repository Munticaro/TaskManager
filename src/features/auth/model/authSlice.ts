import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { appActions } from 'app/appSlice'
import { authApi } from 'features/auth/api/authApi'
import { handleServerAppError, handleServerNetworkError } from 'common/utils'
import { clearTodolistsAndTasks } from 'common/actions/common.actions'
import { LoginParamsType } from 'features/auth/api/authApi.types'

export const login = createAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>('auth/login', async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    try {
        const res = await authApi.login(arg)
        if (res.data.resultCode === 0) {
            dispatch(appActions.setAppStatus({ status: 'succeeded' }))
            return { isLoggedIn: true }
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})

export const logout = createAsyncThunk('auth/logout', async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    const res = await authApi.logout()
    try {
        if (res.data.resultCode === 0) {
            dispatch(authActions.setLoggedIn({ isLoggedIn: false }))
            dispatch(clearTodolistsAndTasks({}, []))
            dispatch(appActions.setAppStatus({ status: 'succeeded' }))
        } else {
            handleServerAppError(res.data, dispatch)
            rejectWithValue(null)
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})

const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false,
    },
    reducers: {
        setLoggedIn(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
            state.isLoggedIn = action.payload.isLoggedIn
        },
    },
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
        })
    },
})

export const authActions = slice.actions
export const authSlice = slice.reducer

export const authThunks = { login, logout }

import {LoginParamsType} from "../../../api/todolist-api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {appActions} from "../../reducer/app-reducer/app-reducer";
import {authAPI} from "../../../api/auth-api/auth-api";
import {clearTodolistsAndTasks} from "../../../common/actions/common.actions";

export const login = createAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>('auth/login', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppStatus({status: "loading"}))
    try {
        const res = await authAPI.login(arg)
        if (res.data.resultCode === 0) {
            dispatch(appActions.setAppStatus({status: "succeeded"}))
            return {isLoggedIn: true}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null);
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch);
        return rejectWithValue(null);
    }
})

export const logout = createAsyncThunk('auth/logout', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppStatus({status: "loading"}))
    const res = await authAPI.logout()
        try {
            if (res.data.resultCode === 0) {
                dispatch(authActions.setLoggedIn({isLoggedIn: false}))
                dispatch(clearTodolistsAndTasks({}, []))
                dispatch(appActions.setAppStatus({status: "succeeded"}))
            } else {
                handleServerAppError(res.data, dispatch)
                rejectWithValue(null);
            }
        }
        catch(error) {
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(null);
        }
})

const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setLoggedIn(state, action: PayloadAction<{isLoggedIn: boolean}>) {
            state.isLoggedIn = action.payload.isLoggedIn
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
    }
})

export const authActions = slice.actions
export const authSlice = slice.reducer

export const authThunks = {login, logout};

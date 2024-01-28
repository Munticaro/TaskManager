import {Dispatch} from "redux";
import {LoginParamsType} from "../../../api/todolist-api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {appActions} from "../app-slice/app-slice";
import {AppThunk} from "../../store";
import {authAPI} from "../../../api/auth-api/auth-api";
import {clearTodolistsAndTasks} from "../../../common/actions/common.actions";

export const login = createAsyncThunk('auth/login', async (param: LoginParamsType, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppStatus({status: "loading"}))
    try {
        const res = await authAPI.login(param)
        if (res.data.resultCode === 0) {
            dispatch(appActions.setAppStatus({status: "succeeded"}))
            return {isLoggedIn: true}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null);
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch);
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

export const logoutTC = (): AppThunk => (dispatch: Dispatch) => {
    dispatch(appActions.setAppStatus({status: "loading"}))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(authActions.setLoggedIn({isLoggedIn: false}))
                dispatch(clearTodolistsAndTasks({}, []))
                dispatch(appActions.setAppStatus({status: "succeeded"}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}

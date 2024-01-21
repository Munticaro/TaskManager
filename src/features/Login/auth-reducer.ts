import {Dispatch} from "redux";
import {authAPI, LoginParamsType} from "../../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {appActions} from "../../app/app-reducer";


const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
            state.isLoggedIn = action.payload.isLoggedIn
        }
    }
})

export const authActions = slice.actions
export const authReducer = slice.reducer

// Thunks
export const loginTC = (params: LoginParamsType) => (dispatch: Dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }))
    authAPI.login(params)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(authActions.setLoggedIn({isLoggedIn: true}))
                dispatch(appActions.setAppStatus({ status: "succeeded" }))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}

export const logoutTC = () => (dispatch: Dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(authActions.setLoggedIn({isLoggedIn: false}))
                dispatch(appActions.setAppStatus({ status: "succeeded" }))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error)=>{
            handleServerNetworkError(error, dispatch)
        })
}

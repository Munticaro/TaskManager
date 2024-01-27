import {Dispatch} from "redux";

import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {authActions} from "../auth-slice/auth-slice";
import {authAPI} from "../../../api/auth-api/auth-api";

export const slice = createSlice({
    name: 'app',
    initialState: {
        error: null as null | string,
        status: 'idle' as RequestStatusType,
        isInitialized: false
    },
    reducers: {
        setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
            state.status = action.payload.status
        },
        setAppError: (state, action: PayloadAction<{error: string | null}>) => {
            state.error = action.payload.error
        },
        setAppIsInitialized: (state, action: PayloadAction<{ initialized: boolean }>) => {
            state.isInitialized = action.payload.initialized
        },
    }
})

export const appActions = slice.actions
export const appSlice = slice.reducer

export const isInitializedAppTC = () => (dispatch: Dispatch) => {
    authAPI.me()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(authActions.setLoggedIn({isLoggedIn: true}))
                dispatch(appActions.setAppStatus({ status: "succeeded" }))
            }
            dispatch(appActions.setAppIsInitialized({ initialized: true }))
        })
}

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type AppState = ReturnType<typeof slice.getInitialState>




import {Dispatch} from "redux";
import {authAPI} from "../api/todolists-api";
import {setLoggedInAC} from "../features/Login/auth-reducer";

const initialState = {
    error: null as null | string,
    status: 'idle' as RequestStatusType,
    isInitialized: false
}

export const appReducer = (state: InitialStateType = initialState, action: AppActionType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case "APP/SET-IS-INITIALIZED":
            return {...state, isInitialized: action.initialized}
        default:
            return state
    }
}

export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)

export const setAppErrorAC = (error: null | string) => ({type: 'APP/SET-ERROR', error} as const)
export const setAppIsInitializedAC = (initialized: boolean) => ({type: 'APP/SET-IS-INITIALIZED', initialized} as const)

export const isInitializedAppTC = () => (dispatch: Dispatch) => {
    authAPI.me()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setLoggedInAC(true))
            }
            dispatch(setAppIsInitializedAC(true))
        })
}

export const logoutTC = () => (dispatch: Dispatch) => {
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setLoggedInAC(false))
            }
            dispatch(setAppIsInitializedAC(true))
        })
}

type AppActionType = SetStatusType | SetErrorType | isInitializedAppType

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type InitialStateType = {
    // происходит ли сейчас взаимодействие с сервером
    status: RequestStatusType
    // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
    error: string | null
    // true когда приложение проинициализировалось
    isInitialized: boolean


}

export type SetStatusType = ReturnType<typeof setAppStatusAC>

export type SetErrorType = ReturnType<typeof setAppErrorAC>

export type isInitializedAppType = ReturnType<typeof setAppIsInitializedAC>




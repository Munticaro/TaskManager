import {Dispatch} from "redux";
import {setAppStatusAC, SetErrorType, SetStatusType} from "../../app/app-reducer";
import {authAPI, LoginParamsType} from "../../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

const initialState: InitialStateType = {
    isLoggedIn: false
}

export const isLoggedIn = (state: InitialStateType = initialState, action: ActionsTypes): InitialStateType => {
    switch (action.type) {
        case "login/SET-LOGIN-IN":
            return {...state, isLoggedIn: action.value}
        default:
            return state
        }
}

// actions

export const setLoggedInAC = (value: boolean) => {
    return ({type: "login/SET-LOGIN-IN", value} as const)
}

// Thunks
export const loginTC = (params: LoginParamsType) => (dispatch: Dispatch<ActionsTypes>) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.login(params)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setLoggedInAC(true))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}


//Types

type ActionsTypes =
    ReturnType<typeof setLoggedInAC> |
    SetStatusType |
    SetErrorType
type InitialStateType = {
    isLoggedIn: boolean
}

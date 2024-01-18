import {setAppErrorAC, setAppStatusAC} from "../app/app-reducer";
import {ResponseType, TaskType} from "../api/todolists-api";
import {AppDispatchType} from "../app/store";
import {Dispatch} from "redux";
import {ActionsTypes} from "../features/TodolistLists/store/todolists-reducer";



export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch<ActionsTypes>) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]))
    } else {
        dispatch(setAppErrorAC('Some error occurred'))
    }
    dispatch(setAppStatusAC('failed'))
}

export const handleServerNetworkError = (error: { messages: string }, dispatch: Dispatch<ActionsTypes>) => {
    dispatch(setAppErrorAC(error.messages ? error.messages : 'Some error occurred'))
    dispatch(setAppStatusAC('failed'))
}
import {appActions} from "../store/slice/app-slice/app-slice";
import {ResponseType} from "../api/todolist-api/todolists-api";
import {Dispatch} from "redux";



export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch) => {
    if (data.messages.length) {
        dispatch(appActions.setAppError({error: data.messages[0]}))
    } else {
        dispatch(appActions.setAppError({error: "Some error occurred"}))
    }
    dispatch(appActions.setAppStatus({status: 'failed'}))
}

export const handleServerNetworkError = (error: { messages: string }, dispatch: Dispatch) => {
    dispatch(appActions.setAppError({error: error.messages ? error.messages : 'Some error occurred'}))
    dispatch(appActions.setAppStatus({status: 'failed'}))
}
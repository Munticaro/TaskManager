import {todolistAPI, TodolistType} from "../../../api/todolists-api";
import {Dispatch} from "redux";
import {RequestStatusType, setAppStatusAC, SetErrorType, SetStatusType} from "../../../app/app-reducer";
import {handleServerNetworkError} from "../../../utils/error-utils";

const initialState: TodolistDomainType[] = []

// Actions
export const todolistsReducer = (state: TodolistDomainType[] =
                                     initialState, action: ActionsTypes): TodolistDomainType[] => {
    switch (action.type) {
        case 'ADD-TODOLIST':
            return [{filter: 'all', entityStatus: 'idle', ...action.todolist}, ...state]
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id !== action.id)
        }
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(el => el.id === action.id ? {...el, filter: action.filter} : el)
        case "CHANGE-TODOLIST-STATUS":
            return state.map(el => el.id === action.id ? {...el, entityStatus: action.status} : el)
        case "SET-TODOLISTS":
            return action.todolists.map(tl => ({...tl, filter: "all", entityStatus: 'idle',}))
        default:
            return state
    }
}
export const removeTodolistAC = (id: string) =>
    ({type: 'REMOVE-TODOLIST', id} as const)
export const addTodolistAC = (todolist: TodolistType) =>
    ({type: 'ADD-TODOLIST', todolist} as const)
export const changeTodolistTitleAC = (id: string, title: string) =>
    ({type: 'CHANGE-TODOLIST-TITLE', id: id, title: title} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) =>
    ({type: 'CHANGE-TODOLIST-FILTER', id: id, filter: filter} as const)
export const setTodolistsAC = (todolists: TodolistType[]) =>
    ({type: 'SET-TODOLISTS', todolists} as const)
export const setTodolistEntityStatusAC = (id: string, status: RequestStatusType) =>
    ({type: 'CHANGE-TODOLIST-STATUS', id, status} as const)

// Thunks
export const getTodolistTC = () => (dispatch: Dispatch<ActionsTypes>) => {
    dispatch(setAppStatusAC('loading'))
    todolistAPI.getTodolist()
        .then((res) => {
            dispatch(setTodolistsAC(res.data))
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch<ActionsTypes>) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(setTodolistEntityStatusAC(todolistId, 'loading'))
    todolistAPI.deleteTodolist(todolistId)
        .then(res => {
            dispatch(removeTodolistAC(todolistId))
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const addTodolistTC = (title: string) => (dispatch: Dispatch<ActionsTypes>) => {
    dispatch(setAppStatusAC('loading'))
    todolistAPI.createTodolist(title)
        .then(res => {
            dispatch(addTodolistAC(res.data.data.item))
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}

export const changeTodolistTitleTC = (id: string, title: string) => (dispatch: Dispatch<ActionsTypes>) => {
    todolistAPI.updateTodolist(id, title)
        .then(res => {
            dispatch(changeTodolistTitleAC(id, title))
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}

export type AddTodolistAT = ReturnType<typeof addTodolistAC>
export type RemoveTodolistAT = ReturnType<typeof removeTodolistAC>
export type SetTodolistsAT = ReturnType<typeof setTodolistsAC>;
export type ActionsTypes =
    | RemoveTodolistAT
    | AddTodolistAT
    | SetTodolistsAT
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof setTodolistEntityStatusAC>
    | SetStatusType
    | SetErrorType


export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}


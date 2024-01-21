import {todolistAPI, TodolistType} from "../../../api/todolists-api";
import {Dispatch} from "redux";
import {appActions, RequestStatusType} from "../../../app/app-reducer";
import {handleServerNetworkError} from "../../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunk} from "../../../app/store";

export const slice = createSlice({
    name: 'todolists',
    initialState: [] as TodolistDomainType[],
    reducers: {
        addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
            const newTodo: TodolistDomainType = { ...action.payload.todolist, filter: "all", entityStatus: "idle" }
            state.unshift(newTodo)
        },
        removeTodolist: (state, action: PayloadAction<{ id: string }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            if (index !== -1) {
                state.splice(index, 1)
            }
        },
        changeTodolistTitle: (state, action: PayloadAction<{ id: string, title: string }>) => {
            const todolist = state.find((todo) => todo.id === action.payload.id)
            if (todolist) {
                todolist.title = action.payload.title
            }
        },
        changeTodolistFilter: (state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) => {
            const todolist = state.find((todo) => todo.id === action.payload.id)
            if (todolist) {
                todolist.filter = action.payload.filter
            }
        },
        setTodolists: (state, action: PayloadAction<{ todolists: TodolistType[] }>) => {
            return action.payload.todolists.map(tl => ({ ...tl, filter: "all", entityStatus: "idle" }))
        },
        setTodolistEntityStatus: (state, action: PayloadAction<{ id: string, status: RequestStatusType }>) => {
            const todolist = state.find((todo) => todo.id === action.payload.id)
            if (todolist) {
                todolist.entityStatus = action.payload.status
            }
        },
    }
})

export const todolistsActions = slice.actions
export const todolistsReducer = slice.reducer

// Thunks
export const getTodolistTC = (): AppThunk => (dispatch: Dispatch) => {
    dispatch(appActions.setAppStatus({status: 'loading'}))
    todolistAPI.getTodolist()
        .then((res) => {
            dispatch(todolistsActions.setTodolists({todolists: res.data}))
            dispatch(appActions.setAppStatus({ status: "succeeded" }))
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const removeTodolistTC = (id: string): AppThunk => (dispatch: Dispatch) => {
    dispatch(appActions.setAppStatus({status: 'loading'}))
    dispatch(todolistsActions.setTodolistEntityStatus({id, status: 'loading'}))
    todolistAPI.deleteTodolist(id)
        .then(res => {
            dispatch(todolistsActions.removeTodolist({id}))
            dispatch(appActions.setAppStatus({ status: "succeeded" }))
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const addTodolistTC = (title: string): AppThunk => (dispatch: Dispatch) => {
    dispatch(appActions.setAppStatus({status: 'loading'}))
    todolistAPI.createTodolist(title)
        .then(res => {
            dispatch(todolistsActions.addTodolist({todolist: res.data.data.item}))
            dispatch(appActions.setAppStatus({ status: "succeeded" }))
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}

export const changeTodolistTitleTC = (id: string, title: string): AppThunk => (dispatch: Dispatch) => {
    dispatch(appActions.setAppStatus({status: 'loading'}))
    todolistAPI.updateTodolist(id, title)
        .then(res => {
            dispatch(todolistsActions.changeTodolistTitle({id, title}))
            dispatch(appActions.setAppStatus({ status: "succeeded" }))
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}

export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}


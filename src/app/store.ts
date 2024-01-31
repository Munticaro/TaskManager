import { Action, combineReducers } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { appSlice } from 'app/appSlice'
import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from 'features/auth/model/authSlice'
import { todolistsSlice } from 'features/todolistLists/model/todolist/todolistsSlice'
import { tasksSlice } from 'features/todolistLists/model/task/taskSlice'

const rootReducer = combineReducers({
    tasks: tasksSlice,
    todolists: todolistsSlice,
    app: appSlice,
    auth: authSlice,
})

export const store = configureStore({
    reducer: rootReducer,
})

export type AppRootStateType = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

//TODO: REMOVE
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, Action>
// @ts-ignore
window.store = store

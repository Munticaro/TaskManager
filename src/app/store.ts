import { Action, combineReducers } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { appSlice } from 'app/appSlice'
import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from 'features/auth/model/authSlice'
import { todolistsSlice } from 'features/todolistLists/model/todolist/todolistsSlice'
import { tasksSlice } from 'features/todolistLists/model/task/taskSlice'
export const store = configureStore({
    reducer: {
        tasks: tasksSlice,
        todolists: todolistsSlice,
        app: appSlice,
        auth: authSlice,
    },
})

export type AppRootStateType = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// @ts-ignore
window.store = store

import {tasksSlice} from './slice/task-slice/tasks-slice';
import {todolistsSlice} from './slice/todolists-slice/todolists-slice';
import {Action, combineReducers} from 'redux';

import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {ThunkAction, ThunkDispatch} from "redux-thunk";
import {appSlice} from "./slice/app-slice/app-slice";
import {authSlice} from "./slice/auth-slice/auth-slice";
import {configureStore} from "@reduxjs/toolkit";


const rootReducer = combineReducers({
    tasks: tasksSlice,
    todolists: todolistsSlice,
    app: appSlice,
    auth: authSlice
})

export const store = configureStore({
    reducer: rootReducer
})

export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, Action>
export type AppDispatch = ThunkDispatch<AppRootStateType, any, Action>
export const useAppDispatch = useDispatch<AppDispatch>
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

// @ts-ignore
window.store = store;

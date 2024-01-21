import {tasksReducer} from '../features/TodolistLists/store/tasks-reducer';
import {todolistsReducer} from '../features/TodolistLists/store/todolists-reducer';
import {Action, combineReducers} from 'redux';

import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {ThunkAction, ThunkDispatch} from "redux-thunk";
import {appReducer} from "./app-reducer";
import {authReducer} from "../features/Login/auth-reducer";
import {configureStore} from "@reduxjs/toolkit";


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})

export const store = configureStore({
    reducer: rootReducer
})

export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, Action>
export type AppDispatchType = ThunkDispatch<AppRootStateType, any, Action>
export const useAppDispatch = useDispatch<AppDispatchType>
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

// @ts-ignore
window.store = store;

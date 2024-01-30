import {tasksReducer} from './reducer/task-reducer/tasks-reducer';
import {todolistsReducer} from './reducer/todolists-reducer/todolists-reducer';
import {Action, combineReducers} from 'redux';

import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {ThunkAction, ThunkDispatch} from "redux-thunk";
import {appReducer} from "./reducer/app-reducer/app-reducer";
import {authSlice} from "./slice/auth-slice/auth-slice";
import {configureStore} from "@reduxjs/toolkit";


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
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

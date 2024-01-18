import React from 'react'
import {Provider} from "react-redux";
import {AppRootStateType} from "../../../app/store";
import {applyMiddleware, combineReducers, legacy_createStore} from "redux";
import {tasksReducer} from './tasks-reducer';
import {todolistsReducer} from "./todolists-reducer";
import {v1} from "uuid";
import {TaskPriorities, TaskStatuses} from "../../../api/todolists-api";
import {appReducer, RequestStatusType} from "../../../app/app-reducer";
import thunk from "redux-thunk";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer
})

const initialGlobalState: AppRootStateType = {
    todolists: [
        {id: "todolistId1", title: "What to learn", filter: "all", entityStatus: 'succeeded', addedDate: '', order: 0},
        {id: "todolistId2", title: "What to buy", filter: "all", entityStatus: 'loading', addedDate: '', order: 0}
    ],
    tasks: {
        ["todolistId1"]: [
            {
                id: v1(),
                title: "HTML&CSS",
                status: TaskStatuses.Completed,
                todoListId: 'todolistId1',
                description: '',
                startDate: '',
                deadline: '',
                order: 0,
                priority: TaskPriorities.Low,
                addedDate: ''
            },
            {
                id: v1(),
                title: "JS",
                status: TaskStatuses.InProgress,
                todoListId: 'todolistId1',
                description: '',
                startDate: '',
                deadline: '',
                order: 0,
                priority: TaskPriorities.Low,
                addedDate: ''
            }
        ],
        ["todolistId2"]: [
            {
                id: v1(),
                title: "Milk",
                status: TaskStatuses.Completed,
                todoListId: 'todolistId2',
                description: '',
                startDate: '',
                deadline: '',
                order: 0,
                priority: TaskPriorities.Low,
                addedDate: ''
            },
            {
                id: v1(),
                title: "React Book",
                status: TaskStatuses.New,
                todoListId: 'todolistId2',
                description: '',
                startDate: '',
                deadline: '',
                order: 0,
                priority: TaskPriorities.Low,
                addedDate: ''
            }
        ]
    },
    app: {
        error: null as null | string,
        status: 'loading' as RequestStatusType,
        isInitialized: false
    },
    auth: {
        isLoggedIn: false,
    }
};

export const storyBookStore = legacy_createStore(rootReducer, initialGlobalState, applyMiddleware(thunk));


export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
    return <Provider store={storyBookStore}>{storyFn()}</Provider>
}
import React from 'react'
import { Provider } from 'react-redux'

import { combineReducers } from 'redux'

import { v1 } from 'uuid'

import { configureStore } from '@reduxjs/toolkit'
import { appSlice, RequestStatusType } from 'app/model/appSlice'
import { tasksSlice } from 'features/todolistLists/model/task/taskSlice'
import { todolistsSlice } from 'features/todolistLists/model/todolist/todolistsSlice'
import { AppRootStateType } from 'app/store'
import { TaskPriorities, TaskStatuses } from 'common/enums'

const rootReducer = combineReducers({
  tasks: tasksSlice,
  todolists: todolistsSlice,
  app: appSlice,
})

const initialGlobalState: AppRootStateType = {
  todolists: [
    {
      id: 'todolistId1',
      title: 'What to learn',
      filter: 'all',
      entityStatus: 'succeeded',
      addedDate: '',
      order: 0,
    },
    { id: 'todolistId2', title: 'What to buy', filter: 'all', entityStatus: 'loading', addedDate: '', order: 0 },
  ],
  tasks: {
    ['todolistId1']: [
      {
        id: v1(),
        title: 'HTML&CSS',
        status: TaskStatuses.Completed,
        todoListId: 'todolistId1',
        description: '',
        startDate: '',
        deadline: '',
        order: 0,
        priority: TaskPriorities.Low,
        addedDate: '',
      },
      {
        id: v1(),
        title: 'JS',
        status: TaskStatuses.InProgress,
        todoListId: 'todolistId1',
        description: '',
        startDate: '',
        deadline: '',
        order: 0,
        priority: TaskPriorities.Low,
        addedDate: '',
      },
    ],
    ['todolistId2']: [
      {
        id: v1(),
        title: 'Milk',
        status: TaskStatuses.Completed,
        todoListId: 'todolistId2',
        description: '',
        startDate: '',
        deadline: '',
        order: 0,
        priority: TaskPriorities.Low,
        addedDate: '',
      },
      {
        id: v1(),
        title: 'React Book',
        status: TaskStatuses.New,
        todoListId: 'todolistId2',
        description: '',
        startDate: '',
        deadline: '',
        order: 0,
        priority: TaskPriorities.Low,
        addedDate: '',
      },
    ],
  },
  app: {
    error: null as null | string,
    status: 'loading' as RequestStatusType,
    isInitialized: true,
  },
  auth: {
    isLoggedIn: false,
  },
}

export const storyBookStore = configureStore({
  reducer: rootReducer,
  preloadedState: initialGlobalState,
})

export const ReduxStoreProviderDecorator = (storyFn: any) => {
  return <Provider store={storyBookStore}>{storyFn()}</Provider>
}

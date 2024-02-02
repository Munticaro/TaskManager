import { createAction } from '@reduxjs/toolkit'
import { TasksStateType } from 'features/todolistLists/model/task/taskSlice'
import { TodolistDomainType } from 'features/todolistLists/model/todolist/todolistsSlice'

export type clearTodolistsAndTasksType = {
  tasks: TasksStateType
  todolists: TodolistDomainType[]
}

export const clearTodolistsAndTasks = createAction(
  'common/clear-tasks-todolists',
  (tasks: TasksStateType, todolists: TodolistDomainType[]) => {
    return {
      payload: {
        tasks,
        todolists,
      },
    }
  },
)

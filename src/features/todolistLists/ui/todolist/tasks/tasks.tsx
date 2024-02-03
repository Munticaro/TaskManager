import React from 'react'
import { Task } from 'features/todolistLists/ui/tasks/task/task'
import { TaskStatuses } from 'common/enums'
import { TodolistDomainType } from 'features/todolistLists/model/todolist/todolistsSlice'
import { TaskType } from 'features/todolistLists/api/task/taskApi.types'
type Props = {
  todolist: TodolistDomainType
  tasks: TaskType[]
}
export const Tasks = ({ todolist, tasks }: Props) => {
  let tasksForTodolist = tasks
  if (todolist.filter === 'active') {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New)
  }
  if (todolist.filter === 'completed') {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed)
  }
  return (
    <>
      {tasksForTodolist.map((t) => (
        <Task task={t} key={t.id} todoListId={todolist.id} />
      ))}
    </>
  )
}

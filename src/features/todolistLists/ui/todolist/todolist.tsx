import React, { useCallback, useEffect } from 'react'
import { AddItemForm } from 'common/components/AddItemForm/AddItemForm'
import { EditableSpan } from 'common/components/EditableSpan/EditableSpan'
import { Task } from 'features/todolistLists/ui/task/task'
import { IconButton } from '@mui/material'
import { PlaylistRemove } from '@mui/icons-material'
import { AppDispatch } from 'app/store'
import { useAppDispatch } from 'common/hooks/useAppDispatch'
import { tasksThunks } from 'features/todolistLists/model/task/taskSlice'
import { TodolistDomainType } from 'features/todolistLists/model/todolist/todolistsSlice'
import { TaskType } from 'features/todolistLists/api/task/taskApi.types'
import { FilterTasksButtons } from 'features/todolistLists/model/task/FilterTasksButtons/FilterTasksButtons'
import { TaskStatuses } from 'common/enums'

type PropsType = {
  todolist: TodolistDomainType
  tasks: TaskType[]
  removeTodolist: (todolistId: string) => void
  changeTodolistTitle: (todolistId: string, newTitle: string) => void
  demo?: boolean
}

export const Todolist: React.FC<PropsType> = React.memo(function (
  { todolist, tasks, changeTodolistTitle, removeTodolist }: PropsType,
  { demo = false, ...props },
) {
  const dispatch: AppDispatch = useAppDispatch()

  useEffect(() => {
    if (demo) {
      return
    }
    dispatch(tasksThunks.fetchTasks(todolist.id))
  }, [])
  const removeTodolistHandler = () => {
    removeTodolist(todolist.id)
  }
  const changeTodolistTitleHandler = useCallback(
    (newTitle: string) => {
      changeTodolistTitle(todolist.id, newTitle)
    },
    [todolist.id, changeTodolistTitle],
  )

  const addTask = (title: string) => {
    debugger
    dispatch(tasksThunks.addTask({ title, todolistId: todolist.id }))
  }
  const todoTitle = todolist.title
  const buttonFormDisabler = todolist.entityStatus === 'loading'
  let tasksForTodolist = tasks
  if (todolist.filter === 'active') {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New) /// isDone === false
  }
  if (todolist.filter === 'completed') {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed) /// isDone === true
  }

  return (
    <div className='App'>
      <div>
        {/*Title*/}
        <h3>
          <EditableSpan title={todoTitle} onChange={changeTodolistTitleHandler} />
          <IconButton onClick={removeTodolistHandler} disabled={buttonFormDisabler}>
            <PlaylistRemove />
          </IconButton>
        </h3>
        <AddItemForm addItem={addTask} disabled={buttonFormDisabler} />
        {/*Tasks*/}
        <div>
          {tasksForTodolist.map((t) => (
            <Task task={t} key={t.id} todoListId={todolist.id} />
          ))}
        </div>
        <div style={{ paddingTop: '10px' }}>
          <FilterTasksButtons todolist={todolist} />
        </div>
      </div>
    </div>
  )
})

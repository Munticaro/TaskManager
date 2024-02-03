import React, { useCallback } from 'react'
import { EditableSpan } from 'common/components/EditableSpan/EditableSpan'
import { IconButton } from '@mui/material'
import { PlaylistRemove } from '@mui/icons-material'
import { TodolistDomainType } from 'features/todolistLists/model/todolist/todolistsSlice'
import { TaskType } from 'features/todolistLists/api/task/taskApi.types'

type Props = {
  todolist: TodolistDomainType
  removeTodolist: (todolistId: string) => void
  changeTodolistTitle: (todolistId: string, newTitle: string) => void
  demo?: boolean
  tasks: TaskType[]
}

export const TodolistTitle = ({ todolist, removeTodolist, changeTodolistTitle }: Props) => {
  const todoTitle = todolist.title

  const removeTodolistHandler = () => {
    removeTodolist(todolist.id)
  }
  const changeTodolistTitleHandler = useCallback(
    (newTitle: string) => {
      changeTodolistTitle(todolist.id, newTitle)
    },
    [todolist.id, changeTodolistTitle],
  )

  const buttonFormDisabler = todolist.entityStatus === 'loading'

  return (
    <>
      <h3>
        <EditableSpan title={todoTitle} onChange={changeTodolistTitleHandler} />
        <IconButton onClick={removeTodolistHandler} disabled={buttonFormDisabler}>
          <PlaylistRemove />
        </IconButton>
      </h3>
    </>
  )
}

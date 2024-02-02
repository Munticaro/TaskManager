import React, { ChangeEvent, useCallback } from 'react'
import { EditableSpan } from 'common/components/EditableSpan/EditableSpan'
import { Checkbox, IconButton } from '@mui/material'
import { RemoveCircleOutline } from '@mui/icons-material'
import { TaskStatuses } from 'common/enums'
import { TaskType } from 'features/todolistLists/api/task/taskApi.types'
import { tasksThunks } from 'features/todolistLists/model/task/taskSlice'
import { AppDispatch } from 'app/store'
import { useAppDispatch } from 'common/hooks'
import s from './task.module.css'

type Props = {
  task: TaskType
  todoListId: string
}

export const Task = React.memo(({ task, todoListId }: Props) => {
  const dispatch: AppDispatch = useAppDispatch()
  const deleteHandler = () => {
    dispatch(tasksThunks.removeTask({ taskId: task.id, todolistId: todoListId }))
  }
  const changeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let newIsDoneValue = e.currentTarget.checked
    let status = newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New
    dispatch(
      tasksThunks.updateTask({
        taskId: task.id,
        todoListId,
        domainModel: { status },
      }),
    )
  }
  const changeTaskTitleHandler = useCallback(
    (title: string) => {
      dispatch(tasksThunks.updateTask({ taskId: task.id, todoListId: todoListId, domainModel: { title } }))
    },
    [task.id, todoListId],
  )
  return (
    <div key={task.id} className={task.status === TaskStatuses.Completed ? s.isDone : ''}>
      <Checkbox onChange={changeStatusHandler} checked={task.status === TaskStatuses.Completed} color={'warning'} />
      <EditableSpan title={task.title} onChange={changeTaskTitleHandler} />
      <IconButton onClick={deleteHandler}>
        <RemoveCircleOutline />
      </IconButton>
    </div>
  )
})

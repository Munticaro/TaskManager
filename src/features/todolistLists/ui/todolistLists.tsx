import React, { useCallback, useEffect } from 'react'
import { AddItemForm } from 'common/components/AddItemForm/AddItemForm'
import { Grid, Paper } from '@mui/material'
import { Navigate } from 'react-router-dom'
import { selectTask } from 'features/todolistLists/model/task/selectTask'
import { selectIsLoggedIn } from 'features/auth/model/authSelectors'
import { useSelector } from 'react-redux'
import { AppDispatch } from 'app/store'
import { useAppDispatch } from 'common/hooks/useAppDispatch'
import { Todolist } from 'features/todolistLists/ui/todolist/todolist'
import {
  FilterValuesType,
  todolistsActions,
  todolistThunks,
} from 'features/todolistLists/model/todolist/todolistsSlice'
import { tasksThunks } from 'features/todolistLists/model/task/taskSlice'
import { selectTodolist } from 'features/todolistLists/model/todolist/selectorTodolist'
import { TaskStatuses } from 'common/enums'

type TodolistListsPT = {
  demo?: boolean
}

export const TodolistsList: React.FC<TodolistListsPT> = ({ demo = false }) => {
  const todolists = useSelector(selectTodolist)
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const tasks = useSelector(selectTask)

  const dispatch: AppDispatch = useAppDispatch()

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return
    }
    dispatch(todolistThunks.fetchTodolists())
  }, [])

  const removeTodolist = useCallback(
    (id: string) => {
      dispatch(todolistThunks.removeTodolist(id))
    },
    [dispatch],
  )
  const changeTodolistTitle = useCallback(
    (id: string, title: string) => {
      dispatch(todolistThunks.changeTodolistTitle({ id, title }))
    },
    [dispatch],
  )
  const addTodolist = useCallback((title: string) => {
    dispatch(todolistThunks.addTodolist(title))
  }, [])

  if (!isLoggedIn) {
    return <Navigate to={'/login'} />
  }
  return (
    <>
      <Grid container style={{ padding: '20px' }}>
        <AddItemForm addItem={addTodolist} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          let allTodolistTasks = tasks[tl.id]

          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: '10px' }}>
                <Todolist
                  todolist={tl}
                  tasks={allTodolistTasks}
                  removeTodolist={removeTodolist}
                  changeTodolistTitle={changeTodolistTitle}
                  demo={demo}
                />
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}

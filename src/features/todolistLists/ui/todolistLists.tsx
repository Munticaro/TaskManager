import React, { useCallback, useEffect } from 'react'
import { AddItemForm } from 'common/components/AddItemForm/AddItemForm'
import { Grid, Paper } from '@mui/material'
import { Navigate } from 'react-router-dom'
import { selectTask } from 'features/todolistLists/model/task/selectTask'
import { selectIsLoggedIn } from 'features/auth/model/authSelectors'
import { useSelector } from 'react-redux'
import { Todolist } from 'features/todolistLists/ui/todolist/todolist'
import { todolistThunks } from 'features/todolistLists/model/todolist/todolistsSlice'
import { selectTodolist } from 'features/todolistLists/model/todolist/selectorTodolist'
import { useActions } from 'common/hooks'

type Props = {
  demo?: boolean
}

export const TodolistsList = ({ demo = false }: Props) => {
  const todolists = useSelector(selectTodolist)
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const tasks = useSelector(selectTask)

  const {
    fetchTodolists,
    removeTodolist: removeTodolistThunk,
    changeTodolistTitle: changeTodolistTitleThunk,
    addTodolist: addTodolistThunk,
  } = useActions(todolistThunks)

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return
    }
    fetchTodolists()
  }, [])

  const removeTodolist = useCallback((id: string) => {
    removeTodolistThunk(id)
  }, [])
  const changeTodolistTitle = useCallback((id: string, title: string) => {
    changeTodolistTitleThunk({ id, title })
  }, [])
  const addTodolist = useCallback((title: string) => {
    return addTodolistThunk(title).unwrap()
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

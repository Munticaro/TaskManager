import { Button } from '@mui/material'
import {
  FilterValuesType,
  TodolistDomainType,
  todolistsActions,
} from 'features/todolistLists/model/todolist/todolistsSlice'
import { useAppDispatch } from 'common/hooks'
import { AppDispatch } from 'app/store'

type PropsType = {
  todolist: TodolistDomainType
}

export const FilterTasksButtons = ({ todolist }: PropsType) => {
  const dispatch: AppDispatch = useAppDispatch()
  const todoFilter = todolist.filter
  const filterTasksHandler = (filter: FilterValuesType) => {
    changeFilter(todolist.id, filter)
  }

  const changeFilter = (todolistId: string, value: FilterValuesType) => {
    dispatch(todolistsActions.changeTodolistFilter({ id: todolistId, filter: value }))
  }

  return (
    <>
      <Button
        variant={todoFilter === 'all' ? 'outlined' : 'text'}
        onClick={() => filterTasksHandler('all')}
        color={'inherit'}
      >
        All
      </Button>
      <Button
        variant={todoFilter === 'active' ? 'outlined' : 'text'}
        onClick={() => filterTasksHandler('active')}
        color={'error'}
      >
        Active
      </Button>
      <Button
        variant={todoFilter === 'completed' ? 'outlined' : 'text'}
        onClick={() => filterTasksHandler('completed')}
        color={'warning'}
      >
        Completed
      </Button>
    </>
  )
}

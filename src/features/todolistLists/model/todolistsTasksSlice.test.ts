import { tasksSlice, TasksStateType } from 'features/todolistLists/model/task/taskSlice'
import {
  TodolistDomainType,
  todolistsSlice,
  todolistThunks,
} from 'features/todolistLists/model/todolist/todolistsSlice'
import { TodolistType } from 'features/todolistLists/api/todolist/todolistApi.types'

test('ids should be equals', () => {
  const startTasksState: TasksStateType = {}
  const startTodolistsState: Array<TodolistDomainType> = []

  let todolist: TodolistType = {
    title: 'new todolist',
    id: 'any id',
    addedDate: '',
    order: 0,
  }

  const action = todolistThunks.addTodolist.fulfilled({ todolist: todolist }, 'requestId', todolist.title)

  const endTasksState = tasksSlice(startTasksState, action)
  const endTodolistsState = todolistsSlice(startTodolistsState, action)

  const keys = Object.keys(endTasksState)
  const idFromTasks = keys[0]
  const idFromTodolists = endTodolistsState[0].id

  expect(idFromTasks).toBe(action.payload.todolist.id)
  expect(idFromTodolists).toBe(action.payload.todolist.id)
})

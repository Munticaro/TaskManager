import { instance } from 'common/api'
import { TodolistType, UpdateTodolistTitleArgType } from 'features/todolistLists/api/todolist/todolistApi.types'
import { BaseResponseType } from 'common/types/baseResponseType'

export const todolistAPI = {
  getTodolists() {
    return instance.get<Array<TodolistType>>(`/todo-lists`)
  },
  createTodolist(title: string) {
    return instance.post<BaseResponseType<{ item: TodolistType }>>(`/todo-lists`, {
      title,
    })
  },
  deleteTodolist(id: string) {
    return instance.delete<BaseResponseType>(`/todo-lists/${id}`)
  },
  updateTodolist(arg: UpdateTodolistTitleArgType) {
    return instance.put<BaseResponseType>(`todo-lists/${arg.id}`, { title: arg.title })
  },
}

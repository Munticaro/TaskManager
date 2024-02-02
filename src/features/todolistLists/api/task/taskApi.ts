import { instance } from 'common/api'
import { BaseResponseType } from 'common/types'
import { AxiosResponse } from 'axios'
import { GetTasksResponse, TaskType, UpdateTaskType } from 'features/todolistLists/api/task/taskApi.types'
import { AddTaskArgsType } from 'features/todolistLists/model/task/taskSlice'

export const taskAPI = {
  getTask(todolistId: string) {
    return instance.get<GetTasksResponse>(`/todo-lists/${todolistId}/tasks`)
  },
  createTask(arg: AddTaskArgsType) {
    return instance.post<
      BaseResponseType<{
        item: TaskType
      }>
    >(`todo-lists/${arg.todolistId}/tasks`, { title: arg.title })
  },
  updateTask(todolistId: string, taskId: string, model: UpdateTaskType) {
    return instance.put<
      BaseResponseType<{ item: TaskType }>,
      AxiosResponse<BaseResponseType<{ item: TaskType }>>,
      UpdateTaskType
    >(`todo-lists/${todolistId}/tasks/${taskId}`, model)
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<BaseResponseType>(`/todo-lists/${todolistId}/tasks/${taskId}`)
  },
}

import { instance } from 'common/api'
import { AxiosResponse } from 'axios'
import { GetTasksResponse, TaskType, TodolistType, UpdateTaskType } from 'features/todolistLists/api/todolistApi.types'
import { BaseResponseType } from 'common/types/baseResponseType'

export const todolistAPI = {
    getTodolist() {
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
    updateTodolist(id: string, title: string) {
        return instance.put<BaseResponseType>(`/todo-lists/${id}`, title)
    },
    getTask(todolistId: string) {
        return instance.get<GetTasksResponse>(`/todo-lists/${todolistId}/tasks`)
    },
    createTask(todolistId: string, title: string) {
        return instance.post<
            BaseResponseType<{ item: TaskType }>,
            AxiosResponse<BaseResponseType<{ item: TaskType }>>,
            { title: string }
        >(`todo-lists/${todolistId}/tasks`, { title })
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

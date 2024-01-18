import axios, {AxiosResponse} from "axios";

const instance = axios.create(
    {
        withCredentials: true,
        baseURL: 'https://social-network.samuraijs.com/api/1.1'
    }
)
//api

export const todolistAPI = {
    getTodolist() {
        return instance.get<Array<TodolistType>>(`/todo-lists`)

    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{ item: TodolistType }>>(`/todo-lists`, {title})
    },
    deleteTodolist(id: string) {
        return instance.delete<ResponseType>(`/todo-lists/${id}`)
    },
    updateTodolist(id: string, title: string) {
        return instance.put<ResponseType>(`/todo-lists/${id}`, title)
    },
    getTask(taskId: string) {
        return instance.get<GetTasksResponse>(`/todo-lists/${taskId}/tasks`)
    },
    createTask(todolistId: string, title: string) {
        return instance.post<ResponseType<{ item: TaskType }>,
            AxiosResponse<ResponseType<{ item: TaskType }>>, { title: string }>
        (`todo-lists/${todolistId}/tasks`, {title});
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskType) {
        return instance.put<ResponseType<{ item: TaskType }>,
            AxiosResponse<ResponseType<{ item: TaskType }>>, UpdateTaskType>
        (`todo-lists/${todolistId}/tasks/${taskId}`, model);
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`/todo-lists/${todolistId}/tasks/${taskId}`)
    },
}

export const authAPI =  {
    login(params: LoginParamsType) {
        return instance.post<ResponseType<{userId?: number}>>('/auth/login', params)
    },
    me() {
        return instance.get<ResponseType<{id: number, email: string, login: string}>>('/auth/me')
    },
    logout() {
        return instance.delete<ResponseType<{userId?: number}>>('/auth/login')
    }
}

// types
export type LoginParamsType = {
    email: string
    password: string
    rememberMe: boolean
    captcha?: string
}
export type ResponseType<D = {}> = {
    resultCode: 0
    messages: Array<string>
    data: D
}
type GetTasksResponse = {
    error: string | null
    totalCont: number
    items: TaskType[]
}
export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}
export type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}
export type UpdateTaskType = {
    title: string
    description: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
}
export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}
export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}
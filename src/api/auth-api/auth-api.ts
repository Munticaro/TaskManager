import {instance, LoginParamsType, ResponseType} from "../todolist-api/todolists-api";

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
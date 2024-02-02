import { BaseResponseType } from 'common/types'
import { instance } from 'common/api'
import { LoginParamsType } from 'features/auth/api/authApi.types'

export const authApi = {
  login(params: LoginParamsType) {
    return instance.post<BaseResponseType<{ userId?: number }>>('/auth/login', params)
  },
  me() {
    return instance.get<BaseResponseType<{ id: number; email: string; login: string }>>('/auth/me')
  },
  logout() {
    return instance.delete<BaseResponseType<{ userId?: number }>>('/auth/login')
  },
}

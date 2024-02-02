import axios from 'axios'

export const instance = axios.create({
  baseURL: 'https://social-network.samuraijs.com/api/1.1',
  withCredentials: true,
  headers: {
    'API-KEY': 'e9d0fe8b-630e-4b42-ae1f-3617fc7ba0b9',
  },
})

import { appActions } from 'app/appSlice'
import { Dispatch } from 'redux'
import axios, { AxiosError } from 'axios'

/**
 * handleServerNetworkError - функция для обработки ошибок сети или сервера.
 * @param e - объект ошибки.
 * @param dispatch - функция диспетчера Redux для отправки действий.
 */

export const handleServerNetworkError = (e: unknown, dispatch: Dispatch) => {
  const err = e as Error | AxiosError<{ error: string }>
  if (axios.isAxiosError(err)) {
    const error = err.message ? err.message : 'Some error occurred'
    dispatch(appActions.setAppError({ error }))
  } else {
    dispatch(appActions.setAppError({ error: `Native error ${err.message}` }))
  }
}

import { appActions } from 'app/model/appSlice'
import { Dispatch } from 'redux'
import axios, { AxiosError } from 'axios'

/**
 * handleServerNetworkError - a function for handling network or server errors.
 * @param e - the error object.
 * @param dispatch - the Redux dispatcher function for dispatching actions.
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

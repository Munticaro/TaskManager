import { Dispatch } from 'redux'
import { appActions } from 'app/model/appSlice'
import { BaseResponseType } from 'common/types'

/**
 * Server error handler when interacting with API.
 *
 * @template D - The type of data expected from the server.
 * @param {BaseResponseType<D>} data - The response object from the server containing error data.
 * @param {Dispatch} dispatch - The dispatch function for updating the application state.
 * @param {boolean} showError - A flag indicating whether to display a global error message.
 */

export const handleServerAppError = <D>(
  data: BaseResponseType<D>,
  dispatch: Dispatch,
  showError: boolean = true,
): void => {
  if (showError) {
    dispatch(appActions.setAppError({ error: data.messages.length ? data.messages[0] : 'Some error occurred' }))
  }
}

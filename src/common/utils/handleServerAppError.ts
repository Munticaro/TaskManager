import { Dispatch } from 'redux'
import { appActions } from 'app/appSlice'
import { BaseResponseType } from 'common/types'

/**
 * Обработчик ошибок сервера при взаимодесйствии с API
 *
 * @template D - Тип данных ожидаемых от сервера
 * @param {BaseResponseType<D>} data - Обьект ответа от сервера, содержащий данные об ошибке
 * @param {Dispatch} dispatch - Функция диспатчиризации для обновления состояния приложения
 * @param {boolean} showError - Флаг указываюший, следует ли отображать глобальное сообщение об ошибке
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

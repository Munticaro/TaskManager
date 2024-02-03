import { AppDispatch, AppRootStateType } from 'app/store'
import { BaseThunkAPI } from '@reduxjs/toolkit/dist/createAsyncThunk'
import { BaseResponseType } from 'common/types'
import { handleServerNetworkError } from 'common/utils/handleServerNetworkError'

/**
 * thunkTryCatch - функция-обёртка над логикой выполнения асинхронных thunk-действий
 * с обработкой ошибок.
 * @template T - тип возвращаемого значения функции logic.
 * @param thunkAPI - объект `BaseThunkAPI`, предоставляющий доступ к методам диспетчера и
 * функции `rejectWithValue` для обработки ошибок в Redux-танках.
 * @param logic - асинхронная функция, содержащая основную логику выполнения thunk-действия.
 * @returns Промис, разрешающийся значением типа `T` в случае успешного выполнения
 * логики функции `logic`, либо возвращающий результат метода `rejectWithValue` из объекта
 * `thunkAPI` в случае возникновения ошибки.
 */

export const thunkTryCatch = async <T>(
  thunkAPI: BaseThunkAPI<AppRootStateType, unknown, AppDispatch, null | BaseResponseType>,
  logic: () => Promise<T>,
): Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>> => {
  const { dispatch, rejectWithValue } = thunkAPI
  try {
    return await logic()
  } catch (error) {
    handleServerNetworkError(error, dispatch)
    return rejectWithValue(null)
  }
}

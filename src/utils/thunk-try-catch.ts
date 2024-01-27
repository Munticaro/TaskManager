import { AppDispatch, AppRootStateType } from "../../../IT-INCUBATOR/it-incubator-todolist-ts-20/src/app/store";
import { handleServerNetworkError } from "../../../IT-INCUBATOR/it-incubator-todolist-ts-20/src/common/utils/handle-server-network-error";
import { BaseThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";

import { BaseResponseType } from "../../../IT-INCUBATOR/it-incubator-todolist-ts-20/src/common/types";
import {appActions} from "../store/slice/app-slice/app-slice";

export const thunkTryCatch = async <T>(
  thunkAPI: BaseThunkAPI<AppRootStateType, unknown, AppDispatch, null | BaseResponseType>,
  logic: () => Promise<T>,
): Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>> => {
  const { dispatch, rejectWithValue } = thunkAPI;
  dispatch(appActions.setAppStatus({ status: "loading" }));
  try {
    return await logic();
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  } finally {
    dispatch(appActions.setAppStatus({ status: "idle" }));
  }
};

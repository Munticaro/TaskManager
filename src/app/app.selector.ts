import {AppRootStateType} from "../../../IT-INCUBATOR/it-incubator-todolist-ts-20/src/app/store";

export const selectAppStatus = (state: AppRootStateType) => state.app.status
export const selectIsInitialized = (state: AppRootStateType) => state.app.isInitialized;
export const selectAppError = (state: AppRootStateType) => state.app.error
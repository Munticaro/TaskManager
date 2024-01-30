import {AppRootStateType} from "../../../../IT-INCUBATOR/it-incubator-todolist-ts-20/src/app/store";

export const selectIsLoggedIn = (state: AppRootStateType) => state.auth.isLoggedIn;
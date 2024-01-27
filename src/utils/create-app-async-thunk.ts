
import { createAsyncThunk } from "@reduxjs/toolkit";
import {AppDispatch, AppRootStateType} from "../store/store";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootStateType;
  dispatch: AppDispatch;
  rejectValue: null;
}>();

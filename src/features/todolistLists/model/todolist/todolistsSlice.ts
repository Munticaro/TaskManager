import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RequestStatusType } from 'app/appSlice'
import { clearTodolistsAndTasks } from 'common/actions/common.actions'
import { todolistAPI } from 'features/todolistLists/api/todolist/todolistApi'
import { TodolistType, UpdateTodolistTitleArgType } from 'features/todolistLists/api/todolist/todolistApi.types'
import { thunkTryCatch } from 'common/utils/thunkTryCatch'
import { createAppAsyncThunk, handleServerAppError } from 'common/utils'
import { ResultCode } from 'common/enums'

const fetchTodolist = createAppAsyncThunk<{ todolists: TodolistType[] }, void>(
  'todolist/fetchTodolist',
  async (_, thunkAPI) => {
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistAPI.getTodolists()
      return { todolists: res.data }
    })
  },
)

const removeTodolist = createAppAsyncThunk('todolist/removeTodolist', async (id: string, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  dispatch(todolistsActions.setTodolistEntityStatus({ id, status: 'loading' }))
  return thunkTryCatch(thunkAPI, async () => {
    const res = await todolistAPI.deleteTodolist(id)
    if (res.data.resultCode === ResultCode.Success) {
      return { id }
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue(null)
    }
  })
})

const addTodolist = createAppAsyncThunk('todolist/addTodolist', async (title: string, thunkAPI) => {
  return thunkTryCatch(thunkAPI, async () => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistAPI.createTodolist(title)
      if (res.data.resultCode === ResultCode.Success) {
        return { todolist: res.data.data.item }
      } else {
        handleServerAppError(res.data, dispatch, false)
        return rejectWithValue(res.data)
      }
    })
  })
})

const changeTodolistTitle = createAppAsyncThunk<UpdateTodolistTitleArgType, UpdateTodolistTitleArgType>(
  'todo/changeTodolistTitle',
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistAPI.updateTodolist(arg)
      if (res.data.resultCode === ResultCode.Success) {
        return arg
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    })
  },
)

const slice = createSlice({
  name: 'todolists',
  initialState: [] as TodolistDomainType[],
  reducers: {
    changeTodolistTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todolist = state.find((todo) => todo.id === action.payload.id)
      if (todolist) {
        todolist.title = action.payload.title
      }
    },
    changeTodolistFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
      const todolist = state.find((todo) => todo.id === action.payload.id)
      if (todolist) {
        todolist.filter = action.payload.filter
      }
    },
    setTodolistEntityStatus: (state, action: PayloadAction<{ id: string; status: RequestStatusType }>) => {
      const todolist = state.find((todo) => todo.id === action.payload.id)
      if (todolist) {
        todolist.entityStatus = action.payload.status
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodolist.fulfilled, (state, action) => {
        return action.payload.todolists.map((tl) => ({ ...tl, filter: 'all', entityStatus: 'idle' }))
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        const newTodo: TodolistDomainType = { ...action.payload.todolist, filter: 'all', entityStatus: 'idle' }
        state.unshift(newTodo)
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const index = state.findIndex((todo) => todo.id === action.payload.id)
        if (index !== -1) state.splice(index, 1)
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const todolist = state.find((todo) => todo.id === action.payload.id)
        if (todolist) {
          todolist.title = action.payload.title
        }
      })
      .addCase(clearTodolistsAndTasks.type, () => {
        return []
      })
  },
})

export const todolistsActions = slice.actions
export const todolistsSlice = slice.reducer
export const todolistThunks = { fetchTodolists: fetchTodolist, removeTodolist, addTodolist, changeTodolistTitle }

export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}

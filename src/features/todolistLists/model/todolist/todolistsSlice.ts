import { createSlice, isRejected, PayloadAction } from '@reduxjs/toolkit'
import { RequestStatusType } from 'app/model/appSlice'
import { clearTodolistsAndTasks } from 'common/actions/common.actions'
import { todolistAPI } from 'features/todolistLists/api/todolist/todolistApi'
import { TodolistType, UpdateTodolistTitleArgType } from 'features/todolistLists/api/todolist/todolistApi.types'
import { createAppAsyncThunk } from 'common/utils'
import { ResultCode } from 'common/enums'

const fetchTodolist = createAppAsyncThunk<{ todolists: TodolistType[] }, void>('todolist/fetchTodolist', async () => {
  const res = await todolistAPI.getTodolists()
  return { todolists: res.data }
})

const removeTodolist = createAppAsyncThunk('todolist/removeTodolist', async (id: string, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  dispatch(todolistsActions.setTodolistEntityStatus({ id, entityStatus: 'loading' }))
  const res = await todolistAPI.deleteTodolist(id)
  if (res.data.resultCode === ResultCode.Success) {
    return { id }
  } else {
    return rejectWithValue(res.data)
  }
})

const addTodolist = createAppAsyncThunk('todolist/addTodolist', async (title: string, thunkAPI) => {
  const { rejectWithValue } = thunkAPI
  const res = await todolistAPI.createTodolist(title)
  if (res.data.resultCode === ResultCode.Success) {
    return { todolist: res.data.data.item }
  } else {
    return rejectWithValue(res.data)
  }
})

const changeTodolistTitle = createAppAsyncThunk<UpdateTodolistTitleArgType, UpdateTodolistTitleArgType>(
  'todo/changeTodolistTitle',
  async (arg, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    const res = await todolistAPI.updateTodolist(arg)
    if (res.data.resultCode === ResultCode.Success) {
      return arg
    } else {
      return rejectWithValue(res.data)
    }
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
    setTodolistEntityStatus: (state, action: PayloadAction<{ id: string; entityStatus: RequestStatusType }>) => {
      const todolist = state.find((todo) => todo.id === action.payload.id)
      if (todolist) {
        todolist.entityStatus = action.payload.entityStatus
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
      .addMatcher(isRejected(todolistThunks.removeTodolist), (state) => {
        return state.map((tl) => {
          return { ...tl, entityStatus: 'idle' }
        })
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

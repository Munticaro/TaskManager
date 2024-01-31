import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { appActions, RequestStatusType } from 'app/appSlice'
import { handleServerNetworkError } from 'common/utils/handleServerNetworkError'
import { clearTodolistsAndTasks } from 'common/actions/common.actions'
import { todolistAPI } from 'features/todolistLists/api/todolistApi'
import { TodolistType } from 'features/todolistLists/api/todolistApi.types'

const fetchTodolist = createAsyncThunk('todolist/fetchTodolist', async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    const res = await todolistAPI.getTodolist()
    try {
        dispatch(appActions.setAppStatus({ status: 'succeeded' }))
        return { todolists: res.data }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})

const removeTodolist = createAsyncThunk('todolist/removeTodolist', async (id: string, thunkAPI) => {
    const { dispatch } = thunkAPI
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    dispatch(todolistsActions.setTodolistEntityStatus({ id, status: 'loading' }))
    await todolistAPI.deleteTodolist(id)
    dispatch(appActions.setAppStatus({ status: 'succeeded' }))
    return { id }
})

const addTodolist = createAsyncThunk('todolist/addTodolist', async (title: string, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    const res = await todolistAPI.createTodolist(title)
    try {
        dispatch(appActions.setAppStatus({ status: 'succeeded' }))
        return { todolist: res.data.data.item }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})

const changeTodolistTitle = createAsyncThunk(
    'todolist/changeTodolist',
    async (param: { id: string; title: string }, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        dispatch(appActions.setAppStatus({ status: 'loading' }))
        await todolistAPI.updateTodolist(param.id, param.title)
        try {
            dispatch(appActions.setAppStatus({ status: 'succeeded' }))
            return { id: param.id, title: param.title }
        } catch (error) {
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(null)
        }
    },
)

export const slice = createSlice({
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

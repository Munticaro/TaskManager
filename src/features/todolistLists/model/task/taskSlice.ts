import { createAppAsyncThunk } from 'common/utils/createAppAsyncThunk'
import { appActions } from 'app/appSlice'
import { handleServerNetworkError } from 'common/utils/handleServerNetworkError'
import { handleServerAppError } from 'common/utils/handleServerAppError'
import { AppRootStateType } from 'app/store'
import { createSlice } from '@reduxjs/toolkit'
import { todolistThunks } from 'features/todolistLists/model/todolist/todolistsSlice'
import { clearTodolistsAndTasks } from 'common/actions/common.actions'
import { ResultCode, TaskPriorities, TaskStatuses } from 'common/enums'
import { todolistAPI } from 'features/todolistLists/api/todolistApi'
import { TaskType, UpdateTaskType } from 'features/todolistLists/api/todolistApi.types'

const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
    'tasks/fetchTask',
    async (todolistId, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        try {
            dispatch(appActions.setAppStatus({ status: 'loading' }))
            const res = await todolistAPI.getTask(todolistId)
            dispatch(appActions.setAppStatus({ status: 'succeeded' }))
            return { tasks: res.data.items, todolistId }
        } catch (error) {
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(null)
        }
    },
)

const removeTask = createAppAsyncThunk<RemoveTaskArgType, RemoveTaskArgType>(
    'tasks/removeTask',
    async (arg, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        try {
            dispatch(appActions.setAppStatus({ status: 'loading' }))
            await todolistAPI.deleteTask(arg.todolistId, arg.taskId)
            dispatch(appActions.setAppStatus({ status: 'succeeded' }))
            return { taskId: arg.taskId, todolistId: arg.todolistId }
        } catch (error) {
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(null)
        }
    },
)

const addTask = createAppAsyncThunk<{ task: TaskType }, AddTaskArgsType>('tasks/addTask', async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
        const res = await todolistAPI.createTask(arg.title, arg.todolistId)
        if (res.data.resultCode === ResultCode.Success) {
            const task = res.data.data.item
            dispatch(appActions.setAppStatus({ status: 'succeeded' }))
            return { task }
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})

const updateTask = createAppAsyncThunk<UpdateTasksArgsType, UpdateTasksArgsType>(
    'tasks/updateTask',
    async (arg, thunkAPI) => {
        const { dispatch, rejectWithValue, getState } = thunkAPI
        try {
            const state = getState() as AppRootStateType
            const task = state.tasks[arg.todoListId].find((t) => t.id === arg.taskId)
            if (!task) {
                dispatch(appActions.setAppError({ error: 'task not found in the state' }))
                return rejectWithValue(null)
            }
            const apiModel: UpdateTaskType = {
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline,
                ...arg.domainModel,
            }
            const res = await todolistAPI.updateTask(arg.todoListId, arg.taskId, apiModel)

            if (res.data.resultCode === ResultCode.Success) {
                dispatch(appActions.setAppStatus({ status: 'succeeded' }))
                return arg
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (error) {
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(null)
        }
    },
)
export const slice = createSlice({
    name: 'tasks',
    initialState: {} as TasksStateType,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks
            })
            .addCase(removeTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex((t) => t.id === action.payload.taskId)
                if (index !== -1) tasks.splice(index, 1)
            })
            .addCase(todolistThunks.addTodolist.fulfilled, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const taskForTodolist = state[action.payload.todoListId]
                const index = taskForTodolist.findIndex((task) => task.id === action.payload.taskId)
                if (index !== -1) {
                    taskForTodolist[index] = { ...taskForTodolist[index], ...action.payload.domainModel }
                }
            })
            .addCase(todolistThunks.removeTodolist.fulfilled, (state, action) => {
                delete state[action.payload.id]
            })
            .addCase(todolistThunks.fetchTodolists.fulfilled, (state, action) => {
                action.payload.todolists.forEach((tl) => {
                    state[tl.id] = []
                })
            })
            .addCase(clearTodolistsAndTasks.type, () => {
                return {}
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state[action.payload.task.todoListId].unshift(action.payload.task)
            })
    },
})

export const tasksSlice = slice.reducer
export const tasksThunks = { fetchTasks, removeTask, addTask, updateTask }

export type TasksStateType = {
    [key: string]: TaskType[]
}

export type UpdateDomainTaskType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

type RemoveTaskArgType = {
    todolistId: string
    taskId: string
}

type AddTaskArgsType = {
    title: string
    todolistId: string
}

type UpdateTasksArgsType = {
    taskId: string
    todoListId: string
    domainModel: UpdateDomainTaskType
}

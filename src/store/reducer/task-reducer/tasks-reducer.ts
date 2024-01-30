import {
    TaskPriorities,
    TaskStatuses,
    TaskType,
    todolistAPI,
    UpdateTaskType
} from "../../../api/todolist-api/todolists-api";
import {AppRootStateType} from "../../store";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error-utils";
import {appActions} from "../app-reducer/app-reducer";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {todolistsActions, todolistThunks} from "../todolists-reducer/todolists-reducer";
import {clearTodolistsAndTasks} from "../../../common/actions/common.actions";

const fetchTasks = createAsyncThunk('tasks/fetchTask', async (todolistId: string, thunkAPI) => {
    const {dispatch} = thunkAPI
    dispatch(appActions.setAppStatus({status: 'loading'}))
    const res = await todolistAPI.getTask(todolistId)
    dispatch(appActions.setAppStatus({status: "succeeded"}))
    return {tasks: res.data.items, todolistId}
})

const removeTask = createAsyncThunk('tasks/removeTask', async (param: {
    taskId: string,
    todolistId: string
}, thunkAPI) => {
    const {dispatch} = thunkAPI
    dispatch(appActions.setAppStatus({status: 'loading'}))
    await todolistAPI.deleteTask(param.todolistId, param.taskId)
    dispatch(appActions.setAppStatus({status: "succeeded"}))
    return {taskId: param.taskId, todolistId: param.todolistId}
})

const addTask = createAsyncThunk('tasks/addTask', async (param: {
    title: string,
    todolistId: string
}, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    const res = await todolistAPI.createTask(param.title, param.todolistId)
    try {
        if (res.data.resultCode === 0) {
            const task = res.data.data.item
            dispatch(appActions.setAppStatus({status: "succeeded"}))
            return { task }
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    }
    catch (error) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }

})

const updateTask = createAsyncThunk('tasks/updateTask', async (param: {
    taskId: string,
    todoListId: string,
    domainModel: UpdateDomainTaskType
}, thunkAPI) => {
    const {dispatch, rejectWithValue, getState} = thunkAPI
    const state = getState() as AppRootStateType
    const task = state.tasks[param.todoListId].find(t => t.id === param.taskId)
    if (!task) {
        dispatch(appActions.setAppError({ error: "Task not found in the state" }));
        return rejectWithValue(null);
    }
    const apiModel: UpdateTaskType = {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
        ...param.domainModel
    }

    const res = await todolistAPI.updateTask(param.todoListId, param.taskId, apiModel)
    try {
        if (res.data.resultCode === 0) {
            dispatch(appActions.setAppStatus({status: "succeeded"}))
            return param
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    }
    catch (error) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }

})


export const slice = createSlice({
    name: 'tasks',
    initialState: {} as TasksStateType,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(removeTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId];
                const index = tasks.findIndex((t) => t.id === action.payload.taskId);
                if (index !== -1) tasks.splice(index, 1);
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks
            })
            .addCase(todolistThunks.addTodolist.fulfilled, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const taskForTodolist = state[action.payload.todoListId]
                const index = taskForTodolist.findIndex((task) => task.id === action.payload.taskId)
                if (index !== -1) {
                    taskForTodolist[index] = {...taskForTodolist[index], ...action.payload.domainModel}
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
    }
})


export const tasksActions = slice.actions
export const tasksReducer = slice.reducer
export const tasksThunks = {fetchTasks, removeTask, addTask, updateTask};

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

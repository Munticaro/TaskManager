import {
    TaskPriorities,
    TaskStatuses,
    TaskType,
    todolistAPI,
    UpdateTaskType
} from "../../../api/todolist-api/todolists-api";
import {Dispatch} from "redux";
import {AppRootStateType, AppThunk} from "../../store";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error-utils";
import {appActions} from "../app-slice/app-slice";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {todolistsActions} from "../todolists-slice/todolists-slice";
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

const initialState: TasksStateType = {};

export const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        addTask: (state, action: PayloadAction<{ task: TaskType }>) => {
            const taskForTodolist = state[action.payload.task.todoListId]
            taskForTodolist.unshift(action.payload.task)

        },
        updateTask: (state, action: PayloadAction<{
            taskId: string,
            model: UpdateDomainTaskType,
            todoListId: string
        }>) => {
            const taskForTodolist = state[action.payload.todoListId]
            const index = taskForTodolist.findIndex((task) => task.id === action.payload.taskId)
            if (index !== -1) {
                taskForTodolist[index] = {...taskForTodolist[index], ...action.payload.model}
            }

        },
    },
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
            .addCase(todolistsActions.addTodolist, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(todolistsActions.removeTodolist, (state, action) => {
                delete state[action.payload.id]
            })
            .addCase(todolistsActions.setTodolists, (state, action) => {
                action.payload.todolists.forEach((tl) => {
                    state[tl.id] = []
                })
            })
            .addCase(clearTodolistsAndTasks.type, () => {
                return {}
            })
    }
})


export const tasksActions = slice.actions
export const tasksSlice = slice.reducer
export const tasksThunks = {fetchTasks, removeTask};

// Thunks

export const addTaskTC = (todoListId: string, title: string): AppThunk => (dispatch: Dispatch) => {
    dispatch(appActions.setAppStatus({status: 'loading'}))
    todolistAPI.createTask(todoListId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                const task = res.data.data.item
                const action = tasksActions.addTask({task})
                dispatch(action)
                dispatch(appActions.setAppStatus({status: "succeeded"}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}

export const updateTaskTC =
    (taskId: string, todoListId: string, domainModel: UpdateDomainTaskType): AppThunk =>
        (dispatch: Dispatch, getState: () => AppRootStateType) => {
            const state = getState()
            const task = state.tasks[todoListId].find(t => t.id === taskId)
            if (!task) {
                // throw new Error ('task not found in the state')
                console.warn('task not found in the state')
                return
            }
            const apiModel: UpdateTaskType = {
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline,
                ...domainModel
            }
            todolistAPI.updateTask(todoListId, taskId, apiModel)
                .then(res => {
                    if (res.data.resultCode === 0) {
                        const action = tasksActions.updateTask({taskId, model: domainModel, todoListId})
                        dispatch(action)
                    } else {
                        handleServerAppError(res.data, dispatch)
                    }
                })
                .catch((error) => {
                    handleServerNetworkError(error, dispatch)
                })
        }

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

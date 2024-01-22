import {TaskPriorities, TaskStatuses, TaskType, todolistAPI, UpdateTaskType} from "../../../api/todolists-api";
import {Dispatch} from "redux";
import {AppRootStateType, AppThunk} from "../../../app/store";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error-utils";
import {appActions} from "../../../app/app-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {todolistsActions} from "./todolists-reducer";

export const slice = createSlice({
    name: 'tasks',
    initialState: {} as TasksStateType,
    reducers: {
        addTask: (state, action: PayloadAction<{task: TaskType}>) => {
            const taskForTodolist = state[action.payload.task.todoListId]
            taskForTodolist.unshift(action.payload.task)

        },
        removeTask: (state, action: PayloadAction<{taskId: string, todolistId: string}>) => {
            state.todolistId.filter(t => t.id !== action.payload.taskId)
        },
        updateTask: (state, action: PayloadAction<{taskId: string, model: UpdateDomainTaskType, todoListId: string}>) => {
            const taskForTodolist = state[action.payload.todoListId]
            const index = taskForTodolist.findIndex((task) => task.id === action.payload.taskId)
            if (index !== -1) {
                taskForTodolist[index] = { ...taskForTodolist[index], ...action.payload.model}
            }

        },
        setTasks: (state, action: PayloadAction<{todolistId: string, tasks: TaskType[]}>) => {
            state[action.payload.todolistId] = action.payload.tasks
        },
    },
    extraReducers: (builder) => {
        builder.addCase(todolistsActions.addTodolist, (state, action) => {
            state[action.payload.todolist.id] = []
        })
        builder.addCase(todolistsActions.removeTodolist, (state, action) => {
            delete state[action.payload.id]
        })
        builder.addCase(todolistsActions.setTodolists, (state, action) => {
             action.payload.todolists.forEach((tl) => {
                state[tl.id] = []
            })
        })
    }
})


export const tasksActions = slice.actions
export const tasksReducer = slice.reducer

// Thunks
export const getTasksTC = (todolistId: string): AppThunk => (dispatch: Dispatch) => {
    dispatch(appActions.setAppStatus({status: 'loading'}))
    todolistAPI.getTask(todolistId)
        .then((res) => {
            dispatch(tasksActions.setTasks({todolistId, tasks: res.data.items}))
            dispatch(appActions.setAppStatus({ status: "succeeded" }))
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}

export const removeTaskTC = (taskId: string, todolistId: string): AppThunk => (dispatch: Dispatch) => {
    dispatch(appActions.setAppStatus({status: 'loading'}))
    todolistAPI.deleteTask(todolistId, taskId)
        .then(res => {
            dispatch(tasksActions.removeTask({taskId, todolistId}))
            dispatch(appActions.setAppStatus({ status: "succeeded" }))
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}

export const addTaskTC = (todoListId: string, title: string): AppThunk => (dispatch: Dispatch) => {
    dispatch(appActions.setAppStatus({status: 'loading'}))
    todolistAPI.createTask(todoListId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                const task = res.data.data.item
                const action = tasksActions.addTask({task})
                dispatch(action)
                dispatch(appActions.setAppStatus({ status: "succeeded" }))
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

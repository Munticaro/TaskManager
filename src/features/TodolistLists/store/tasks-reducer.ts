import {TaskPriorities, TaskStatuses, TaskType, todolistAPI, UpdateTaskType} from "../../../api/todolists-api";
import {TasksStateType} from "../../../app/App";
import {Dispatch} from "redux";
import {AppRootStateType, AppThunk} from "../../../app/store";

import {handleServerAppError, handleServerNetworkError} from "../../../utils/error-utils";
import {appActions} from "../../../app/app-reducer";

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsTypes): TasksStateType => {
    switch (action.type) {
        case "REMOVE-TASK": {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)
            }
        }
        case "ADD-TASK": {
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
        }
        case "UPDATE-TASK": {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId
                    ? {...t, ...action.model} : t)
            };
        }
        case "ADD-TODOLIST":
            return {...state, [action.todolist.id]: []}
        case "REMOVE-TODOLIST":
            const stateCopy = {...state}
            delete stateCopy[action.id]
            return stateCopy
        case "SET-TODOLISTS": {
            const copyState = {...state}
            action.todolists.forEach((tl) => {
                copyState[tl.id] = []
            })
            return copyState
        }
        case "SET-TASKS":
            return {...state, [action.todolistId]: action.tasks}
        default:
            return state
    }
}

// actions
export const addTaskAC = (task: TaskType) =>
    ({type: 'ADD-TASK',task} as const)
export const removeTaskAC = (taskId: string, todolistId: string) =>
    ({type: 'REMOVE-TASK', todolistId, taskId} as const)
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskType, todolistId: string) => {
    return ({type: 'UPDATE-TASK', taskId, model, todolistId} as const)
}
export const setTasksAC = (todolistId: string, tasks: TaskType[]) => {
    return ({type: "SET-TASKS", todolistId, tasks} as const)
}

// Thunks
export const getTasksTC = (todolistId: string): AppThunk => (dispatch: Dispatch) => {
    dispatch(appActions.setAppStatus({status: 'loading'}))
    todolistAPI.getTask(todolistId)
        .then((res) => {
            dispatch(setTasksAC(todolistId, res.data.items))
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
            dispatch(removeTaskAC(taskId, todolistId))
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
                const action = addTaskAC(task)
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
                        const action = updateTaskAC(taskId, domainModel, todoListId)
                        dispatch(action)
                    } else {
                        handleServerAppError(res.data, dispatch)
                    }
                })
                .catch((error) => {
                    handleServerNetworkError(error, dispatch)
                })
        }

//Types

type ActionsTypes =
    | AddTodolistAT
    | SetTodolistsAT
    | RemoveTodolistAT
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof setTasksAC>
    | ReturnType<typeof updateTaskAC>
    | ReturnType<typeof removeTaskAC>

export type UpdateDomainTaskType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}


// ------------------------Заготовка для ActionType---------------------------
// export type Action1Type = {
//     type: '1'
//     id: string
// }
//
// export type Action2Type = {
//     type: '2'
//     title: string
// }
//
// type ActionsTypes = Action1Type | Action2Type
// export const taskReducer = (state: TasksStateType, action: ActionsTypes): TasksStateType => {
//     switch (action.type) {
//         case "1": {
//             return {...state}
//         }
//         case "2": {
//             return {...state}
//         }
//
//         default:
//             throw new Error("I don't understand this type")
//     }
// }
//
// export const action1AC = (todolistId: string): Action1Type => {
//     return { type: '1', id: todolistId}
// }
//
// export const action2AC = (title: string): Action2Type => {
//     return { type: '2', title: title}
// }

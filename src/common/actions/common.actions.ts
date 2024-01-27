import {createAction} from "@reduxjs/toolkit";
import {TasksStateType} from "../../store/slice/task-slice/tasks-slice";
import {TodolistDomainType} from "../../store/slice/todolists-slice/todolists-slice";


export type clearTodolistsAndTasksType = {
    tasks: TasksStateType,
    todolists: TodolistDomainType[]
}

export const clearTodolistsAndTasks = createAction('common/clear-tasks-todolists',
    (tasks: TasksStateType, todolists: TodolistDomainType[]) => {
    return {
        payload: {
            tasks,
            todolists
        }
    }

})
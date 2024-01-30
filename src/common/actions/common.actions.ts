import {createAction} from "@reduxjs/toolkit";
import {TasksStateType} from "../../store/reducer/task-reducer/tasks-reducer";
import {TodolistDomainType} from "../../store/reducer/todolists-reducer/todolists-reducer";


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
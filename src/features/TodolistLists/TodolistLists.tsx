import {
    addTodolistTC,
    changeTodolistTitleTC,
    FilterValuesType,
    getTodolistTC, removeTodolistTC,
    TodolistDomainType, todolistsActions
} from "../../store/slice/todolists-slice/todolists-slice";
import React, {useCallback, useEffect} from "react";
import {useSelector} from "react-redux";
import {AppDispatch, AppRootStateType, useAppDispatch, useAppSelector} from "../../store/store";
import {
    TasksStateType,
    tasksThunks,
    updateTask
} from "../../store/slice/task-slice/tasks-slice";
import {TaskStatuses} from "../../api/todolist-api/todolists-api";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {Todolist} from "./Todolist/Todolist";
import {Grid, Paper} from "@mui/material";
import {Navigate} from "react-router-dom";

type TodolistListsPT = {
    demo?: boolean
}

export const TodolistsList: React.FC<TodolistListsPT> = ({demo = false}) => {
    const todolists =
        useSelector<AppRootStateType, TodolistDomainType[]>
        (state => state.todolists)
    const tasks =
        useSelector<AppRootStateType, TasksStateType>
        (state => state.tasks)

    const isLoggedIn =
        useAppSelector(state => state.auth.isLoggedIn)


    const dispatch: AppDispatch = useAppDispatch()

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return
        }
        const thunk = getTodolistTC()
        dispatch(thunk)
    }, [])

    const removeTask = useCallback((taskId: string, todolistId: string) => {
        dispatch(tasksThunks.removeTask({taskId, todolistId}))
    }, [])

    const addTask = useCallback((todolistId: string, title: string) => {
        dispatch(tasksThunks.addTask({title, todolistId}))
    }, [])
    const changeStatus = useCallback((taskId: string, status: TaskStatuses, todolistId: string) => {
        const thunk = updateTask(taskId, todolistId,{status} )
        dispatch(thunk) // Checked
    }, [])
    const changeTaskTitle = useCallback((taskId: string, todolistId: string, newTitle: string) => {
        const thunk = updateTask(taskId, todolistId, {title: newTitle} )
        dispatch(thunk)
    }, [dispatch])
    const changeFilter = useCallback((todolistId: string, value: FilterValuesType) => {
        dispatch(todolistsActions.changeTodolistFilter({id: todolistId, filter: value}))
    }, [dispatch])
    const removeTodolist = useCallback((todolistId: string) => {
        let thunk = removeTodolistTC(todolistId)
        dispatch(thunk)
    }, [dispatch])
    const changeTodolistTitle = useCallback((todolistId: string, newTitle: string) => {
        dispatch(changeTodolistTitleTC(todolistId, newTitle))
    }, [dispatch])
    const addTodolist = useCallback((title: string) => {
        const thunk = addTodolistTC(title);
        dispatch(thunk)
    }, [])

    if (!isLoggedIn) {
        return <Navigate to={"/login"} />
    }
    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id]

                    return <Grid item key={tl.id}>
                        <Paper style={{padding: '10px'}}>
                            <Todolist
                                todolist={tl}
                                tasks={allTodolistTasks}
                                removeTask={removeTask}
                                changeFilter={changeFilter}
                                addTask={addTask}
                                changeTaskStatus={changeStatus}
                                removeTodolist={removeTodolist}
                                changeTaskTitle={changeTaskTitle}
                                changeTodolistTitle={changeTodolistTitle}
                                demo={demo}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}

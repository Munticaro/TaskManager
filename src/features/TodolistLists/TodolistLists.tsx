import {
    FilterValuesType,
    todolistsActions,
    todolistThunks
} from "../../store/reducer/todolists-reducer/todolists-reducer";
import React, {useCallback, useEffect} from "react";
import {AppDispatch, useAppDispatch} from "../../store/store";
import {tasksThunks,} from "../../store/reducer/task-reducer/tasks-reducer";
import {TaskStatuses} from "../../api/todolist-api/todolists-api";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {Todolist} from "./Todolist/Todolist";
import {Grid, Paper} from "@mui/material";
import {Navigate} from "react-router-dom";
import {selectTodolist} from "./todolist.selector";
import {selectTask} from "./Todolist/Task/selectTask";
import {selectIsLoggedIn} from "../Login/auth.selectors";
import {useSelector} from "react-redux";

type TodolistListsPT = {
    demo?: boolean
}

export const TodolistsList: React.FC<TodolistListsPT> = ({demo = false}) => {
    const todolists = useSelector(selectTodolist)
    const tasks = useSelector(selectTask)
    const isLoggedIn = useSelector(selectIsLoggedIn)

    const dispatch: AppDispatch = useAppDispatch()


    useEffect(() => {
        if (demo || !isLoggedIn) {
            return
        }
        dispatch(todolistThunks.fetchTodolists());
    }, [])

    const removeTask = useCallback((taskId: string, todolistId: string) => {
        dispatch(tasksThunks.removeTask({taskId, todolistId}))
    }, [])

    const addTask = useCallback((todolistId: string, title: string) => {
        dispatch(tasksThunks.addTask({title, todolistId}))
    }, [])
    const changeStatus = useCallback((taskId: string, status: TaskStatuses, todoListId: string) => {
        const thunk = tasksThunks.updateTask({taskId, todoListId, domainModel: {status}} )
        dispatch(thunk) // Checked
    }, [])
    const changeTaskTitle = useCallback((taskId: string, todoListId: string, newTitle: string) => {
        const thunk = tasksThunks.updateTask({taskId, todoListId, domainModel: {title: newTitle}} )
        dispatch(thunk)
    }, [dispatch])
    const changeFilter = useCallback((todolistId: string, value: FilterValuesType) => {
        dispatch(todolistsActions.changeTodolistFilter({id: todolistId, filter: value}))
    }, [dispatch])
    const removeTodolist = useCallback((id: string) => {
        dispatch(todolistThunks.removeTodolist(id));
    }, [dispatch])
    const changeTodolistTitle = useCallback((id: string, title: string) => {
        dispatch(todolistThunks.changeTodolistTitle({id, title}))
    }, [dispatch])
    const addTodolist = useCallback((title: string) => {
        dispatch(todolistThunks.addTodolist(title));
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

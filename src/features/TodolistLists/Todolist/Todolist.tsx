import React, {useCallback, useEffect} from "react";
import {AddItemForm} from "../../../components/AddItemForm/AddItemForm";
import {EditableSpan} from "../../../components/EditableSpan/EditableSpan";
import {Task} from "./Task/Task";
import {TaskStatuses, TaskType} from "../../../api/todolists-api";
import {FilterValuesType, TodolistDomainType} from "../store/todolists-reducer";
import {AppDispatchType, useAppDispatch} from "../../../app/store";
import {getTasksTC} from "../store/tasks-reducer";
import {Button, IconButton} from "@mui/material";
import {PlaylistRemove} from "@mui/icons-material";

type PropsType = {
    todolist: TodolistDomainType
    tasks: TaskType[]
    removeTask: (taskId: string, todolistId: string) => void
    changeFilter: (todolistId: string, value: FilterValuesType) => void
    addTask: (todolistId: string, title: string,) => void
    changeTaskStatus: (taskId: string, status: TaskStatuses, todolistId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    removeTodolist: (todolistId: string) => void
    changeTodolistTitle: (todolistId: string, newTitle: string) => void
    demo?: boolean
}

export const Todolist: React.FC<PropsType> = React.memo(function ({demo = false, ...props}) {
    const todoId = props.todolist.id
    const todoFilter = props.todolist.filter
    const todoTitle = props.todolist.title
    const onAllClickHandler = useCallback(() => props.changeFilter(todoId, "all"), [props.changeFilter, todoId])
    const onCompletedClickHandler = useCallback(() => props.changeFilter(todoId, "completed"), [props.changeFilter, todoId])
    const onActiveClickHandler = useCallback(() => props.changeFilter(todoId, "active"), [props.changeFilter, todoId])

    const dispatch: AppDispatchType = useAppDispatch()

    useEffect(() => {
        if (demo) {
            return
        }
        dispatch(getTasksTC(todoId))
    }, []);
    const removeTodolist = () => {
        props.removeTodolist(todoId)
    }
    const changeTodolistTitle = useCallback((newTitle: string) => {
        props.changeTodolistTitle(todoId, newTitle)
    }, [todoId, props.changeTodolistTitle])

    const addTask = useCallback((title: string) => {
        props.addTask(title, todoId)
    }, [props.addTask, todoId])

    let tasksForTodolist = props.tasks

    if (todoFilter === "completed") {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed); /// isDone === true
    }
    if (todoFilter === "active") {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New); /// isDone === false
    }

    const buttonFormDisabler = props.todolist.entityStatus === 'loading'

    return (
        <div className="App">
            <div>
                <h3>
                    <EditableSpan title={todoTitle} onChange={changeTodolistTitle}/>
                    <IconButton onClick={removeTodolist} disabled={buttonFormDisabler}>
                        <PlaylistRemove/>
                    </IconButton>

                </h3>
                <AddItemForm addItem={addTask} disabled={buttonFormDisabler}/>
                <div>
                    {tasksForTodolist.map(t => <Task
                        task={t}
                        key={t.id}
                        todolistId={todoId}
                        changeTaskTitle={props.changeTaskTitle}
                        changeTaskStatus={props.changeTaskStatus}
                        removeTask={props.removeTask}

                    />)
                    }
                </div>
                <div>
                    <Button variant={todoFilter === 'all' ? 'outlined' : 'text'}
                            onClick={onAllClickHandler}
                            color={'inherit'}>
                        All
                    </Button>
                    <Button variant={todoFilter === 'active' ? 'outlined' : 'text'}
                            onClick={onActiveClickHandler}
                            color={'error'}
                    >
                        Active
                    </Button>
                    <Button variant={todoFilter === 'completed' ? 'outlined' : 'text'}
                            onClick={onCompletedClickHandler}
                            color={"warning"}>
                        Completed
                    </Button>
                </div>
            </div>
        </div>
    );
})


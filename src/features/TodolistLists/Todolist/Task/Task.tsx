import React, {ChangeEvent, useCallback} from "react";
import {EditableSpan} from "../../../../components/EditableSpan/EditableSpan";
import {TaskStatuses, TaskType} from "../../../../api/todolist-api/todolists-api";
import {Checkbox, IconButton} from "@mui/material";
import {RemoveCircleOutline} from "@mui/icons-material";


type TaskPT = {
    changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    removeTask: (taskId: string, todolistId: string) => void
    task: TaskType
    todolistId: string
}
export const Task = React.memo((props: TaskPT) => {
    const onRemoveHandler = () => props.removeTask(props.task.id, props.todolistId)
    const onChangeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked
        props.changeTaskStatus(props.task.id, newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New, props.todolistId);
    }
    const onChangeTitleHandler = useCallback((newValue: string) => {
        props.changeTaskTitle(props.task.id, props.todolistId, newValue);
    }, [props.changeTaskTitle, props.task.id, props.todolistId])
    return (
        <div key={props.task.id} className={props.task.status === TaskStatuses.Completed ? "is-done" : ""}>
            <Checkbox
                onChange={onChangeStatusHandler}
                checked={props.task.status === TaskStatuses.Completed}
                color={'success'}
            />
            <EditableSpan
                title={props.task.title}
                onChange={onChangeTitleHandler}/>
            <IconButton onClick={onRemoveHandler}>
                <RemoveCircleOutline
                />
            </IconButton>
        </div>
    )
})
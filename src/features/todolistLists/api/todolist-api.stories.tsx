import React, { useEffect, useState } from 'react'
import { todolistAPI } from 'features/todolistLists/api/todolistApi'

export default {
    title: 'API',
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistAPI.getTodolist().then((res) => {
            setState(res.data)
        })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    const [createTodolist, setCreateTodolist] = useState<string>('')
    const onClickCreateTodolist = () => {
        todolistAPI.createTodolist('Exile job').then((res) => {
            setState(res.data)
        })
    }

    return (
        <div>
            {JSON.stringify(state)}
            <div>
                <input placeholder={'createTodolist'} />
                <button
                    onClick={onClickCreateTodolist}
                    value={createTodolist}
                    onChange={(e) => setCreateTodolist(e.currentTarget.value)}
                >
                    CREATE TODOLIST
                </button>
            </div>
        </div>
    )
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)

    const [todolistId, setTodolistId] = useState<string>('')

    const onClickDeleteTodolist = () => {
        todolistAPI.deleteTodolist(todolistId).then((res) => {
            setState(res.data)
        })
    }

    return (
        <div>
            {JSON.stringify(state)}
            <div>
                <input
                    placeholder={'todolistId'}
                    value={todolistId}
                    onChange={(e) => setTodolistId(e.currentTarget.value)}
                />
                <button onClick={onClickDeleteTodolist}>DELETE TODOLIST</button>
            </div>
        </div>
    )
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    const [title, setTitle] = useState<string>('')
    const [todolistId, setTodolistId] = useState<string>('')
    const onClickUpdateTodolistTitle = () => {
        todolistAPI.updateTodolist(todolistId, title).then((res) => {
            setState(res.data)
        })
    }

    return (
        <div>
            {JSON.stringify(state)}
            <div>
                <input
                    placeholder={'todolistId'}
                    value={todolistId}
                    onChange={(e) => setTodolistId(e.currentTarget.value)}
                />
                <input placeholder={'title'} value={title} onChange={(e) => setTitle(e.currentTarget.value)} />
                <button onClick={onClickUpdateTodolistTitle}>update todolist title</button>
            </div>
        </div>
    )
}
export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState('')
    const onClickGetTask = () => {
        todolistAPI.getTask(todolistId).then((res) => {
            setState(res.data)
        })
    }

    return (
        <div>
            {JSON.stringify(state)}
            <div>
                <input
                    placeholder={'todolistId'}
                    value={todolistId}
                    onChange={(e) => {
                        setTodolistId(e.currentTarget.value)
                    }}
                />
                <button onClick={onClickGetTask}>get tasks</button>
            </div>
        </div>
    )
}
export const CreateTasks = () => {
    const [state, setState] = useState<any>(null)
    const [taskTitle, setTaskTitle] = useState<string>('')
    const [todolistId, setTodolistId] = useState<string>('')

    const onClickCreateTask = () => {
        todolistAPI.createTask(todolistId, taskTitle).then((res) => {
            setState(res.data)
        })
    }

    return (
        <div>
            {JSON.stringify(state)}
            <div>
                <input
                    placeholder={'todolistId'}
                    value={todolistId}
                    onChange={(e) => {
                        setTodolistId(e.currentTarget.value)
                    }}
                />
                <input
                    placeholder={'taskId'}
                    value={taskTitle}
                    onChange={(e) => {
                        setTaskTitle(e.currentTarget.value)
                    }}
                />
                <button onClick={onClickCreateTask}>create task</button>
            </div>
        </div>
    )
}
export const UpdateTitleTasks = () => {
    const [state, setState] = useState<any>(null)
    const [taskId, setTaskId] = useState<string>('')
    const [title, setTitle] = useState<string>('Title 1')
    const [description, setDescription] = useState<string>('Description 1')
    const [status, setStatus] = useState<number>(0)
    const [priority, setPriority] = useState<number>(0)
    const [startDate, setStartDate] = useState<string>('')
    const [deadline, setDeadline] = useState<string>('')
    const [todolistId, setTodolistId] = useState<string>('')

    const onClickUpdateTask = () => {
        todolistAPI
            .updateTask(todolistId, taskId, {
                title: title,
                deadline: '',
                description: description,
                priority: priority,
                startDate: '',
                status: status,
            })
            .then((res) => {
                setState(res.data)
            })
    }

    return (
        <div>
            {JSON.stringify(state)}
            <div>
                <input
                    placeholder={'TodolistId'}
                    value={todolistId}
                    onChange={(e) => {
                        setTodolistId(e.currentTarget.value)
                    }}
                />
                <input
                    placeholder={'Description'}
                    value={description}
                    onChange={(e) => {
                        setDescription(e.currentTarget.value)
                    }}
                />
                <input
                    placeholder={'taskId'}
                    value={taskId}
                    onChange={(e) => {
                        setTaskId(e.currentTarget.value)
                    }}
                />
                <input
                    placeholder={'Status'}
                    value={status}
                    type='number'
                    onChange={(e) => {
                        setStatus(+e.currentTarget.value)
                    }}
                />
                <input
                    placeholder={'Priority'}
                    type='number'
                    value={priority}
                    onChange={(e) => {
                        setPriority(+e.currentTarget.value)
                    }}
                />
                <input
                    placeholder={'task Title'}
                    value={title}
                    onChange={(e) => {
                        setTitle(e.currentTarget.value)
                    }}
                />
                <button onClick={onClickUpdateTask}>update task</button>
            </div>
        </div>
    )
}
export const DeleteTasks = () => {
    const [state, setState] = useState<any>(null)
    const [taskId, setTaskId] = useState<string>('')
    const [todolistId, setTodolistId] = useState<string>('')

    const onClickDeleteTask = () => {
        todolistAPI.deleteTask(todolistId, taskId).then((res) => {
            setState(res.data)
        })
    }

    return (
        <div>
            {JSON.stringify(state)}
            <div>
                <input
                    placeholder={'todolistId'}
                    value={todolistId}
                    onChange={(e) => {
                        setTodolistId(e.currentTarget.value)
                    }}
                />
                <input
                    placeholder={'taskId'}
                    value={taskId}
                    onChange={(e) => {
                        setTaskId(e.currentTarget.value)
                    }}
                />
                <button onClick={onClickDeleteTask}>delete task</button>
            </div>
        </div>
    )
}

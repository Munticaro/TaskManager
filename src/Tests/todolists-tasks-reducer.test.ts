import {tasksSlice, TasksStateType} from "../store/slice/task-slice/tasks-slice";
import {TodolistType} from "../api/todolist-api/todolists-api";
import {
    TodolistDomainType,
    todolistsActions,
    todolistsSlice
} from "../store/slice/todolists-slice/todolists-slice";

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {}
    const startTodolistsState: Array<TodolistDomainType> = []

    const todolist: TodolistType = ({
        id: 'any id',
        title: 'new todolist',
        addedDate: '',
        order: 0,
    })

    const action = todolistsActions.addTodolist({todolist})

    const endTasksState = tasksSlice(startTasksState, action)
    const endTodolistsState = todolistsSlice(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.payload.todolist.id)
    expect(idFromTodolists).toBe(action.payload.todolist.id)
})

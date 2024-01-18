import {addTodolistAC, TodolistDomainType, todolistsReducer} from "../store/todolists-reducer";
import {tasksReducer} from "../store/tasks-reducer";
import {TasksStateType} from "../../../app/App";
import {TodolistType} from "../../../api/todolists-api";

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {}
    const startTodolistsState: Array<TodolistDomainType> = []

    const todolist: TodolistType = ({
        id: 'any id',
        title: 'new todolist',
        addedDate: '',
        order: 0,
    })

    const action = addTodolistAC(todolist)

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.todolist.id)
    expect(idFromTodolists).toBe(action.todolist.id)
})

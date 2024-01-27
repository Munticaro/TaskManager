import {
    FilterValuesType,
    TodolistDomainType, todolistsActions,
    todolistsSlice
} from '../store/slice/todolists-slice/todolists-slice'
import {v1} from 'uuid'
import {TodolistType} from "../api/todolist-api/todolists-api";
import {RequestStatusType} from "../store/slice/app-slice/app-slice";

let todolistId1: string
let todolistId2: string

let startState: TodolistDomainType[] = []

beforeEach(() => {
    todolistId1 = v1();
    todolistId2 = v1()

    startState = [
        {id: todolistId1, title: 'What to learn', filter: 'all', addedDate: 'todolistId1', order: 0, entityStatus: "idle"},
        {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: 'todolistId2', order: 0, entityStatus: "idle"}
    ]
})

test('correct todolist should be removed', () => {
    const endState = todolistsSlice(startState, todolistsActions.removeTodolist({id: todolistId1}))
    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistId2)
})

test('correct todolist should be added', () => {

    let todolist: TodolistType = {
        id: 'any id',
        addedDate: '',
        order: 0,
        title: 'What to learn'
    }

    const endState = todolistsSlice(startState, todolistsActions.addTodolist({todolist}))

    expect(endState.length).toBe(3)
    expect(endState[0].title).toBe(todolist.title)
    expect(endState[0].filter).toBe('all')
})

test('correct todolist should be change its name', () => {
    let todolistId1 = v1()
    let todolistId2 = v1()

    let newTodolistTitle = 'New Todolist'

    const startState: Array<TodolistDomainType> = [
        {id: todolistId1, title: 'What to learn', filter: 'all', addedDate: 'todolistId1', order: 0, entityStatus: "loading"},
        {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: 'todolistId2', order: 0, entityStatus: "loading"}
    ]

    const endState = todolistsSlice(startState, todolistsActions.changeTodolistTitle({id: todolistId2, title: newTodolistTitle}))

    expect(endState[0].title).toBe('What to learn')
    expect(endState[1].title).toBe(newTodolistTitle)
})

test('correct filter of todolist should be changed', () => {
    let todolistId1 = v1()
    let todolistId2 = v1()

    let filter: FilterValuesType = 'completed'

    const startState: Array<TodolistDomainType> = [
        {id: todolistId1, title: 'What to learn', filter: 'all', addedDate: 'todolistId2', order: 0, entityStatus: "loading"},
        {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: 'todolistId2', order: 0, entityStatus: "loading"}
    ]

    const endState = todolistsSlice(startState, todolistsActions.changeTodolistFilter({id: todolistId2, filter}))

    expect(endState[0].filter).toBe('all')
    expect(endState[1].filter).toBe(filter)
})

test('todolists should be set to the state', () => {
    const action = todolistsActions.setTodolists({todolists: startState})

    const endState = todolistsSlice([], action)

    expect(endState.length).toBe(2)
})

test('correct set status change of todolist should be changed', () => {
    let todolistId1 = v1()
    let todolistId2 = v1()

    let newStatus: RequestStatusType = 'loading'

    const startState: Array<TodolistDomainType> = [
        {id: todolistId1, title: 'What to learn', filter: 'all', addedDate: 'todolistId2', order: 0, entityStatus: "loading"},
        {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: 'todolistId2', order: 0, entityStatus: "succeeded"}
    ]

    const endState = todolistsSlice(startState, todolistsActions.setTodolistEntityStatus({id: todolistId2, status: newStatus}))

    expect(endState[0].entityStatus).toBe('loading')
    expect(endState[1].entityStatus).toBe(newStatus)
})


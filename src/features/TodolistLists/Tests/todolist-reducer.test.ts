import {
    addTodolistAC,
    changeTodolistFilterAC, setTodolistEntityStatusAC,
    changeTodolistTitleAC,
    FilterValuesType,
    removeTodolistAC,
    setTodolistsAC,
    TodolistDomainType,
    todolistsReducer
} from '../store/todolists-reducer'
import {v1} from 'uuid'
import {TodolistType} from "../../../api/todolists-api";
import {RequestStatusType} from "../../../app/app-reducer";

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
    const endState = todolistsReducer(startState, removeTodolistAC(todolistId1))
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

    const endState = todolistsReducer(startState, addTodolistAC(todolist))

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

    const endState = todolistsReducer(startState, changeTodolistTitleAC(todolistId2, newTodolistTitle))

    expect(endState[0].title).toBe('What to learn')
    expect(endState[1].title).toBe(newTodolistTitle)
})

test('correct filter of todolist should be changed', () => {
    let todolistId1 = v1()
    let todolistId2 = v1()

    let newFilter: FilterValuesType = 'completed'

    const startState: Array<TodolistDomainType> = [
        {id: todolistId1, title: 'What to learn', filter: 'all', addedDate: 'todolistId2', order: 0, entityStatus: "loading"},
        {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: 'todolistId2', order: 0, entityStatus: "loading"}
    ]

    const endState = todolistsReducer(startState, changeTodolistFilterAC(todolistId2, newFilter))

    expect(endState[0].filter).toBe('all')
    expect(endState[1].filter).toBe(newFilter)
})

test('todolists should be set to the state', () => {
    const action = setTodolistsAC(startState)

    const endState = todolistsReducer([], action)

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

    const endState = todolistsReducer(startState, setTodolistEntityStatusAC(todolistId2, newStatus))

    expect(endState[0].entityStatus).toBe('loading')
    expect(endState[1].entityStatus).toBe(newStatus)
})


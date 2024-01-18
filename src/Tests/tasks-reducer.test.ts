import {
    addTaskAC,
    removeTaskAC,
    setTasksAC,
    tasksReducer, UpdateDomainTaskType, updateTaskAC
} from "../features/TodolistLists/store/tasks-reducer";
import {addTodolistAC, removeTodolistAC, setTodolistsAC} from "../features/TodolistLists/store/todolists-reducer";
import {TasksStateType} from "../app/App";
import {TaskPriorities, TaskStatuses, todolistAPI} from "../api/todolists-api";

let startState: TasksStateType;

beforeEach(() => {
    startState = {
        'todolistId1': [
            {
                id: '1', title: "HTML&CSS", status: TaskStatuses.New,
                todoListId: 'todolistId1',
                description: '',
                startDate: '',
                deadline: '',
                order: 0,
                priority: TaskPriorities.Low,
                addedDate: ''
            },
            {
                id: '2', title: "JS", status: TaskStatuses.Completed,
                todoListId: 'todolistId1',
                description: '',
                startDate: '',
                deadline: '',
                order: 0,
                priority: TaskPriorities.Low,
                addedDate: ''
            },
            {
                id: '3', title: "ReactJS", status: TaskStatuses.New,
                todoListId: 'todolistId1',
                description: '',
                startDate: '',
                deadline: '',
                order: 0,
                priority: TaskPriorities.Low,
                addedDate: ''
            },
        ],
        'todolistId2': [
            {
                id: '1', title: "SSD", status: TaskStatuses.New,
                todoListId: 'todolistId2',
                description: '',
                startDate: '',
                deadline: '',
                order: 0,
                priority: TaskPriorities.Low,
                addedDate: ''
            },
            {
                id: '2', title: "RAM", status: TaskStatuses.Completed,
                todoListId: 'todolistId2',
                description: '',
                startDate: '',
                deadline: '',
                order: 0,
                priority: TaskPriorities.Low,
                addedDate: ''
            },
            {
                id: '3', title: "classic pants", status: TaskStatuses.New,
                todoListId: 'todolistId2',
                description: '',
                startDate: '',
                deadline: '',
                order: 0,
                priority: TaskPriorities.Low,
                addedDate: ''
            },
        ]
    };
});

test('correct task should be deleted from correct array', () => {
    const action = removeTaskAC('2', 'todolistId2');
    const endState = tasksReducer(startState, action);

    expect(endState).toEqual({
        'todolistId1': [
            {
                id: '1', title: "HTML&CSS", status: TaskStatuses.New,
                todolistId: 'todolistId1',
                description: '',
                startDate: '',
                deadline: '',
                order: 0,
                priority: TaskPriorities.Low,
                addedDate: ''
            },
            {
                id: '2', title: "JS", status: TaskStatuses.Completed,
                todolistId: 'todolistId1',
                description: '',
                startDate: '',
                deadline: '',
                order: 0,
                priority: TaskPriorities.Low,
                addedDate: ''
            },
            {
                id: '3', title: "ReactJS", status: TaskStatuses.New,
                todolistId: 'todolistId1',
                description: '',
                startDate: '',
                deadline: '',
                order: 0,
                priority: TaskPriorities.Low,
                addedDate: ''
            },
        ],
        'todolistId2': [
            {
                id: '1', title: "SSD", status: TaskStatuses.New,
                todolistId: 'todolistId2',
                description: '',
                startDate: '',
                deadline: '',
                order: 0,
                priority: TaskPriorities.Low,
                addedDate: ''
            },
            {
                id: '3', title: "classic pants", status: TaskStatuses.New,
                todolistId: 'todolistId2',
                description: '',
                startDate: '',
                deadline: '',
                order: 0,
                priority: TaskPriorities.Low,
                addedDate: ''
            },
        ]
    });
});

test('correct task should be added to correct array', () => {

    const action = addTaskAC({
        todoListId: 'todolistId2',
        title: 'juice',
        status: TaskStatuses.New,
        addedDate: '',
        deadline: '',
        description: '',
        order: 0,
        priority: 0,
        startDate: '',
        id: 'id exist'
    })
    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(4)
    expect(endState['todolistId2'][0].id).toBeDefined()
    expect(endState['todolistId2'][0].title).toBe('juice')
    expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New)
})
test('status of specified task should be changed', () => {
    const action = updateTaskAC('2', {status: TaskStatuses.New}, 'todolistId2')
    const endState = tasksReducer(startState, action)
    expect(endState['todolistId2'][1].status).toBe(TaskStatuses.New)
    expect(endState['todolistId1'][1].status).toBe(TaskStatuses.Completed)
})
test('title of specified task should be changed', () => {
    const action = updateTaskAC('2', {title: 'Sasha'}, 'todolistId2')
    const endState = tasksReducer(startState, action)
    expect(endState['todolistId2'][1].status).toBe(2)
    expect(endState['todolistId1'][1].status).toBe(2)
})
test('new property with new array should be added when new todolist is added', () => {

    const action = addTodolistAC({
        id: '1st',
        title: 'new todolist',
        order: 0,
        addedDate: ''
    })
    const endState = tasksReducer(startState, action)
    const keys = Object.keys(endState)
    const newKey = keys.find(k => k != 'todolistId1' && k != 'todolistId2')
    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3)
    expect(endState[newKey]).toEqual([])
})
test('property with todolistId should be deleted', () => {
    const action = removeTodolistAC('todolistId2')
    const endState = tasksReducer(startState, action)
    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(endState['todolistId2']).not.toBeDefined()
})

test('empty arrays should be added when we set todolists', () => {
    const action = setTodolistsAC([
        {
            id: '1', title: "title1", order: 0, addedDate: ''
        },
        {
            id: '2', title: "title2", order: 0, addedDate: ''
        }

    ])
    const endState = tasksReducer({}, action)
    const keys = Object.keys(endState)

    expect(keys.length).toBe(2)
    expect(endState['1']).toStrictEqual([])
    expect(endState['2']).toStrictEqual([])
})

test('tasks should be added for todolist', () => {
    const action = setTasksAC( 'todolistId1', startState['todolistId1']);
    const endState = tasksReducer({
        'todolistId1': [],
        'todolistId2': []
    }, action);

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(0)
})


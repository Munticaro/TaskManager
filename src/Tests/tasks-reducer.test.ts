import { tasksSlice, TasksStateType, tasksThunks } from 'features/todolistLists/model/task/taskSlice'
import { TaskPriorities, TaskStatuses } from 'common/enums'
import { todolistThunks } from 'features/todolistLists/model/todolist/todolistsSlice'

let startState: TasksStateType

beforeEach(() => {
    startState = {
        todolistId1: [
            {
                id: '1',
                title: 'HTML&CSS',
                status: TaskStatuses.New,
                todoListId: 'todolistId1',
                description: '',
                startDate: '',
                deadline: '',
                order: 0,
                priority: TaskPriorities.Low,
                addedDate: '',
            },
            {
                id: '2',
                title: 'JS',
                status: TaskStatuses.Completed,
                todoListId: 'todolistId1',
                description: '',
                startDate: '',
                deadline: '',
                order: 0,
                priority: TaskPriorities.Low,
                addedDate: '',
            },
            {
                id: '3',
                title: 'ReactJS',
                status: TaskStatuses.New,
                todoListId: 'todolistId1',
                description: '',
                startDate: '',
                deadline: '',
                order: 0,
                priority: TaskPriorities.Low,
                addedDate: '',
            },
        ],
        todolistId2: [
            {
                id: '1',
                title: 'SSD',
                status: TaskStatuses.New,
                todoListId: 'todolistId2',
                description: '',
                startDate: '',
                deadline: '',
                order: 0,
                priority: TaskPriorities.Low,
                addedDate: '',
            },
            {
                id: '2',
                title: 'RAM',
                status: TaskStatuses.Completed,
                todoListId: 'todolistId2',
                description: '',
                startDate: '',
                deadline: '',
                order: 0,
                priority: TaskPriorities.Low,
                addedDate: '',
            },
            {
                id: '3',
                title: 'classic pants',
                status: TaskStatuses.New,
                todoListId: 'todolistId2',
                description: '',
                startDate: '',
                deadline: '',
                order: 0,
                priority: TaskPriorities.Low,
                addedDate: '',
            },
        ],
    }
})

test('correct task should be deleted from correct array', () => {
    const param = { taskId: '2', todolistId: 'todolistId2' }
    const action = tasksThunks.removeTask.fulfilled(param, 'requestId', param)

    const endState = tasksSlice(startState, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(2)
    expect(endState['todolistId2'].every((t) => t.id !== '2')).toBeTruthy()
})

test('correct task should be added to correct array', () => {
    const task = {
        todoListId: 'todolistId2',
        title: 'juice',
        status: TaskStatuses.New,
        addedDate: '',
        deadline: '',
        description: '',
        order: 0,
        priority: 0,
        startDate: '',
        id: 'id exist',
    }

    const action = tasksThunks.addTask.fulfilled({ task }, 'requestId', {
        title: task.title,
        todolistId: task.todoListId,
    })
    const endState = tasksSlice(startState, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(4)
    expect(endState['todolistId2'][0].id).toBeDefined()
    expect(endState['todolistId2'][0].title).toBe('juice')
    expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New)
})
test('status of specified task should be changed', () => {
    const args = { taskId: '2', domainModel: { status: TaskStatuses.New }, todoListId: 'todolistId2' }
    const action = tasksThunks.updateTask.fulfilled(args, 'requestId', args)
    const endState = tasksSlice(startState, action)
    expect(endState['todolistId1'][1].status).toBe(TaskStatuses.Completed)
    expect(endState['todolistId2'][1].status).toBe(TaskStatuses.New)
})
test('title of specified task should be changed', () => {
    const args = { taskId: '2', domainModel: { title: 'Sasha' }, todoListId: 'todolistId2' }
    const action = tasksThunks.updateTask.fulfilled(args, 'requestId', args)
    const endState = tasksSlice(startState, action)
    expect(endState['todolistId1'][1].title).toBe('JS')
    expect(endState['todolistId2'][1].title).toBe('Sasha')
    expect(endState['todolistId2'][0].title).toBe('SSD')
})
test('new array should be added when new todolist is added', () => {
    const todolist = {
        id: 'blabla',
        title: 'new todolist',
        order: 0,
        addedDate: '',
    }

    const action = todolistThunks.addTodolist.fulfilled({ todolist }, 'requestId', todolist.title)

    const endState = tasksSlice(startState, action)

    const keys = Object.keys(endState)
    const newKey = keys.find((k) => k !== 'todolistId1' && k !== 'todolistId2')
    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3)
    expect(endState[newKey]).toEqual([])
})
test('property with todolistId should be deleted', () => {
    const id = 'todolistId2'
    const action = todolistThunks.removeTodolist.fulfilled({ id }, 'requestId', id)
    const endState = tasksSlice(startState, action)
    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(endState['todolistId2']).not.toBeDefined()
})

test('empty arrays should be added when we set todolists', () => {
    const arg = {
        todolists: [
            { id: '1', title: 'title1', addedDate: '', order: 0 },
            { id: '2', title: 'title2', order: 0, addedDate: '' },
        ],
    }
    const action = todolistThunks.fetchTodolists.fulfilled(arg, 'requestId')
    const endState = tasksSlice({}, action)
    const keys = Object.keys(endState)

    expect(keys.length).toBe(2)
    expect(endState['1']).toStrictEqual([])
    expect(endState['2']).toStrictEqual([])
})

test('tasks should be added for todolist', () => {
    const action = tasksThunks.fetchTasks.fulfilled(
        { tasks: startState['todolistId1'], todolistId: 'todolistId1' },
        'requestId',
        'todolistId1',
    )
    debugger
    const endState = tasksSlice(
        {
            todolistId1: [],
            todolistId2: [],
        },
        action,
    )

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(0)
})

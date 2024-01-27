import {TaskPriorities, TaskStatuses} from "../api/todolist-api/todolists-api";
import {tasksActions, tasksSlice, TasksStateType, tasksThunks} from "../store/slice/task-slice/tasks-slice";
import {todolistsActions} from "../store/slice/todolists-slice/todolists-slice";

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

test("correct task should be deleted from correct array", () => {
    const param = {taskId: "2", todolistId: "todolistId2"};
    const action = tasksThunks.removeTask.fulfilled(param, 'requestId', param);


    const endState = tasksSlice(startState, action);

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(2);
    expect(endState["todolistId2"].every((t) => t.id !== "2")).toBeTruthy();
});

test('correct task should be added to correct array', () => {

    const action = tasksActions.addTask({
    task: {
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
    }
    })
    const endState = tasksSlice(startState, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(4)
    expect(endState['todolistId2'][0].id).toBeDefined()
    expect(endState['todolistId2'][0].title).toBe('juice')
    expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New)
})
test('status of specified task should be changed', () => {
    const action = tasksActions.updateTask({taskId: '2', model: {title: 'Sasha'}, todoListId: 'todolistId2'})
    const endState = tasksSlice(startState, action)
    expect(endState["todolistId1"][1].title).toBe("JS")
    expect(endState["todolistId2"][1].title).toBe("Sasha")
    expect(endState["todolistId2"][0].title).toBe("SSD")
})
test('title of specified task should be changed', () => {
    const action = tasksActions.updateTask({taskId: '2', model: {title: 'Sasha'}, todoListId: 'todolistId2'})
    const endState = tasksSlice(startState, action)
    expect(endState['todolistId2'][1].status).toBe(2)
    expect(endState['todolistId1'][1].status).toBe(2)
})
test('new property with new array should be added when new todolist is added', () => {

    const action = todolistsActions.addTodolist({
    todolist: {id: '1st',
        title: 'new todolist',
        order: 0,
        addedDate: ''}
    })
    const endState = tasksSlice(startState, action)
    const keys = Object.keys(endState)
    const newKey = keys.find(k => k != 'todolistId1' && k != 'todolistId2')
    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3)
    expect(endState[newKey]).toEqual([])
})
test('property with todolistId should be deleted', () => {
    const action = todolistsActions.removeTodolist({id: 'todolistId2'})
    const endState = tasksSlice(startState, action)
    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(endState['todolistId2']).not.toBeDefined()
})

test('empty arrays should be added when we set todolists', () => {
    const action = todolistsActions.setTodolists({
        todolists: [
            {id: '1', title: "title1",addedDate: '', order: 0},
            {id: '2', title: "title2", order: 0, addedDate: ''},
        ],
        }
    )
    const endState = tasksSlice({}, action)
    const keys = Object.keys(endState)

    expect(keys.length).toBe(2)
    expect(endState['1']).toStrictEqual([])
    expect(endState['2']).toStrictEqual([])
})

test('tasks should be added for todolist', () => {
    const action = tasksThunks.fetchTasks.fulfilled(
        {tasks: startState['todolistId1'], todolistId: 'todolistId1'},
        'requestId', 'todolistId1')
    debugger
    const endState = tasksSlice({
        'todolistId1': [],
        'todolistId2': []
    }, action);

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(0)
})


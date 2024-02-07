import { createAppAsyncThunk } from 'common/utils/createAppAsyncThunk'
import { appActions } from 'app/model/appSlice'
import { AppRootStateType } from 'app/store'
import { createSlice } from '@reduxjs/toolkit'
import { todolistThunks } from 'features/todolistLists/model/todolist/todolistsSlice'
import { clearTodolistsAndTasks } from 'common/actions/common.actions'
import { ResultCode, TaskPriorities, TaskStatuses } from 'common/enums'
import { taskAPI } from 'features/todolistLists/api/task/taskApi'
import { TaskType, UpdateTaskType } from 'features/todolistLists/api/task/taskApi.types'

const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
  'tasks/fetchTasks',
  async (todolistId) => {
    const res = await taskAPI.getTask(todolistId)
    const tasks = res.data.items
    return { tasks, todolistId }
  },
)

const removeTask = createAppAsyncThunk<RemoveTaskArgType, RemoveTaskArgType>(
  'tasks/removeTask',
  async (arg, { rejectWithValue }) => {
    const res = await taskAPI.deleteTask(arg.todolistId, arg.taskId)
    if (res.data.resultCode === ResultCode.Success) {
      return { taskId: arg.taskId, todolistId: arg.todolistId }
    } else {
      return rejectWithValue(res.data)
    }
  },
)

const addTask = createAppAsyncThunk<{ task: TaskType }, AddTaskArgsType>(
  'tasks/addTask',
  async (arg, { rejectWithValue }) => {
    const res = await taskAPI.createTask(arg)
    if (res.data.resultCode === ResultCode.Success) {
      const task = res.data.data.item
      return { task }
    } else {
      return rejectWithValue(res.data)
    }
  },
)

const updateTask = createAppAsyncThunk<UpdateTasksArgsType, UpdateTasksArgsType>(
  'tasks/updateTask',
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue, getState } = thunkAPI

    const state = getState() as AppRootStateType
    const task = state.tasks[arg.todoListId].find((t) => t.id === arg.taskId)
    if (!task) {
      dispatch(appActions.setAppError({ error: 'task not found in the state' }))
      return rejectWithValue(null)
    }
    const apiModel: UpdateTaskType = {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      startDate: task.startDate,
      deadline: task.deadline,
      ...arg.domainModel,
    }
    const res = await taskAPI.updateTask(arg.todoListId, arg.taskId, apiModel)
    if (res.data.resultCode === ResultCode.Success) {
      return arg
    } else {
      return rejectWithValue(res.data)
    }
  },
)
const slice = createSlice({
  name: 'tasks',
  initialState: {} as TasksStateType,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId]
        const index = tasks.findIndex((t) => t.id === action.payload.taskId)
        if (index !== -1) tasks.splice(index, 1)
      })
      .addCase(todolistThunks.addTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const taskForTodolist = state[action.payload.todoListId]
        const index = taskForTodolist.findIndex((task) => task.id === action.payload.taskId)
        if (index !== -1) {
          taskForTodolist[index] = { ...taskForTodolist[index], ...action.payload.domainModel }
        }
      })
      .addCase(todolistThunks.removeTodolist.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
      .addCase(todolistThunks.fetchTodolists.fulfilled, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = []
        })
      })
      .addCase(clearTodolistsAndTasks.type, () => {
        return {}
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state[action.payload.task.todoListId].unshift(action.payload.task)
      })
  },
})

export const tasksSlice = slice.reducer
export const tasksThunks = { fetchTasks, removeTask, addTask, updateTask }

export type TasksStateType = {
  [key: string]: TaskType[]
}

export type UpdateDomainTaskType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}

type RemoveTaskArgType = {
  todolistId: string
  taskId: string
}

export type AddTaskArgsType = {
  title: string
  todolistId: string
}

type UpdateTasksArgsType = {
  taskId: string
  todoListId: string
  domainModel: UpdateDomainTaskType
}

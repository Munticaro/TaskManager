import React, { useEffect } from 'react'
import { AddItemForm } from 'common/components/AddItemForm/AddItemForm'
import { tasksThunks } from 'features/todolistLists/model/task/taskSlice'
import { TodolistDomainType } from 'features/todolistLists/model/todolist/todolistsSlice'
import { FilterTasksButtons } from 'features/todolistLists/ui/todolist/filterTasksButtons/FilterTasksButtons'
import { Tasks } from 'features/todolistLists/ui/todolist/tasks/tasks'
import { TaskType } from 'features/todolistLists/api/task/taskApi.types'
import s from './todolist.module.css'
import { TodolistTitle } from 'features/todolistLists/ui/todolist/todolistTitle/todolistTitle'
import { useActions } from 'common/hooks'

type Props = {
  todolist: TodolistDomainType
  tasks: TaskType[]
  removeTodolist: (todolistId: string) => void
  changeTodolistTitle: (todolistId: string, newTitle: string) => void
}

export const Todolist: React.FC<Props> = React.memo(function ({
  todolist,
  tasks,
  removeTodolist,
  changeTodolistTitle,
}: Props) {
  const { fetchTasks: fetchTasksThunk, addTask: addTaskThunk } = useActions(tasksThunks)

  useEffect(() => {
    fetchTasksThunk(todolist.id)
  }, [])

  const addTask = (title: string) => {
    return addTaskThunk({ title, todolistId: todolist.id }).unwrap()
  }

  const buttonFormDisabler = todolist.entityStatus === 'loading'

  return (
    <div className='App'>
      <div>
        <TodolistTitle
          todolist={todolist}
          removeTodolist={removeTodolist}
          changeTodolistTitle={changeTodolistTitle}
          tasks={tasks}
        />
        <AddItemForm addItem={addTask} disabled={buttonFormDisabler} />
        <Tasks todolist={todolist} tasks={tasks} />
        <div className={s.filterTaskButton}>
          <FilterTasksButtons todolist={todolist} />
        </div>
      </div>
    </div>
  )
})

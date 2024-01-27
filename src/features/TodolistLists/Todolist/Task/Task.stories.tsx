import type {Meta, StoryObj} from '@storybook/react';

import {action} from '@storybook/addon-actions';

import React, {useState} from "react";
import {Task} from "./Task";
import {TaskPriorities, TaskStatuses} from "../../../../api/todolist-api/todolists-api";


// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Task> = {
    title: 'TODOLISTS/Task',
    component: Task,

    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        changeTaskStatus: {
            action: 'clicked changeTaskStatus'
        },
        changeTaskTitle: {
            action: 'clicked changeTaskTitle'
        },
        removeTask: {
            action: 'clicked removeTask'
        }
    },
    args: {
        // changeTaskStatus: action('changeTaskStatus'),
        // changeTaskTitle: action('changeTaskStatus'),
        // removeTask: action('changeTaskStatus'),
        task: {
            id: 'qwrSasha11',
            title: 'Sasha',
            status: TaskStatuses.Completed,
            todoListId: 'todolistId2',
            description: '',
            startDate: '',
            deadline: '',
            order: 0,
            priority: TaskPriorities.Low,
            addedDate: ''
        },
        todolistId: 'wer235'
    }
};

export default meta;
type Story = StoryObj<typeof Task>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const TaskIsDoneStory: Story = {}
export const TaskNotIsDoneStory: Story = {
    args: {
        task: {
            id: 'qwrSasha113',
            title: 'Ne Sasha',
            status: TaskStatuses.Completed,
            todoListId: 'todolistId2',
            description: '',
            startDate: '',
            deadline: '',
            order: 0,
            priority: TaskPriorities.Low,
            addedDate: ''},
    }
}

// const TaskExample = () => {
//     const [task, setTask] = useState({id: 'Sashaid12', title: 'Sasha', status: TaskStatuses.New,
//         todolistId: 'todolistId2',
//         description: '',
//         startDate: '',
//         deadline: '',
//         order: 0,
//         priority: TaskPriorities.Low,
//         addedDate: ''})
//     return <Task changeTaskStatus={() => setTask({...task, status: TaskStatuses.New})}
//                  changeTaskTitle={(taskId: string, title: string) => setTask({...task, title: title})}
//                  removeTask={action('removeTask')}
//                  task={task}
//                  todolistId={'wer235'}/>
// }
// export const TaskStory: Story = {
//     render: () => {
//         return <TaskExample/>
//     }
// }

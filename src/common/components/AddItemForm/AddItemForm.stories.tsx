import type { Meta, StoryObj } from '@storybook/react'
import React, { ChangeEvent, KeyboardEvent, useState } from 'react'

import { action } from '@storybook/addon-actions'
import { AddItemForm, AddItemFormProps } from 'common/components/AddItemForm/AddItemForm'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof AddItemForm> = {
  title: 'TODOLISTS/AddItemForm',
  component: AddItemForm,

  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    addItem: {
      description: 'Button clicked inside form',
      action: 'clicked',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the form is disabled',
      defaultValue: false,
    },
  },
}

export default meta
type Story = StoryObj<typeof AddItemForm>

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const AddItemFormStories: Story = {}

const AddItemFormStory = (props: AddItemFormProps) => {
  let [title, setTitle] = useState('')
  let [error, setError] = useState<string | null>('Title is required')

  const addTask = () => {
    if (title.trim() !== '') {
      props.addItem(title)
      setTitle('')
    } else {
      setError('Title is required')
    }
  }

  const onNewTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }

  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (error !== null) {
      setError(null)
    }
    if (e.charCode === 13) {
      addTask()
    }
  }

  return (
    <div>
      <input
        value={title}
        onChange={onNewTitleChangeHandler}
        onKeyPress={onKeyPressHandler}
        className={error ? 'error' : ''}
      />
      <button onClick={addTask}>+</button>
      {error && <div className='error-message'>{error}</div>}
    </div>
  )
}

// export const AddItemFormWithError: Story = {
//   render: () => <AddItemFormStory addItem={action('Button clicked inside form')} />,
// }
//
// export const AddItemFormDisabled: Story = {
//   render: () => <AddItemFormStory disabled={true} addItem={action('Button clicked inside form')} />,
// }

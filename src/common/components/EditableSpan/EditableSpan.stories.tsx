import type { Meta, StoryObj } from '@storybook/react'
import { EditableSpan } from 'common/components/EditableSpan/EditableSpan'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof EditableSpan> = {
  title: 'TODOLISTS/EditableSpan',
  component: EditableSpan,

  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    onChange: {
      description: 'EditableSpan value changed',
      action: 'clicked',
    },
  },
  args: {
    title: 'Sasha',
  },
}

export default meta
type Story = StoryObj<typeof EditableSpan>

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const EditableSpanStory: Story = {}

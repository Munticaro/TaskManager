import React, { ChangeEvent, FC, KeyboardEvent, useState } from 'react'
import { IconButton, TextField } from '@mui/material'
import { PlaylistAdd } from '@mui/icons-material'
import { BaseResponseType } from 'common/types'

export type AddItemFormProps = {
  addItem: (title: string) => Promise<any>
  disabled?: boolean
}
export const AddItemForm: FC<AddItemFormProps> = React.memo(({ addItem, disabled = false }) => {
  const [title, setTitle] = useState('')
  const [error, setError] = useState<string | null>(null)
  const newTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }
  const keyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (error !== null) {
      setError(null)
    }
    if (e.charCode === 13) addItemHandler()
  }
  const addItemHandler = () => {
    if (title.trim() !== '') {
      addItem(title)
        .then(() => {
          setTitle('')
        })
        .catch((err: BaseResponseType) => {
          setError(err.messages[0])
        })
    } else {
      setError('Its not good!')
    }
  }
  return (
    <div>
      <TextField
        color='warning'
        variant='outlined'
        disabled={disabled}
        error={!!error}
        value={title}
        onChange={newTitleChangeHandler}
        onKeyPress={keyPressHandler}
        label='Title'
        helperText={error}
      />
      <IconButton onClick={addItemHandler} disabled={disabled}>
        <PlaylistAdd />
      </IconButton>
    </div>
  )
})

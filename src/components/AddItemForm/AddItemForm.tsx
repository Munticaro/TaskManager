import React, {ChangeEvent, FC, KeyboardEvent, useState} from "react";
import {IconButton, TextField} from "@mui/material";
import {PlaylistAdd} from "@mui/icons-material";

export type AddItemFormProps = {
    addItem: (title: string) => void
    disabled?: boolean
}
export const AddItemForm: FC<AddItemFormProps> = React.memo(({ addItem, disabled = false }) => {
    const [title, setTitle] = useState("");
    const [error, setError] = useState<string | null>(null);
    const onNewTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    };
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error !== null){
            setError(null);
        }
        if (e.charCode === 13)
            addTask();
    }
    const addTask = () => {
        if (title.trim() !== '') {
            addItem(title.trim());
            setTitle("");
        } else {
            setError("Its not good!")
        }
    }
    return (
        <div>
            <TextField
                color={'warning'}
                variant="outlined"
                disabled={disabled}
                error={!!error}
                value={title}
                onChange={onNewTitleChangeHandler}
                onKeyPress={onKeyPressHandler}
                label="Title"
            />
            <IconButton onClick={addTask} disabled={disabled}>
                <PlaylistAdd/>
            </IconButton>
            {error && <div className="error-message">{error}</div>}
        </div>
    )
});
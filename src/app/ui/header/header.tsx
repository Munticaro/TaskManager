import React from 'react'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import { Menu } from '@mui/icons-material'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import AppBar from '@mui/material/AppBar'
import { useSelector } from 'react-redux'
import { selectIsLoggedIn } from 'features/auth/model/authSelectors'
import { useActions } from 'common/hooks'
import { authThunks } from 'features/auth/model/authSlice'

export const Header = () => {
  const { logout } = useActions(authThunks)
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const logoutHandler = () => {
    logout()
  }
  return (
    <AppBar position='static'>
      <Toolbar>
        <IconButton edge='start' color='inherit' aria-label='menu'>
          <Menu />
        </IconButton>
        <Typography variant='h6'>Todolist</Typography>
        {isLoggedIn && (
          <Button color='inherit' variant={'outlined'} onClick={logoutHandler} style={{ marginLeft: 'auto' }}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

import { TodolistsList } from 'features/todolistLists/ui/todolistLists'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import { Menu } from '@mui/icons-material'
import { CircularProgress, CssBaseline, LinearProgress } from '@mui/material'
import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { selectAppStatus, selectIsInitialized } from 'app/appSelector'
import { selectIsLoggedIn } from 'features/auth/model/authSelectors'
import { useSelector } from 'react-redux'
import { authThunks } from 'features/auth/model/authSlice'
import { ErrorSnackbar } from 'common/components'
import { Login } from 'features/auth/ui/Login/login'
import { useActions } from 'common/hooks'

type AppPT = {
  demo?: boolean
}

function App({ demo = false, ...props }: AppPT) {
  const status = useSelector(selectAppStatus)
  const isInitialized = useSelector(selectIsInitialized)
  const isLoggedIn = useSelector(selectIsLoggedIn)

  const { isInitializedApp, logout } = useActions(authThunks)

  useEffect(() => {
    if (!demo) {
      isInitializedApp()
    }
  }, [])

  const logoutHandler = () => {
    logout()
  }

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  })

  if (!isInitialized) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <div
          style={{
            position: 'fixed',
            top: '40%',
            textAlign: 'center',
            width: '100%',
          }}
        >
          <CircularProgress color={'warning'} />
        </div>
      </ThemeProvider>
    )
  }

  return (
    <BrowserRouter>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <div className='App'>
          <ErrorSnackbar />
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
            {status === 'loading' && <LinearProgress color='secondary' />}
          </AppBar>
          <Container fixed>
            <Routes>
              <Route path={'/'} element={<TodolistsList demo={demo} />} />
              <Route path={'/login'} element={<Login />} />
            </Routes>
          </Container>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App

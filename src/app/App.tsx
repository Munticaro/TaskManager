import './App.css'
import { TodolistsList } from 'features/todolistLists/ui/todolist/todolistLists'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import { Menu } from '@mui/icons-material'
import { CircularProgress, CssBaseline, LinearProgress } from '@mui/material'
import { isInitializedApp } from 'app/appSlice'
import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Login } from 'features/auth/ui/Login/Login'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { selectAppStatus, selectIsInitialized } from './app.selector'
import { selectIsLoggedIn } from 'features/auth/model/authSelectors'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'common/hooks/useAppDispatch'
import { authThunks } from 'features/auth/model/authSlice'
import { ErrorSnackbar } from 'common/components'

type AppPT = {
    demo?: boolean
}

function App({ demo = false, ...props }: AppPT) {
    const dispatch = useAppDispatch()
    const status = useSelector(selectAppStatus)
    const isInitialized = useSelector(selectIsInitialized)
    const isLoggedIn = useSelector(selectIsLoggedIn)

    useEffect(() => {
        if (!demo) {
            dispatch(isInitializedApp())
        }
    }, [])

    if (!isInitialized) {
        return (
            <div
                style={{
                    position: 'fixed',
                    top: '40%',
                    textAlign: 'center',
                    width: '100%',
                }}
            >
                <CircularProgress />
            </div>
        )
    }

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    })

    const logoutHandler = () => {
        dispatch(authThunks.logout())
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
                                <Button
                                    color='inherit'
                                    variant={'outlined'}
                                    onClick={logoutHandler}
                                    style={{ marginLeft: 'auto' }}
                                >
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

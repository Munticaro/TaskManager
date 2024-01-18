import './App.css';
import {TaskType} from "../api/todolists-api";
import {TodolistsList} from "../features/TodolistLists/TodolistLists";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {Menu} from '@mui/icons-material';
import {CircularProgress, CssBaseline, LinearProgress} from "@mui/material";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {useAppDispatch, useAppSelector} from "./store";
import {isInitializedAppTC, logoutTC, RequestStatusType} from "./app-reducer";
import React, {useEffect} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Login} from "../features/Login/Login";
import {createTheme, ThemeProvider} from "@mui/material/styles";


export type TasksStateType = {
    [key: string]: TaskType[]
}

type AppPT = {
    demo?: boolean
}

function App({demo = false, ...props}: AppPT) {

    const dispatch = useAppDispatch()

    const status = useAppSelector<RequestStatusType>((state) => state.app.status)

    const isInitialized = useAppSelector((state) => state.app.isInitialized)

    useEffect(() => {
        dispatch(isInitializedAppTC())
    }, [])

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });

    if (!isInitialized) {
        return (
            <div
                style={{
                    position: "fixed",
                    top: "40%",
                    textAlign: "center",
                    width: "100%",
                }}
            >
                <CircularProgress/>
            </div>
        )
    }

    const logoutHandler = () => {
        dispatch(logoutTC())
    }

    return (
        <BrowserRouter>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline/>
                <div className="App">
                    <ErrorSnackbar/>
                    <AppBar position="static">
                        <Toolbar>
                            <IconButton edge="start" color="inherit" aria-label="menu">
                                <Menu/>
                            </IconButton>
                            <Typography variant="h6">
                                News
                            </Typography>
                            <Button color="inherit"
                                    variant={'outlined'}
                                    onClick={logoutHandler}
                                    style={{marginLeft: "auto"}}>Logout</Button>
                        </Toolbar>
                        {status === 'loading' && <LinearProgress color="secondary"/>}
                    </AppBar>
                    <Container fixed>
                        <Routes>
                            <Route path={'/'} element={<TodolistsList demo={demo}/>}/>
                            <Route path={'/login'} element={<Login/>}/>
                        </Routes>
                    </Container>
                </div>
            </ThemeProvider>
        </BrowserRouter>
    )
}

export default App;
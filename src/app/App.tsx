import './App.css';
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
import {useAppDispatch, useAppSelector} from "../store/store";
import {isInitializedAppTC, RequestStatusType} from "../store/slice/app-slice/app-slice";
import React, {useEffect} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Login} from "../features/Login/Login";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {logoutTC} from "../store/slice/auth-slice/auth-slice";

type AppPT = {
    demo?: boolean
}

function App({demo = false, ...props}: AppPT) {

    const dispatch = useAppDispatch()

    const status = useAppSelector<RequestStatusType>((state) => state.app.status)

    const isInitialized = useAppSelector((state) => state.app.isInitialized)

    useEffect(() => {
        if (!demo) {
            dispatch(isInitializedAppTC())
        }
    }, [])



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

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });

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
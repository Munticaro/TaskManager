import Container from '@mui/material/Container'
import { CircularProgress, CssBaseline, LinearProgress } from '@mui/material'
import React, { useEffect } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { selectAppStatus, selectIsInitialized } from 'app/model/appSelector'
import { useSelector } from 'react-redux'
import { authThunks } from 'features/auth/model/authSlice'
import { ErrorSnackbar } from 'common/components'
import { useActions } from 'common/hooks'
import { Routing } from 'app/ui/routing/routing'
import { Header } from 'app/ui/header/header'

function App() {
  const status = useSelector(selectAppStatus)
  const isInitialized = useSelector(selectIsInitialized)

  const { isInitializedApp } = useActions(authThunks)

  useEffect(() => {
    isInitializedApp()
  }, [isInitializedApp])

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
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className='App'>
        <ErrorSnackbar />
        <Header />
        {status === 'loading' && (
          <div>
            <LinearProgress
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                marginTop: '64px',
                zIndex: 100,
              }}
              color='warning'
            />
          </div>
        )}
        <Container fixed>
          <Routing />
        </Container>
      </div>
    </ThemeProvider>
  )
}

export default App

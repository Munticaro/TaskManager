import React from 'react'
import Grid from '@mui/material/Grid'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsLoggedIn } from 'features/auth/model/authSelectors'
import s from './login.module.css'
import { useLogin } from 'features/auth/ui/Login/useLogin'

export const Login = () => {
  const { formik } = useLogin()
  const isLoggedIn = useSelector(selectIsLoggedIn)

  if (isLoggedIn) {
    return <Navigate to={'/'} />
  }

  return (
    <Grid container justifyContent='center'>
      <Grid item xs={4}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl>
            <FormLabel style={{ color: '#FFFFFF' }}>
              <p>
                To log in get registered{' '}
                <a href={'https://social-network.samuraijs.com/'} target={'_blank'} rel='noreferrer'>
                  here
                </a>
              </p>
              <p>or use common test account credentials:</p>
              <p> Email: free@samuraijs.com</p>
              <p>Password: free</p>
            </FormLabel>
            <FormGroup>
              <TextField color={'warning'} label='Email' margin='normal' {...formik.getFieldProps('email')} />
              {formik.touched.email && formik.errors.email && <p className={s.error}>{formik.errors.email}</p>}
              <TextField
                color={'warning'}
                type='password'
                label='Password'
                margin='normal'
                {...formik.getFieldProps('password')}
              />
              {formik.touched.password && formik.errors.password && <p className={s.error}>{formik.errors.password}</p>}
              <FormControlLabel
                label={'Remember me'}
                control={
                  <Checkbox
                    color={'warning'}
                    {...formik.getFieldProps('rememberMe')}
                    checked={formik.values.rememberMe}
                  />
                }
              />
              <Button
                color={'warning'}
                type={'submit'}
                variant={'contained'}
                disabled={!(formik.isValid && formik.dirty)}
              >
                Login
              </Button>
            </FormGroup>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  )
}

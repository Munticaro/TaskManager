import React from 'react'
import Grid from '@mui/material/Grid'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { FormikHelpers, useFormik } from 'formik'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsLoggedIn } from 'features/auth/model/authSelectors'
import { useAppDispatch } from 'common/hooks/useAppDispatch'
import { authThunks } from 'features/auth/model/authSlice'
import { LoginParamsType } from 'features/auth/api/authApi.types'

export const Login = () => {
    const dispatch = useAppDispatch()
    const isLoggedIn = useSelector(selectIsLoggedIn)

    const formik = useFormik({
        validate: (values) => {
            if (!values.email) {
                return {
                    email: 'Email is required!',
                }
            }
            if (!values.password) {
                return {
                    password: 'Password is required!',
                }
            }
        },
        initialValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
        onSubmit: async (values, formikHelpers: FormikHelpers<LoginParamsType>) => {
            await dispatch(authThunks.login(values))
            formikHelpers.setFieldError('email', 'ne to vvel braza')
        },
    })

    if (isLoggedIn) {
        return <Navigate to={'/'} />
    }

    return (
        <Grid container justifyContent={'center'}>
            <Grid item justifyContent={'center'}>
                <FormControl>
                    <form onSubmit={formik.handleSubmit}>
                        <FormLabel color={'secondary'}>
                            <p>
                                To log in get registered
                                <a href={'https://social-network.samuraijs.com/'} target={'_blank'}>
                                    {' '}
                                    here
                                </a>
                            </p>
                            <p>or use common test account credentials:</p>
                            <p>Email: free@samuraijs.com</p>
                            <p>Password: free</p>
                        </FormLabel>
                        <FormGroup>
                            <TextField
                                color={'secondary'}
                                label='Email'
                                margin='normal'
                                {...formik.getFieldProps('email')}
                            />
                            {formik.errors.email ? <div>{formik.errors.email}</div> : null}
                            <TextField
                                color={'secondary'}
                                type='password'
                                label='Password'
                                margin='normal'
                                {...formik.getFieldProps('password')}
                            />
                            {formik.errors.password ? <div>{formik.errors.password}</div> : null}
                            <FormControlLabel
                                label={'Remember me'}
                                control={
                                    <Checkbox
                                        color={'default'}
                                        checked={formik.values.rememberMe}
                                        {...formik.getFieldProps('rememberMe')}
                                    />
                                }
                            />
                            <Button type={'submit'} variant={'contained'} color={'secondary'}>
                                Login
                            </Button>
                        </FormGroup>
                    </form>
                </FormControl>
            </Grid>
        </Grid>
    )
}

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
import { BaseResponseType } from 'common/types'
import { LoginParamsType } from 'features/auth/api/authApi.types'
import s from './login.module.css'

export const Login = () => {
    const dispatch = useAppDispatch()
    const isLoggedIn = useSelector(selectIsLoggedIn)

    const formik = useFormik({
        // validate: (values) => {
        //     if (!values.email) {
        //         return {
        //             email: 'Email is required!',
        //         }
        //     }
        //     if (!values.password) {
        //         return {
        //             password: 'Password is required!',
        //         }
        //     }
        // },
        initialValues: {
            email: '',
            password: '',
            rememberMe: false,
        },

        onSubmit: (values, formikHelpers: FormikHelpers<LoginParamsType>) => {
            dispatch(authThunks.login(values))
                .unwrap()
                .catch((reason: BaseResponseType) => {
                    debugger
                    reason.fieldsErrors?.forEach((fieldError) => {
                        formikHelpers.setFieldError(fieldError.field, fieldError.error)
                    })
                })
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
                            {formik.errors.email ? <p className={s.error}>{formik.errors.email}</p> : null}
                            <TextField
                                color={'secondary'}
                                type='password'
                                label='Password'
                                margin='normal'
                                {...formik.getFieldProps('password')}
                            />
                            {formik.errors.password ? <p className={s.error}>{formik.errors.password}</p> : null}
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

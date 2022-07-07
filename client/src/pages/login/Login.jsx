import React, { useState, useRef } from 'react'
import axios from 'axios'
import { TextField, Paper, Grid } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import * as Yup from 'yup'
import { Formik } from 'formik'
import Swal from 'sweetalert2'

import './Login.css'

const Login = ({setAccount}) => {
    const formik = useRef()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const initialValues = {email: email, password: password}
    
    const loginSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid Email address')
            .required('Email address is required'),
        password: Yup.string()
            .required('Password is required'),
    })

    const config = {
        headers: {
            'Content-type': 'application/json',
        },
    }

    const handleLogin = async(values) => {
        try{
            const res = await axios.post('http://localhost:5000/api/users/', values, config)

            if(res.status === 200) {
                localStorage.setItem('userToken', JSON.stringify(res.data.data.token))
                localStorage.setItem('loginSurge', JSON.stringify(res.data.data.user))
                setAccount(res.data.data.user)
                setLoading(false)
            } 
        } catch(error){
            Swal.fire({
                icon: 'error',
                title: 'User Login Fail',
                text: error.response ? error.response.message : error
            })
            setLoading(false)
        }        
    } 

    return (
        <Grid>
            <Paper elevation = {10} style = {paperStyle}>
                <div className = 'heading'>
                    <h3>Sign In</h3>
                </div>

                <Formik
                    initialValues = {initialValues}
                    enableReinitialize
                    validationSchema = {loginSchema}
                    validateOnMount = {false}
                    validateOnChange = {false}
                    validateOnBlur = {true}
                    onSubmit = {(values, actions) => {
                        setLoading(true)
                        if(actions.validateForm) {
                            handleLogin(values)
                        } else {
                            setLoading(false)
                        }
                    }}
                    innerRef = {formik}
                >
                {
                    (props) =>
                    <div>
                        <TextField
                            error = {props.errors.email && props.touched.email}
                            id = 'email'
                            label = {props.errors.email && props.touched.email ? props.errors.email : 'Email'}
                            style = {{
                                marginTop: 50,
                                marginLeft: 80,
                                width: '250px'
                            }}
                            InputLabelProps = {{
                                shrink: true
                            }}
                            value = {props.values.email}
                            onChange = {(event) => setEmail(event.target.value)}
                        />
                        <TextField
                            error = {props.errors.password && props.touched.password}
                            id = 'password'
                            label = {props.errors.password && props.touched.password ? props.errors.password : 'Password'}
                            type = 'password'
                            style = {{
                                marginTop: 20,
                                marginLeft: 80,
                                width: '250px'
                            }}
                            InputLabelProps = {{
                                shrink: true
                            }}
                            value = {props.values.password}
                            onChange = {(event) => setPassword(event.target.value)}
                        />

                        <LoadingButton
                            variant = 'contained'
                            style = {{
                                marginTop: 30,
                                marginLeft: 150,
                                width: 100
                            }}
                            loading = {loading}
                            onClick = {props.handleSubmit}
                        >
                            Login
                        </LoadingButton>
                    </div>
                }
                </Formik>
            </Paper>
        </Grid>
    )
}

const paperStyle = {
    padding: 20,
    height: '50vh',
    width: 400,
    margin: '20px auto',
    marginTop: 120,
    marginLeft: 550
}

export default Login
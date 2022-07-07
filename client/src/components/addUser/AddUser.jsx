import React, { useState, useRef } from 'react'
import { TextField } from '@mui/material'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import { LoadingButton } from '@mui/lab'
import axios from 'axios'

import './AddUser.css'

const AddUser = ({setOpen}) => {
    const formik = useRef()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [id, setId] = useState('')

    const initialValues = {
        email: email,
        password: password,
        id: id 
    }

    const numberRegex = /^[0-9]*$/

    const userSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID is required')
            .matches(numberRegex, 'Only Numbers are allowed'),
        email: Yup.string()
            .email('Invalid Email address')
            .required('Email address is required'),
        password: Yup.string()
            .required('Password is required')
    })

    const config = {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('userToken'))}`
        }
    }

    const handleAdd = async(values) => { 
        try{
            const res = await axios.post('http://localhost:5000/api/users/register', values, config)

            if(res.status === 201) {
                Swal.fire({
                    icon: 'success',
                    title: 'User Registration Success',
                    text: 'User Details have been successfully added'
                })
                formik.current.setSubmitting(false)
                setOpen(false)
            }
        }catch(error) {
            Swal.fire({
                icon: 'error',
                title: 'User Registration Fail',
                text: error.response ? error.response.message : error
            })
            formik.current.setSubmitting(false)
        }
    }

    return (
        <div style = {{padding: '30px'}}>
            <div style = {{
                fontSize: 21,
                fontWeight: 600,
                marginBottom: '30px'
            }}>Add User</div>

            <Formik
                initialValues = {initialValues}
                enableReinitialize
                validationSchema = {userSchema}
                validateOnMount = {false}
                validateOnChange = {true}
                validateOnBlur = {true}
                onSubmit = {(values, actions) => {
                    if(actions.validateForm) {
                        handleAdd(values)
                    } else {
                        actions.setSubmitting(false)
                    }
                }}
                innerRef = {formik}
            >
            {
                (props) =>
                <>
                <div className = 'form-box'>
                        <div className = 'form-field'>
                            <TextField
                                error = {props.errors.id && props.touched.id}
                                required
                                id = 'id'
                                label = {props.errors.id && props.touched.id ? props.errors.id : 'ID'}
                                style = {{
                                    width: '250px'
                                }}
                                onChange = {(event) => setId(event.target.value)}
                                value = {id}
                            />
                        </div>
                    </div>

                    <div className = 'form-box'>
                        <div className = 'form-field'>
                            <TextField
                                error = {props.errors.email && props.touched.email}
                                required
                                id = 'email'
                                label = {props.errors.email && props.touched.email ? props.errors.email : 'Email'}
                                style = {{
                                    width: '250px'
                                }}
                                onChange = {(event) => setEmail(event.target.value)}
                                value = {email}
                            />
                        </div>
                        <div className = 'form-field'>
                            <TextField
                                error = {props.errors.password && props.touched.password}
                                required
                                type = 'password'
                                id = 'password'
                                label = {props.errors.password && props.touched.password ? props.errors.password : 'Password'}
                                style = {{
                                    width: '250px'
                                }}
                                onChange = {(event) => setPassword(event.target.value)}
                                value = {password}
                            />    
                        </div>
                    </div>
                    
                    <div className = 'buttonHolder'>   
                        <LoadingButton 
                            variant = 'contained' 
                            style = {{width: 150, marginTop: 40, backgroundColor: '#00d0f1'}}
                            loading = {props.isSubmitting}
                            onClick = {props.handleSubmit}
                        >
                            Add
                        </LoadingButton>
                    </div>
                </>
            }
            </Formik>
        </div>
    )
}

export default AddUser
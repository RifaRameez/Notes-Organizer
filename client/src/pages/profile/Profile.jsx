import React, { useState, useRef } from 'react'
import axios from 'axios'
import { TextField, Paper, Grid } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import * as Yup from 'yup'
import { Formik } from 'formik'
import Swal from 'sweetalert2'

import './Profile.css'

const Profile = ({setAccount}) => {
    const formik = useRef()

    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [dateOfBirth, setDateOfBirth] = useState(new Date())
    const [mobile, setMobile] = useState('')
    const [loading, setLoading] = useState(false)

    const initialValues = {password: password, firstName: firstName, lastName: lastName,
                            dateOfBirth: dateOfBirth, mobile: mobile}
    
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

    const profileSchema = Yup.object().shape({
        password: Yup.string()
            .required('Password is required'),
        firstName: Yup.string()
            .required('First Name is required'),
        lastName: Yup.string()
            .required('Last Name is required'),
        mobile: Yup.string()
            .required('Mobile is required')
            .matches(phoneRegExp, 'Phone number is not valid'),
        dateOfBirth: Yup.string()
            .required('Date of Birth is required')
    })

    const config = {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('userToken'))}`
        }
    }

    const handleUpdate = async(values) => {
        try{
            const res = await axios.put(`http://localhost:5000/api/users/`, values, config)

            if(res.status === 200) {
                localStorage.setItem('loginSurge', JSON.stringify(res.data.data))
                setAccount(res.data.data)
                setLoading(false)
            } 
        } catch(error){
            Swal.fire({
                icon: 'error',
                title: 'User Profile Update Fail',
                text: error.response ? error.response.message : error
            })
            setLoading(false)
        }        
    } 

    return (
        <Grid>
            <Paper elevation = {10} style = {paperStyle}>
                <Formik
                    initialValues = {initialValues}
                    enableReinitialize
                    validationSchema = {profileSchema}
                    validateOnMount = {false}
                    validateOnChange = {true}
                    validateOnBlur = {true}
                    onSubmit = {(values, actions) => {
                        setLoading(true)
                        if(actions.validateForm) {
                            handleUpdate(values)
                        } else {
                            setLoading(false)
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
                                    error = {props.errors.password && props.touched.password}
                                    required
                                    type = 'password'
                                    id = 'password'
                                    label = {props.errors.password && props.touched.password ? props.errors.password : 'Password'}
                                    style = {{
                                        width: '250px'
                                    }}
                                    onChange = {(event) => setPassword(event.target.value)}
                                />
                            </div>
                        </div>

                        <div className = 'form-box'>
                            <div className = 'form-field'>
                                <TextField
                                    error = {props.errors.firstName && props.touched.firstName}
                                    required
                                    id = 'firstname'
                                    label = {props.errors.firstName && props.touched.firstName ? props.errors.firstName : 'First Name'}
                                    style = {{
                                        width: '250px'
                                    }}
                                    onChange = {(event) => setFirstName(event.target.value)}
                                />
                            </div>
                            <div className = 'form-field'>
                                <TextField
                                    error = {props.errors.lastName && props.touched.lastName}
                                    required
                                    id = 'lastname'
                                    label = {props.errors.lastName && props.touched.lastName ? props.errors.lastName : 'Last Name'}
                                    style = {{
                                        width: '250px'
                                    }}
                                    onChange = {(event) => setLastName(event.target.value)}
                                />    
                            </div>
                        </div>

                        <div className = 'form-box'>
                            <div className = 'form-field'>
                                <TextField
                                    error = {props.errors.mobile && props.touched.mobile}
                                    required
                                    id = 'mobile'
                                    type = 'number'
                                    label = {props.errors.mobile && props.touched.mobile ? props.errors.mobile : 'Mobile'}
                                    style = {{
                                        width: '250px'
                                    }}
                                    onChange = {(event) => setMobile(event.target.value)}
                                />
                            </div>
                            <div className = 'form-field'>
                                <LocalizationProvider dateAdapter = {AdapterDateFns}>
                                    <DatePicker
                                        label = {props.errors.dateOfBirth && props.touched.dateOfBirth ? props.errors.dateOfBirth : 'Date of Birth'}
                                        value = {dateOfBirth}
                                        onChange = {value => setDateOfBirth(value)}
                                        renderInput = {params => <TextField {...params} />}
                                    />
                                </LocalizationProvider>    
                            </div>
                        </div>
                        
                        <div className = 'buttonHolder'>   
                            <LoadingButton 
                                variant = 'contained' 
                                style = {{width: 150, marginTop: 40, backgroundColor: '#00d0f1'}}
                                loading = {loading}
                                onClick = {props.handleSubmit}
                            >
                                Update
                            </LoadingButton>
                        </div>
                    </>
                }
                </Formik>
            </Paper>
        </Grid>
    )
}

const paperStyle = {
    padding: 20,
    height: '50vh',
    width: 530,
    margin: '20px auto',
    marginTop: 120,
    marginLeft: 550
}

export default Profile
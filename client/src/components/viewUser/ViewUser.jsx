import React from 'react'
import { TextField } from '@mui/material'
import { Formik } from 'formik'

import './ViewUser.css'

const ViewUser = ({data, setOpen}) => {
    const initialValues = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        dateofBirth: data.dateOfBirth.toString().split('T')[0],
        mobile: data.mobile
    }

    return (
        <div style = {{padding: '30px'}}>
            <div style = {{
                fontSize: 21,
                fontWeight: 600,
                marginBottom: '30px'
            }}>User</div>

            <Formik
                initialValues = {initialValues}
            >
            {
                (props) => 
                <>
                    <div className = 'form-box'>
                        <div className = 'form-field'>
                            <TextField
                                id = 'fistName'
                                label = 'First Name'
                                style = {{
                                    width: '250px'
                                }}
                                value = {props.values.firstName}
                            />
                        </div>
                        <div className = 'form-field'>
                            <TextField
                                id = 'lastName'
                                label = 'Last Name'
                                style = {{
                                    width: '250px'
                                }}
                                value = {props.values.lastName}
                            />    
                        </div>
                    </div>
                    <div className = 'form-box'>
                        <div className = 'form-field'>
                            <TextField
                                id = 'email'
                                label = 'Email'
                                style = {{
                                    width: '250px'
                                }}
                                value = {props.values.email}
                            />
                        </div>  
                    </div>
                    <div className = 'form-box'>
                        <div className = 'form-field'>
                            <TextField
                                id = 'dateofBirth'
                                label = 'Date of Birth'
                                style = {{
                                    width: '250px'
                                }}
                                value = {props.values.dateofBirth}
                            />
                        </div>
                        <div className = 'form-field'>
                            <TextField
                                id = 'mobile'
                                label = 'Mobile'
                                style = {{
                                    width: '250px'
                                }}
                                value = {props.values.mobile}
                            />
                        </div>
                    </div>
                </>
            }
            </Formik>
        </div>
    )
}

export default ViewUser
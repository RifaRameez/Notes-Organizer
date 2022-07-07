import React, { useState, useRef } from 'react'
import { TextField } from '@mui/material'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import { LoadingButton } from '@mui/lab'
import axios from 'axios'

import './AddNote.css'

const AddNote = ({setOpen, setNoteList, noteList}) => {
    const formik = useRef()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    const initialValues = {
        title: title,
        description: description,
    }

    const noteSchema = Yup.object().shape({
        title: Yup.string()
            .required('Title is required'),
        description: Yup.string()
            .required('Description is required')
    })

    const config = {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('userToken'))}`
        }
    }

    const handleAdd = async(values) => { 
        try{
            const res = await axios.post('http://localhost:5000/api/users/note', values, config)
            
            if(res.status === 201) {
                Swal.fire({
                    icon: 'success',
                    title: 'Note Added Successfully',
                })
                const data = [...noteList]
                data.push({
                    title: res.data.data.title,
                    description: res.data.data.description,
                    _id: res.data.data._id
                })
                setNoteList(data)
                formik.current.setSubmitting(false)
                setOpen(false)
            }
        } catch(error) {
            Swal.fire({
                icon: 'error',
                title: 'Note Add Unsuccessful',
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
            }}>Add Note</div>

            <Formik
                initialValues = {initialValues}
                enableReinitialize
                validationSchema = {noteSchema}
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
                                error = {props.errors.title && props.touched.title}
                                required
                                id = 'title'
                                label = {props.errors.title && props.touched.title ? props.errors.title : 'Title'}
                                style = {{
                                    width: '350px'
                                }}
                                onChange = {(event) => setTitle(event.target.value)}
                                value = {title}
                            />
                        </div>
                    </div>

                    <div className = 'form-box'>
                        <div className = 'form-field'>
                            <TextField
                                error = {props.errors.description && props.touched.description}
                                required
                                id = 'email'
                                label = {props.errors.description && props.touched.description ? props.errors.description : 'Description'}
                                style = {{
                                    width: '350px'
                                }}
                                multiline = {true}
                                rows = {5}
                                onChange = {(event) => setDescription(event.target.value)}
                                value = {description}
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

export default AddNote
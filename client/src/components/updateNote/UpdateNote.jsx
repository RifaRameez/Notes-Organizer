import React, { useState, useRef } from 'react'
import { TextField } from '@mui/material'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import { LoadingButton } from '@mui/lab'
import axios from 'axios'

import './UpdateNote.css'

const UpdateNote = ({setOpen, data, setNoteList, noteList}) => {
    const formik = useRef()

    const [title, setTitle] = useState(data.title)
    const [description, setDescription] = useState(data.description)

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

    const handleUpdate = async(values) => { 
        try{
            const res = await axios.put(`http://localhost:5000/api/users/note/${data._id}`, values, config)
            console.log(res.data)
            if(res.status === 200) {
                const data = [...noteList]
                const index = data.findIndex(data => data._id === data.id)
                const note = await data.splice(index, 1)[0]
                note.title = res.data.data.title
                note.description = res.data.data.description
                await data.splice(index, 0, note)
                setNoteList(data)

                Swal.fire({
                    icon: 'success',
                    title: 'Note Updated Successfully',
                })

                formik.current.setSubmitting(false)
                setOpen(false)
            }
        }catch(error) {
            Swal.fire({
                icon: 'error',
                title: 'Note Update Unsuccessful',
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
            }}>Update Note</div>

            <Formik
                initialValues = {initialValues}
                enableReinitialize
                validationSchema = {noteSchema}
                validateOnMount = {false}
                validateOnChange = {true}
                validateOnBlur = {true}
                onSubmit = {(values, actions) => {
                    if(actions.validateForm) {
                        handleUpdate(values)
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
                                    width: '250px'
                                }}
                                onChange = {(event) => setTitle(event.target.value)}
                                value = {props.values.title}
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
                                    width: '250px'
                                }}
                                multiline = {true}
                                rows = {5}
                                onChange = {(event) => setDescription(event.target.value)}
                                value = {props.values.description}
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
                            Update
                        </LoadingButton>
                    </div>
                </>
            }
            </Formik>
        </div>
    )
}

export default UpdateNote
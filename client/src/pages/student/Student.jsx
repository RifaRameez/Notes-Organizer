import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { DeleteOutline, Edit } from '@mui/icons-material'
import { Backdrop, Slide, Modal, Box } from '@mui/material'
import axios from 'axios'
import Swal from 'sweetalert2'

import AddNote from '../../components/addNote/AddNote'
import UpdateNote from '../../components/updateNote/UpdateNote'
import Loader from '../../components/loader/Loader'

import './Student.css'

const Student = () => {
    const [noteList, setNoteList] = useState([])
    const [updateOpen, setUpdateOpen] = useState(false)
    const [addOpen, setAddOpen] = useState(false)
    const [noteData, setNoteData] = useState([])
    const [loading, setLoading] = useState(true)

    const columns = [
        { field: '_id', hide: true },
        { field: 'title', headerName: 'Title', width: 290, headerAlign: 'center', align: 'center' },
        { field: 'description', headerName: 'Description', width: 400, headerAlign: 'center', align: 'center' },
        { field: 'action', headerName: 'Action', width: 290, headerAlign: 'center', align: 'center',
            renderCell: (params) => {
                return (
                <>
                    <Edit
                        className = 'noteListEdit'
                        onClick = {() => handleUpdate(params.row._id)}
                    />
                    <DeleteOutline
                        className = 'noteListDelete'
                        onClick = {() => handleDelete(params.row._id)}
                    />
                </>
                )
            },
        },
    ]

    const handleUpdate = (id) => {
        const data = noteList.find(note => note._id === id)
        setNoteData(data)
        setUpdateOpen(true)
    }

    const config = {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('userToken'))}`
        }
    }

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then(async(result) => {
            if (result.isConfirmed) {
                try{
                    const res = await axios.delete(`http://localhost:5000/api/users/note/${id}`, config)
                    
                    if(res.status === 200) {
                        const data = [...noteList]
                        await data.splice(data.findIndex(data => data._id === id), 1)[0]
                        setNoteList(data)
                        Swal.fire({
                            icon: 'success',
                            title: 'Note Deleted'
                        })
                    }
                } catch(error){
                    Swal.fire({
                        icon: 'error',
                        title: 'Delete Unsuccessful',
                        text: error.response ? error.response.message : error
                    })
                }
            }
        })
    }

    useEffect(() => {
        const getNotes = async() => {
            try{
                const res = await axios.get('http://localhost:5000/api/users/note/', config)
                
                if(res.status === 200) {
                    setNoteList(res.data.data)
                    setLoading(false)
                }
            } catch(error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Retrive Unsuccessful',
                    text: error.response ? error.response.message : error
                })
                setLoading(false)
            }
        }

        getNotes()
    }, [])
    
    return (
        <>
            <div className = 'noteList'>
                <div className = 'titleContainer'>
                    <div className = 'pageHeading'>Note List</div>
                    <button className = 'noteAddButton' onClick = {() => setAddOpen(true)}>Add</button>
                </div>          

            {
                loading ? 
                <div style = {{
                    marginLeft: '50%',
                    marginTop: '20%'
                }}>
                    <Loader />
                </div> :
                <div className = 'noteTable'>
                    <DataGrid
                        rows = {noteList}
                        columns = {columns}
                        autoHeight
                        pageSize = {8}
                        style = {{
                            backgroundColor: 'white'
                        }}
                        getRowId = {row => row._id}
                    />
                </div>
            }

            </div>

            <Modal
                aria-labelledby = 'transition-modal-title'
                aria-describedby = 'transition-modal-description'
                open = {updateOpen}
                onClose = {() => setUpdateOpen(false)}
                closeAfterTransition
                BackdropComponent = {Backdrop}
                BackdropProps = {{
                    timeout: 500,
                }}
            >
                <Slide in = {updateOpen}>
                    <Box sx = {style}>
                        <UpdateNote setOpen = {setUpdateOpen} data = {noteData} setNoteList = {setNoteList} noteList = {noteList} />
                    </Box>
                </Slide>
            </Modal>

            <Modal
                aria-labelledby = 'transition-modal-title'
                aria-describedby = 'transition-modal-description'
                open = {addOpen}
                onClose = {() => setAddOpen(false)}
                closeAfterTransition
                BackdropComponent = {Backdrop}
                BackdropProps = {{
                    timeout: 500,
                }}
            >
                <Slide in = {addOpen}>
                    <Box sx = {style}>
                        <AddNote setOpen = {setAddOpen} setNoteList = {setNoteList} noteList = {noteList} />
                    </Box>
                </Slide>
            </Modal>
        </>
    )
}

const style = {
    position: 'absolute',
    top: 50,
    left: 550,
    transform: 'translate(-50%, -50%)',
    width: 420,
    height: 450,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 5
}


export default Student
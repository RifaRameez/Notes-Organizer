import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Visibility } from '@mui/icons-material'
import { Backdrop, Slide, Modal, Box, TextField, FormControl, MenuItem, Select, InputLabel } from '@mui/material'
import axios from 'axios'
import Swal from 'sweetalert2'

import Loader from '../../components/loader/Loader'
import ViewUser from '../../components/viewUser/ViewUser'
import AddUser from '../../components/addUser/AddUser'

import './Admin.css'

const Admin = () => {
    const [loading, setLoading] = useState(true)
    const [userList, setUserList] = useState([])
    const [viewOpen, setViewOpen] = useState(false)
    const [addOpen, setAddOpen] = useState(false)
    const [userData, setUserData] = useState([])
    const [value, setValue] = useState()
    const [type, setType] = useState()

    const columns = [
        { field: 'id', headerName: 'ID', width: 250, headerAlign: 'center', align: 'center' },
        { field: 'email', headerName: 'Email', width: 290, headerAlign: 'center', align: 'center' },
        { field: 'firstName', headerName: 'First Name', width: 290, headerAlign: 'center', align: 'center' },
        { field: 'lastName', headerName: 'Last Name', width: 290, headerAlign: 'center', align: 'center' },
        { field: 'action', headerName: 'Action', width: 290, headerAlign: 'center', align: 'center',
            renderCell: (params) => {
                return (
                <>
                    <Visibility
                        className = 'userListView'
                        onClick={() => handleView(params.row.id)}
                    />
                </>
                )
            },
        },
    ]

    const config = {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('userToken'))}`
        }
    }

    const handleView = async(id) => {
        const user = userList.find(user => user.id === id)
        setUserData(user)
        setViewOpen(true)
    }

    const handleSearch = async() => {
        if(type && type !== 'all' && value) {
            try{
                setLoading(true)
                const res = await axios.get(`http://localhost:5000/api/users/${type}/${value}`, config)
                
                if(res.status === 200) {
                    setUserList(res.data.data)
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
        if(type === 'all') {
            getUsers()
        }
    }

    const getUsers = async() => {
        try{
            if(loading === false) setLoading(true)

            const res = await axios.get('http://localhost:5000/api/users/', config)
        
            if(res.status === 200) {
                setUserList(res.data.data)
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

    useEffect(() => {     
        getUsers()
    }, [])

    return ( 
        <>
            <div className = 'userList'>
                <div className = 'titleContainer'>
                    <div className = 'pageHeading'>User List</div>
                    <button className = 'userAddButton' onClick = {() => setAddOpen(true)}>Add</button>
                </div>          

                <div className = 'searchTab'>
                    <TextField
                        style = {{
                            width: '200px',
                            marginRight: 15
                        }}
                        size = 'small'
                        onChange = {(event) => setValue(event.target.value)}
                    />
                    <FormControl>
                        <InputLabel>Select Type</InputLabel>
                        <Select
                            label = 'Select Type'
                            style = {{
                                width: '150px',
                                marginRight: 15
                            }}
                            multiple = {false}
                            onChange = {(event) => setType(event.target.value)}
                            value = {type}
                            size = 'small'
                        >
                            <MenuItem value = 'all'>All</MenuItem>
                            <MenuItem value = 'name'>Name</MenuItem>
                            <MenuItem value = 'email'>Email</MenuItem>
                            <MenuItem value = 'id'>ID</MenuItem>
                        </Select>
                    </FormControl>
                    <button className = 'searchButton' onClick = {() => handleSearch()}>Search</button>
                </div>

            {
                loading ? 
                <div style = {{
                    marginLeft: '50%',
                    marginTop: '20%'
                }}>
                    <Loader />
                </div> :
                <div className = 'userTable'>
                    <DataGrid
                        rows = {userList}
                        columns = {columns}
                        autoHeight
                        pageSize = {8}
                        //rowsPerPageOptions = {}
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
                open = {viewOpen}
                onClose = {() => setViewOpen(false)}
                closeAfterTransition
                BackdropComponent = {Backdrop}
                BackdropProps = {{
                timeout: 500,
                }}
            >
                <Slide in = {viewOpen}>
                    <Box sx = {style}>
                        <ViewUser setOpen = {setViewOpen} data = {userData} />
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
                    <Box sx = {{...style, height: 350}}>
                        <AddUser setOpen = {setAddOpen} />
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
    width: 580,
    height: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 5
}

export default Admin
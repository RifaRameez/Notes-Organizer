import React from 'react'
import { Logout } from '@mui/icons-material'

import './Topbar.css'

const Topbar = ({setAccount}) => {
    const handleLogout = () => {
        localStorage.removeItem('userToken')
        localStorage.removeItem('loginSurge')
        setAccount()
    }

    return (
        <div className = 'topbar'>
            <div className = 'topbarWrapper'>
                <Logout
                    className = 'logOut'
                    onClick = {() => handleLogout()}
                />
            </div>
        </div>
    )
}

export default Topbar
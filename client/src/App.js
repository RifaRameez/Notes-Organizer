import React, { useState, useLayoutEffect } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import Login from './pages/login/Login'
import Admin from './pages/admin/Admin'
import Topbar from './components/topbar/Topbar'
import Profile from './pages/profile/Profile'
import Student from './pages/student/Student'

import './App.css'

function App() {
  const [userDetail, setUserDetail] = useState()

  const user = JSON.parse(localStorage.getItem('loginSurge'))
  
  useLayoutEffect(() => {
    if(user) {
      setUserDetail(user)
    } 
  }, [])

  return (
    <Router>
      {!userDetail ? <Redirect to = '/login'/> :
        userDetail.accountType === 'Student' && userDetail.status === false ? <Redirect to = '/profile' /> :
        userDetail.accountType === 'Student' && userDetail.status === true ? <Redirect to = '/home' />  :
        <Redirect to = '/adminhome' /> 
      }
      {userDetail && <Topbar setAccount = {(detail) => setUserDetail(detail)} />}
      <div className = 'container'>
        <Switch>
          {!userDetail && <Route exact path = '/login' component = {() => 
            <Login setAccount = {(detail) => setUserDetail(detail)} />}  
          /> }

          <Route exact path = '/home' component = {Student} />
          <Route exact path = '/adminhome' component = {Admin} />
          <Route exact path = '/profile' component = {() => 
            <Profile setAccount = {(detail) => setUserDetail(detail)} />} 
          />
          <Route path = '*' component = {Login} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;

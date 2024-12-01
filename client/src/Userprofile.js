import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

function Userprofile(props) {
    const nav = useNavigate()
  return (
    <div className='userpro'>
      <h1>This is the dashboard of user: {props.username}</h1>
      <button onClick={()=>{
        localStorage.removeItem('user')
        nav('/')
        
      }}>Logout</button>
    </div>
  )
}

export default Userprofile

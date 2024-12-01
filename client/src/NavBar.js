import React from 'react'
import './NavBar.css';
import { Link } from 'react-router-dom';

function NavBar(props) {


  return (
    <div className='Navigation'>
        <Link to="/"> <h2>ChatAPP</h2></Link>
       <ul>
       <Link to="/profile">
        {props.login ? `Hello ${props.login}` : ""}
        </Link>
        <div className={props.login ? "displaynone":"registerlogin"}>
        <Link to="/register">
        Register
        </Link>
        <Link to="/login">
        Login
        </Link>
        </div>
        
       </ul>
    </div>
  )
}

export default NavBar

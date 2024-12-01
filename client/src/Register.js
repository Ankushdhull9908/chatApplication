import React, { useState } from 'react'
import './Register.css'

function Register() {

  const [name,setname] = useState('')
  const [email,setemail] = useState('')
  const [password,setpassword] = useState('')

  function handleSubmit(e){
   e.preventDefault()

   const userData = {
    name: name,
    email:email,
    password:password
   }

   try {
    fetch('http://localhost:3200/register', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"  // Correct header format
        },
        body: JSON.stringify(userData)  // Stringify the user data object
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        
    })
    .catch(error => {
        console.error('Error:', error);
    });
} catch (error) {
    console.log(error);
}
   
  }
  return (
    <div className='register'>
      <h1>Register</h1>
      <form>
      Name:<input type='text' value={name} onChange={(e)=>{
         setname(e.target.value)
      }}/>
      Email:<input type='email' value={email} onChange={(e)=>{
         setemail(e.target.value)
      }}/>
      Password:<input type='password' value={password} onChange={(e)=>{
         setpassword(e.target.value)
      }}/>

      <button type='submit' onClick={(e)=>{
        handleSubmit(e)



      }}>register</button>

      </form>
    </div>
  )
}

export default Register

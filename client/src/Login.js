import React, { useState } from 'react'

function Login(props) {

    
    const [email,setemail] = useState('')
    const [password,setpassword] = useState('')
  
    function handleSubmit(e){
     e.preventDefault()
  
     const userData = {
     
      email:email,
      password:password
     }
     console.log(userData)
  
     try {
      fetch('http://localhost:3200/login', {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(userData) , 
          credentials: "include"
      })
      .then(response => response.json())
      .then(data => {
          console.log('Success:', data);
          localStorage.setItem('user',data.name)
          
      })
      .catch(error => {
          console.error('Error:', error);
      });
  } catch (error) {
      console.log(error);
  }
     
    }
  return (
    <div className='userpro'>
      <h1>Login</h1>
      <form>
     
      Email:<input type='email' value={email} onChange={(e)=>{
         setemail(e.target.value)
      }}/>
      Password:<input type='password' value={password} onChange={(e)=>{
         setpassword(e.target.value)
      }}/>

      <button type='submit' onClick={(e)=>{
        handleSubmit(e)



      }}>Login</button>

      </form>
    </div>
  )
}

export default Login

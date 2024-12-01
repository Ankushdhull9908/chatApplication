import React from 'react'
import {useParams } from 'react-router-dom'
import Allcontacts from './Allcontacts'



function Contactprofile(props) {
    const {id} = useParams()
    
    let name = Allcontacts[id].name
    const idtodelete = [name,props.login]

    function handleDeleteallchats(){
      
         try{
           fetch(`http://localhost:3200/deletechat/${idtodelete}`,{
            method:"POST",
            headers:{
              "Content-Type": "application/json",
            }
           })
         }catch(error){

         }

    }

  return (
    <div className='userpro'>
      <img src={Allcontacts[id].url} alt='error'/>
      <p>This is the profile of {name}</p>
      <p>Delete all chats with {name}?
        <button onClick={()=>{
            handleDeleteallchats()
        }}>Delete all chats</button>
      </p>
    </div>
  )
}

export default Contactprofile

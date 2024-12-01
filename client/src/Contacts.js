import React from 'react'
import { useNavigate } from 'react-router-dom'


export default function Contacts(props) {

    const navigate = useNavigate()

    
   // console.log(filtered)
  return (
    <div className={props.login?"users":"displaynone"}>
        {props.contactuser.map((i,index) => (
          <div className="user1" key={index}>
            <img src={i.url} alt="error" />
            <div className='namelastmessage'>
            <p className="username" onClick={()=>navigate(`/user/${index}`)}>
              {i.name} 
            </p>
           
            </div>
            
            
            
          </div>
        ))}
      </div>
  )
}



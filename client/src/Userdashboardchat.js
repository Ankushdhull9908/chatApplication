import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import io from 'socket.io-client';

import Allcontacts from './Allcontacts'


const SOCKET_URL = "http://localhost:3200";
const socket = io(SOCKET_URL);


export default function Userdashboardchat(props) {
  const [receivedMsg, setReceivedMsg] = useState([]);
  const [msg, setMsg] = useState('');
  let { id } = useParams();
 
  
  console.log(id)
  let name = Allcontacts[id].name
  
  
  const nav = useNavigate()
  
  const conversationId = [name, props.login].sort().join("-");
  console.log(conversationId)

  // Load previous messages from localStorage for the current chat
  useEffect(() => {
    setReceivedMsg([]);
    async function loadMessagesFromDB() {
      try {
        const response = await fetch(`http://localhost:3200/allchats/${[conversationId]}`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json(); 
        setReceivedMsg(data)
        console.log(receivedMsg)

      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    }
    loadMessagesFromDB()
    socket.emit('user-joined', props.login);
  }, [id, props.login]);
  // Listen for broadcast messages and update the chat history
  useEffect(() => {
    socket.on('broadcastmsg', (msg, recp) => {
      alert(msg)
      
      const newMessage = { message:msg, receiver:recp};
      setReceivedMsg(prevMsgs => {
        const updatedMsgs = [...prevMsgs, newMessage];
        return updatedMsgs;
      });
    });

    return () => {
      socket.off('broadcastmsg'); // Clean up listener when component unmounts
    };
  }, [id,receivedMsg]);

  async function handleSubmit (e){
    e.preventDefault();
    const message = {conversationId:conversationId,sender:props.login,receiver:id,time: new Date(),message:msg}
    if(msg===""){
      return
    }

    try{
       await fetch('http://localhost:3200/message', {
        method: "POST", // HTTP method
        headers: {
          "Content-Type": "application/json", // Inform the server the data format
        },
        body: JSON.stringify(message), // Send the data as a JSON string
      });

    }catch(error){
      console.log(error)
    }

    setReceivedMsg(prevMsgs => {const updatedMsgs = [...prevMsgs, message];
    return updatedMsgs;});
    socket.emit('msgfromclient', msg, id,props.login);
    setMsg(''); // Clear input after sending
  }

  return (
    <div className="chatarea">
      <div className='aboutuserprofile'>
      <img src={Allcontacts[id].url} alt='error' onClick={()=>{
          nav(`/contactprofile/${id}`)
        }}/>
      
        <h4 onClick={()=>{
          nav(`/contactprofile/${id}`)
        }}>{Allcontacts[id].name}</h4>
        <div className='videoandcall'>
          <button onClick={()=>alert("Feature not available yet")}>Call</button>
        <button onClick={()=>alert("Feature not available yet")}>video call</button>
        </div>
        
      </div>
      <div className="chat">
        
        {receivedMsg.map((i, index) => (
          <div
            key={index}
            className={i.sender === props.login ? 'rghtmsg' : 'leftmsg'}
          >
            <p>{i.sender===props.login?"You":i.sender}: {i.message}</p>
          </div>
        ))}
      </div>

      <div className="sendmsg">
        <form id="form1" onSubmit={handleSubmit}>
          <input
            type="text"
            value={msg}
            placeholder={`start conversation with ${Allcontacts[id].name}`}
            onChange={(e) => setMsg(e.target.value)} // Update message as user types
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

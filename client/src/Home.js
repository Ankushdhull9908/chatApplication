import React, { useEffect, useState } from 'react';
import './Home.css';
import io from 'socket.io-client';
import Chatsection from './Chatsection';
import { useNavigate } from 'react-router-dom';


const SOCKET_URL = "http://localhost:3200";
const socket = io(SOCKET_URL);
export default function Home(props) {
  const nav = useNavigate()
  


  const filtered = [];

  function handleSubmit(){


  }
  

  return (
      <div className="chatarea">
        <h1>{props.username?<img src='chat-app.jpg'/>:<img src='chat-app.jpg'/>}</h1>
        
      </div>
    
  );
}

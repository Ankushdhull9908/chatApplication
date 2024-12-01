
import './App.css';
import {Navigate, Route,Routes} from 'react-router-dom'
import Home from './Home';
import NavBar from './NavBar';
import Register from './Register';
import Login from './Login';
import { useEffect, useState } from 'react';
import Userdashboardchat from './Userdashboardchat';
import Chatsection from './Chatsection';
import Contacts from './Contacts';
import './Container.css';
import Userprofile from './Userprofile';
import Contactprofile from './Contactprofile';
import AllContacts from './Allcontacts'


function App() {
  const [user1,setUSer] = useState('')
  useEffect(()=>{
    const user = localStorage.getItem("user")
    setUSer(user)
    console.log(user)
    
  },[user1])

    
    const filtered = AllContacts
    

 
  return (
    <div className="App">
     
      <NavBar login={user1}/>
      <div className='container'>
        <Contacts contactuser={filtered} login={user1} />
        <Routes>
        <Route path='/profile' element={<Userprofile username={user1}/>}/>
        <Route path='/' element={<Home username={user1}/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='*' element={<Navigate to="/"/>}/>
        <Route path='/login' element={<Login/>} />
        <Route path='/user/:id' element={<Userdashboardchat login={user1}/>}/>
        <Route path='/contactprofile/:id' element={<Contactprofile login={user1}/>}/>
        <Route path='/chats' element={<Chatsection/>}/>
        

        </Routes>
      </div>
      
    </div>
  );
}

export default App;

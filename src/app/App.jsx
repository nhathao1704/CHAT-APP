import { useEffect } from 'react';
import {Outlet} from 'react-router-dom';
import Header from '../component/header.jsx';
import IncomingCallPopup from '../component/call/IncomingCallPopup.jsx';
import socket from '../socket/socket.js';
import "../styles/App.css"

const App = () => {
  
  useEffect(() => {
   
    const userId = localStorage.getItem("userId");
    if (userId) {
      socket.emit("register", userId);
      console.log("Socket registered with userId:", userId);
    }
  }, []);

  return (
    <div className="layout">
      <Header />
      <IncomingCallPopup />
      <Outlet />
    </div>
  );
};

export default App;

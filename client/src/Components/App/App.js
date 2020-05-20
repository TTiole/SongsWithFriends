import React from 'react';
import socketIOClient from "socket.io-client"
import {CONNECT} from 'helpers/socket_events'
import './App.css'

class App extends React.Component {
  componentDidMount() {
    this.socket = socketIOClient("http://localhost:8000")
    
  }
  
  render() {
    return (
      <div></div>
    );
  }
}

export default App

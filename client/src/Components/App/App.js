import React from 'react';
import socketIOClient from "socket.io-client"
import './App.css'

import {CONNECT} from 'helpers/socket_events.js'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: socketIOClient("http://localhost:8000"),
      userID: null
    }
  }

  componentDidMount() {
    this.state.socket.on(CONNECT, () => this.setState({ userID: this.state.socket.id }))
  }
  
  render() {
    console.log(this.state.socket.id)
    return (
      <div>
        <a href={`http://localhost:8000/login?userID=${this.state.userID}`} target="_blank" rel="noopener noreferrer">Try sign in</a>
      </div>
    );
  }
}

export default App

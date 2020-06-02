import React, { useRef } from 'react';
import { connect } from 'react-redux'
import './Room.css'
import Popup from "../Popup/Popup"

import {
  CREATE,
  JOIN,
} from "helpers/socket_events.js";

const Room = (props) => {
  // We can use useCallback for optimization in the future
  const joinRef = useRef();
  // Sends CREATE event
  const createRoom = () => props.socket.emit(CREATE);

  // Sends JOIN event
  const joinRoom = () => props.socket.emit(JOIN, joinRef.current.value);
  return (
    <div id="room-container">
      {props.guest ? null : <button onClick={createRoom}>Create room</button>}
      <input type="text" placeholder="Enter Room#" ref={joinRef} />
      <button onClick={joinRoom}> Join room</button>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    socket: state.userReducer.socket,
    guest: state.userReducer.guest
  }
}

export default connect(mapStateToProps, null)(Room)
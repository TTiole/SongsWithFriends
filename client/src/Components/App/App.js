import React from "react";

import { connect } from 'react-redux'

import { connectUser, authenticateUser, createRoomUserSuccess, leaveRoom, destroyRoom, destroyedRoom, refreshDevices, setDevice } from '../../Redux/Actions/userAction'
import { joinRoomPlaybackSuccess, createRoomSuccess, modifyPlayback } from '../../Redux/Actions/playbackAction'

import "./App.css";
import io from "socket.io-client";

import Main from "../Layout/Main/Main";
import Slider from '../Slider/Slider'

import {
  CONNECT,
  CREATE,
  ERROR,
  JOIN,
  LEAVE,
  DESTROY,
  DESTROYED,
  PLAY,
  SKIP,
  PAUSE,
  PREVIOUS,
  QUEUE_ADD,
  QUEUE_REMOVE,
  QUEUE_REORDER,
  JUMP,
  UPDATE_PLAYBACK
} from "helpers/socket_events.js";
import { server } from "helpers/constants.js"

class App extends React.Component {
  constructor(props) {
    super(props);
    this.joinRef = React.createRef();
    // this.newInputRef = React.createRef();
    // this.newInputRef.current.value
  }

  componentDidMount() {
    const queryString = window.location.search;
    if (queryString !== "") {
      //! UPON FIRST ENTERING THE SITE, THIS CODE WILL NOT RUN
      const urlParams = new URLSearchParams(queryString);
      if (urlParams.has("code")) {
        //! If this code is running, the user has logged in through spotify and authorized us to use their information
        // If that's the case, we'll set up a socket connection. Upon success, we will call socketEstablished
        let socket = io(server)
        this.props.connectUser(socket);
        this.setupSocketListeners(socket, urlParams.get("code"))
      }
    }
  }
  // Sends CREATE event
  createRoom = () => this.props.socket.emit(CREATE);

  // Sends JOIN event
  joinRoom = () => this.props.socket.emit(JOIN, this.joinRef.current.value);

  // Sends LEAVE event
  leaveRoom = () => this.props.socket.emit(LEAVE);

  // Sends DESTROY event
  destroyRoom = () => this.props.socket.emit(DESTROY);

  // Sends play event
  resume = () => this.props.socket.emit(PLAY);

  // Sends pause event
  pause = () => this.props.socket.emit(PAUSE);

  // Sends skip event
  skip = () => this.props.socket.emit(SKIP);

  // Sends previous event
  previous = () => this.props.socket.emit(PREVIOUS);

  // Jump to point in song
  jumpTo = (e) => this.props.socket.emit(JUMP, e.target.value*1000);

  // Socket connection has been established
  socketEstablished = (code) => () => {
    // Get the user id from the socket
    console.log("Socket established")
    const userID = this.props.socket.id;
    this.props.authenticateUser(code, userID);
    window.history.replaceState(null, "", window.location.href.split("?")[0]);
  };

  setupSocketListeners = (socket, code) => {
    // On connection established, authenticate user
    console.log(server);
    socket.on(CONNECT, this.socketEstablished(code))
    if (socket.connected)
      this.socketEstablished(code);
    // On error, console.error the msg
    socket.on(ERROR, (msg) => console.error(msg));
    // On create, let the client know that the user is a host
    socket.on(CREATE, (playback, roomID) => {
      this.props.createRoom(roomID);
      this.props.createRoomSuccess(playback);
      console.log(`Successfully created room ${roomID}`);
    });
    // On join, let the client know that the user is a member
    socket.on(JOIN, (playback) => {
      console.log(playback);
      this.props.joinRoomPlaybackSuccess(playback)
      console.log(`Successfully joined room`);
    });

    // On leave, let the client know that the user is no longer a member
    socket.on(LEAVE, (id) => {
      this.props.leaveRoom();
      console.log(`Successfully left ${id}`);
    });

    // On destroy room, let the client know you're no longer host
    socket.on(DESTROY, (id) => {
      this.props.destroyRoom();
      console.log(`Successfully destroyed ${id}`);
    });

    // On room destroyed, let the client know you're no longer a member of that room
    socket.on(DESTROYED, (id) => {
      this.props.destroyedRoom();
      console.log(`Room ${id} has been destroyed`);
    });

    socket.on(PLAY, (playback) => {
      this.props.modifyPlayback(playback)
    });

    socket.on(PAUSE, (playback) => {
      this.props.modifyPlayback(playback)
    });

    socket.on(SKIP, (playback) => {
      this.props.modifyPlayback(playback)
    });

    socket.on(PREVIOUS, (playback) => {
      this.props.modifyPlayback(playback)
    });

    socket.on(QUEUE_ADD, (playback) => {
      this.props.modifyPlayback(playback)
    });

    socket.on(QUEUE_REMOVE, (playback) => {
      this.props.modifyPlayback(playback)
    });

    socket.on(QUEUE_REORDER, (playback) => {
      this.props.modifyPlayback(playback)
    });
    socket.on(UPDATE_PLAYBACK, (playback) => {
      this.props.modifyPlayback(playback)
    });
  };

  songFinished = () => {
    if(this.props.host)
      this.props.socket.emit(UPDATE_PLAYBACK)
  }

  render() {
    // Display if not logged in
    if (!this.props.loggedIn)
      return (
        <div>
          <a href={`http://localhost:8000/login?userID=${this.props.userID}`}>
            Try sign in
          </a>
        </div>
      );
    // Display if you are logged in
    return (
      <div>
        {/* Displays if neither host or member */}
        {!this.props.host && !this.props.member ? (
          <React.Fragment>
            <button onClick={this.createRoom}>Create room</button>
            <input type="text" ref={this.joinRef} />
            <button onClick={this.joinRoom}> Join room</button>
          </React.Fragment>
        ) : null}
        {/* Displays if host */}
        {this.props.host ? (
          <button onClick={this.destroyRoom}>Destroy room</button>
        ) : null}
        {/* Displays if member */}
        {this.props.member ? (
          <button onClick={this.leaveRoom}>Leave room</button>
        ) : null}
        {/* List the playback devices and onclick, set them */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          {this.props.user.playbackDevices.map((device) => (
            <button key={device.id} onClick={() => this.props.setDevice(device.id, this.props.userID)}>
              {device.name} {device.is_active ? "(Active)" : ""}
            </button>
          ))}
        </div>
        {/* Displays when either member or host */}
        {(this.props.member || this.props.host) && this.props.playback ? (
          <React.Fragment>
            <button onClick={() => this.props.refreshDevices(this.props.userID)}>Refresh Devices</button>
            {this.props.playback.playing ? (
              <button onClick={this.pause}>Pause</button>
            ) : (
                <button onClick={this.resume}>Resume</button>
              )}

            <button onClick={this.skip}>Skip</button>
            <button onClick={this.previous}>Previous</button>
            <Slider max={this.props.playback.currentSongDuration} maxCallback={this.songFinished} initialValue={this.props.playback.initialPosition} position={this.props.playback.initialPosition} stop={!this.props.playback.playing} autoincrement callback={this.jumpTo} instanceID={this.props.playback.currentSong} />
            <button onClick={this.jumpTo}>Jump To</button>

            <h1>Now playing: {this.props.playback.currentSong}</h1>
            {/* <input type="text" ref={this.newInputRef}/> */}
            <Main />
          </React.Fragment>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    socket: state.userReducer.socket,
    userID: state.userReducer.userID,
    loggedIn: state.userReducer.loggedIn,
    member: state.userReducer.member,
    host: state.userReducer.host,
    user: state.userReducer.user,
    playback: state.playbackReducer.playback
  }
}

const mapDispatchToProps = dispatch => {
  return {
    connectUser: (socket) => dispatch(connectUser(socket)),
    leaveRoom: () => dispatch(leaveRoom()),
    createRoom: (roomID) => dispatch(createRoomUserSuccess(roomID)),
    destroyRoom: () => dispatch(destroyRoom()),
    destroyedRoom: () => dispatch(destroyedRoom()),
    authenticateUser: (code, userID) => dispatch(authenticateUser(code, userID)),
    joinRoomPlaybackSuccess: (playback) => dispatch(joinRoomPlaybackSuccess(playback)),
    createRoomSuccess: (playback) => dispatch(createRoomSuccess(playback)),
    modifyPlayback: (playback) => dispatch(modifyPlayback(playback)),
    refreshDevices: (userID) => dispatch(refreshDevices(userID)),
    setDevice: (deviceID, userID) => dispatch(setDevice(deviceID, userID))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

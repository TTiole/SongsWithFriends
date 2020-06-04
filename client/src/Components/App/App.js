import React from "react";

import { connect } from 'react-redux'

import { connectUser, authenticateUser, createRoomUserSuccess, leaveRoom, destroyRoom, destroyedRoom, guestLogin } from '../../Redux/Actions/userAction'
import { joinRoomPlaybackSuccess, createRoomSuccess, modifyPlayback, toggleMute } from '../../Redux/Actions/playbackAction'

import "./App.css";
import io from "socket.io-client";

import Main from "../Layout/Main/Main";
import Header from "../Layout/Header/Header"
import Loader from '../Loader/Loader'



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
  UPDATE_PLAYBACK,
  SET_VOLUME
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

  // Socket connection has been established
  socketEstablished = (socket, code) => () => {
    // Get the user id from the socket
    console.log("Socket established")
    const userID = socket.id;
    this.props.authenticateUser(code, userID);
    window.history.replaceState(null, "", window.location.href.split("?")[0]);
  };

  setupSocketListeners = (socket, code = null) => {
    // On connection established, authenticate user
    console.log(`Server: ${server}`);
    socket.on(CONNECT, code !== null ? this.socketEstablished(socket, code) : this.props.guestLogin)
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

    socket.on(SET_VOLUME, percentage => {
      this.props.toggleMute(percentage === 0);
    })
  };

  guestLogin = () => {
    let socket = io(server)
    this.props.connectUser(socket);
    this.setupSocketListeners(socket)
  }

  render() {
    return (
      <div id="app">
        <Header />
        <Main guestLogin={this.guestLogin} />
        <Loader active={this.props.loading} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.loadingReducer.loading
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
    guestLogin: () => dispatch(guestLogin()),
    toggleMute: mute => dispatch(toggleMute(mute))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

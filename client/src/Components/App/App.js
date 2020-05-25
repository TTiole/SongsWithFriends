import React from "react";
import io from "socket.io-client";
import "./App.css";

import Playlist from "../Playlist.jsx";
import TrackCell from "../TrackCell.jsx";

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
  PREVIOUS
} from "helpers/socket_events.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: null,
      userID: null,
      loggedIn: false,
      member: false,
      host: false,
      user: null,
      playback: null,
      roomID: ""
    };
    this.joinRef = React.createRef();
  }

  componentDidMount() {
    const queryString = window.location.search;
    if (queryString !== "") {
      //! UPON FIRST ENTERING THE SITE, THIS CODE WILL NOT RUN
      const urlParams = new URLSearchParams(queryString);
      if (urlParams.has("code")) {
        //! If this code is running, the user has logged in through spotify and authorized us to use their information
        // If that's the case, we'll set up a socket connection. Upon success, we will call socketEstablished
        this.setState(
          { socket: io("http://localhost:8000", {reconnection: false}) },
          () => {
            this.state.socket.on(
              CONNECT,
              this.socketEstablished(urlParams.get("code"))
            );
          }
        );
      }
    }
  }

  // Sends CREATE event
  createRoom = () => this.state.socket.emit(CREATE);

  // Sends JOIN event
  joinRoom = () => this.state.socket.emit(JOIN, this.joinRef.current.value);

  // Sends LEAVE event
  leaveRoom = () => this.state.socket.emit(LEAVE);

  // Sends DESTROY event
  destroyRoom = () => this.state.socket.emit(DESTROY);

  // Sends play event
  resume = () => this.state.socket.emit(PLAY);

  // Sends pause event
  pause = () => this.state.socket.emit(PAUSE);

  // Sends skip event
  skip = () => this.state.socket.emit(SKIP);

  // Sends previous event
  previous = () => this.state.socket.emit(PREVIOUS);

  // Sets the user's playback device
  setPlaybackDevice = (deviceID) => e => fetch(`http://localhost:8000/setDevice?userID=${this.state.userID}`, {
    method: "POST",
    headers: {
      'Content-Type':"application/json"
    },
    body: JSON.stringify({
      device_id: deviceID
    })
  }).then(resp => resp.json()).then(data => {
    this.setState({ user: data });
    console.log("Successfully set playback device")
  }).catch(err => console.error(err))

  refreshDevices = e => fetch(`http://localhost:8000/refreshDevices?userID=${this.state.userID}`)
  .then(resp => resp.json()).then(data => {
    this.setState({ user: data });
    console.log("Successfully refreshed playback devices")
  }).catch(err => console.error(err))

  // Socket connection has been established
  socketEstablished = (code) => () => {
    // Get the user id from the socket
    const userID = this.state.socket.id;
    // Set it to the client state
    this.setState({ userID: userID });
    // Let the server know that the user has authorized our access, and send the code so the server can generate a token
    fetch(`http://localhost:8000/authSuccess?userID=${userID}&code=${code}`)
      .then((resp) => resp.json())
      .then((data) => {
        // At this point, login stuff is finished and the user is fully logged in
        this.setState({ loggedIn: true, user: data });
      })
      .catch((err) => console.error(err));
    // Get rid of the query parameters since we're done with them, but don't refresh page
    window.history.replaceState(null, "", window.location.href.split("?")[0]);
    // Set up the socket listeners
    this.setupSocketListeners();
  };

  setupSocketListeners = () => {
    // On error, console.error the msg
    this.state.socket.on(ERROR, (msg) => console.error(msg));
    // On create, let the client know that the user is a host
    this.state.socket.on(CREATE, (playback, roomID) => {
      this.setState({ host: true, playback, roomID});
      console.log(`Successfully created room ${roomID}`);
    });
    // On join, let the client know that the user is a member
    this.state.socket.on(JOIN, (playback) => {
      this.setState({ member: true, playback});
      console.log(`Successfully joined room`);
    });

    // On leave, let the client know that the user is no longer a member
    this.state.socket.on(LEAVE, (id) => {
      this.setState({ member: false });
      console.log(`Successfully left ${id}`);
    });

    // On destroy room, let the client know you're no longer host
    this.state.socket.on(DESTROY, (id) => {
      this.setState({ host: false });
      console.log(`Successfully destroyed ${id}`);
    });

    // On room destroyed, let the client know you're no longer a member of that room
    this.state.socket.on(DESTROYED, (id) => {
      this.setState({ member: false });
      console.log(`Room ${id} has been destroyed`);
    });

    this.state.socket.on(PLAY, (playback) => {
      this.setState({ playback  });
    })

    this.state.socket.on(PAUSE, (playback) => {
      this.setState({ playback  });
    })
  };

  render() {
    // Display if not logged in
    if (!this.state.loggedIn)
      return (
        <div>
          <a href={`http://localhost:8000/login?userID=${this.state.userID}`}>
            Try sign in
          </a>
          <Playlist />
        </div>
      );
    // Display if you are logged in
    return (
      <div>
        <a href={`http://localhost:8000/playlists?userID=${this.state.userID}`}>
          Try getting playlists
        </a>
        <br />
        <a href={`http://localhost:8000/allTracks?userID=${this.state.userID}`}>
          Try getting all the tracks in that playlist
        </a>
        <br />
        <a href={`http://localhost:8000/search?userID=${this.state.userID}`}>
          Try search with hardcoded search keyword
        </a>

        {/* Displays if neither host or member */}
        {!this.state.host && !this.state.member ? (
          <React.Fragment>
            <button onClick={this.createRoom}>Create room</button>
            <input type="text" ref={this.joinRef} />
            <button onClick={this.joinRoom}> Join room</button>
          </React.Fragment>
        ) : null}
        {/* Displays if host */}
        {this.state.host ? (
          <button onClick={this.destroyRoom}>Destroy room</button>
        ) : null}
        {/* Displays if member */}
        {this.state.member ? (
          <button onClick={this.leaveRoom}>Leave room</button>
        ) : null}
        {/* List the playback devices and onclick, set them */}
        <div style={{display: "flex", flexDirection:"column", alignItems:"flex-start"}}>
          {this.state.user.playbackDevices.map(device => <button key={device.id} onClick={this.setPlaybackDevice(device.id)}>{device.name} {device.is_active ? "(Active)":""}</button>)}
        </div>
        {/* Displays when either member or host */}
        {this.state.member || this.state.host ? (
          <React.Fragment>
            <button onClick={this.refreshDevices}>Refresh Devices</button>
            {this.state.playback.playing ? <button onClick={this.pause}>Pause</button>:<button onClick={this.resume}>Resume</button>}
            
            <button onClick={this.skip}>Skip</button>
            <button onClick={this.previous}>Previous</button>

          </React.Fragment>
        ):null}
      </div>
    );
  }
}

export default App;

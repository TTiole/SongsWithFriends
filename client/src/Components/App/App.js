import React from "react";
import socketIOClient from "socket.io-client";
import "./App.css";

import { CONNECT, CREATE, ERROR, JOIN } from "helpers/socket_events.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: null,
      userID: null,
      loggedIn: false,
    };
    this.joinRef = React.createRef();
  }

  componentDidMount() {
    const queryString = window.location.search;
    if (queryString !== "") {
      const urlParams = new URLSearchParams(queryString);
      if (urlParams.has("code")) {
        // User is coming back from a successful login
        this.setState(
          { socket: socketIOClient("http://localhost:8000") },
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

  createRoom = () => this.state.socket.emit(CREATE);

  joinRoom = () => this.state.socket.emit(JOIN, this.joinRef.current.value);

  socketEstablished = (code) => () => {
    const userID = this.state.socket.id;
    this.setState({ userID: userID, loggedIn: true });
    fetch(`http://localhost:8000/authSuccess?userID=${userID}&code=${code}`)
      .then((resp) => resp.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
    // Get rid of the query parameters since we're done with them, but don't refresh page
    window.history.replaceState(null, "", window.location.href.split("?")[0]);
    this.setupSocketListeners();
  };

  setupSocketListeners = () => {
    this.state.socket.on(ERROR, (msg) => console.error(msg));
    this.state.socket.on(CREATE, (id) =>
      console.log(`Successfully created room ${id}`)
    );
    this.state.socket.on(JOIN, () => console.log(`Successfully joined room`));
  };

  render() {
    if (!this.state.loggedIn)
      return (
        <div>
          <a href={`http://localhost:8000/login?userID=${this.state.userID}`}>
            Try sign in
          </a>
        </div>
      );
    return (
      <div>
        <a href={`http://localhost:8000/playlists?userID=${this.state.userID}`}>
          Try getting playlists
        </a>
        <a href={`http://localhost:8000/allTracks?userID=${this.state.userID}`}>
          Try getting all the tracks in this playlist
        </a>
        <button onClick={this.createRoom}>Create room</button>
        <input type="text" ref={this.joinRef} />
        <button onClick={this.joinRoom}> Join room</button>
      </div>
    );
  }
}

export default App;

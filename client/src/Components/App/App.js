import React from "react";
import socketIOClient from "socket.io-client";
import "./App.css";

import { CONNECT } from "helpers/socket_events.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: null,
      userID: null,
      loggedIn: false,
    };
  }

  componentDidMount() {
    const queryString = window.location.search;
    if (queryString !== "") {
      const urlParams = new URLSearchParams(queryString);
      if (urlParams.has("code")) {
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

  socketEstablished = (code) => () => {
    const userID = this.state.socket.id;
    this.setState({ userID: userID });
    fetch(`http://localhost:8000/authSuccess?userID=${userID}&code=${code}`)
      .then((resp) => resp.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
    // Get rid of the query parameters since we're done with them, but don't refresh page
    window.history.pushState(null, "", window.location.href.split("?")[0]);
  };

  render() {
    return (
      <div>
        <a href={`http://localhost:8000/login?userID=${this.state.userID}`}>
          Try sign in
        </a>

        <a href={`http://localhost:8000/playlists?userID=${this.state.userID}`}>
          Try getting playlists
        </a>
      </div>
    );
  }
}

export default App;

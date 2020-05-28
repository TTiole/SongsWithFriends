import React, { useState, useEffect } from "react";
import "./Main.css";

import Playlist from "../../Playlist/Playlist.jsx";
import PlayerBar from "../../PlayerBar/PlayerBar.jsx";

const Main = (props) => {
  const [playlists, setPlaylists] = useState([]);
  console.log(props);

  useEffect(() => {
    fetch(`http://localhost:8000/playlists?userID=${props.user.id}`, {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((playlists) => {
        setPlaylists(playlists);
      })
      .catch((err) => console.error(err));
  }, []);
  if (playlists.length === 0) return <div>Loading...</div>;
  else {
    return (
      <main id="main-container">
        <div className="container-top">
          <Playlist user={props.user} playlist={playlists[3]} />
          <Playlist user={props.user} playlist={playlists[3]} />
          <button>Invite</button>
        </div>

        <PlayerBar
          track="Attention"
          artist="Charlie Puth · Voicenotes"
          duration="3:31"
        />
      </main>
    );
  }
};

export default Main;

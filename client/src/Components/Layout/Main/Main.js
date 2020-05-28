import React from "react";
import "./Main.css";

import Playlist from "../../Playlist/Playlist.jsx";
import PlayerBar from "../../PlayerBar/PlayerBar.jsx";

const Main = (props) => {
  console.log(props);
  return (
    <main id="main-container">
      <div className="container-top">
        <Playlist user={props.user} />
        <button>Invite</button>
      </div>

      <PlayerBar
        track="Attention"
        artist="Charlie Puth · Voicenotes"
        duration="3:31"
      />
    </main>
  );
};

export default Main;

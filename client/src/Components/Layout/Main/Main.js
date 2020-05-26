import React from "react";
import "./Main.css"

import Playlist from "../../Playlist/Playlist.jsx";
import PlayerBar from "../../PlayerBar/PlayerBar.jsx";

const Main = () => {
  return (
    <main id="main-container">
      <div className="container-top">
        <Playlist />
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

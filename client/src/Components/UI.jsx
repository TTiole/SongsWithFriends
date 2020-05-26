import React, { useState } from "react";

import Playlist from "./Playlist.jsx";
import PlayerBar from "./PlayerBar.jsx";

const UI = () => {
  return (
    <div style={Styles.mainContainer}>
      <div style={Styles.top}>
        <Playlist />
        <button style={Styles.inviteBtn}>Invite</button>
      </div>

      <PlayerBar
        track="Attention"
        artist="Charlie Puth · Voicenotes"
        duration="3:31"
      />
    </div>
  );
};

const Styles = {
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "black",
  },

  top: {
    display: "flex",
    justifyContent: "space-between",
  },

  inviteBtn: {
    borderRadius: 6,
    backgroundColor: "#1db945",
    justifyContent: "center",
    alignContent: "center",
    margin: 5,
    height: 30,
    maxHeight: 30,
    width: 60,
    maxWidth: 60,
  },
};

export default UI;

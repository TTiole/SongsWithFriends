import React, { useState } from "react";

const PlayerBar = (props) => {
  let curTrack = "Attention";
  return (
    <div style={Styles.playerContainer}>
      <div style={Styles.curTrackInfo}>
        <div>Currently Playing:</div>
        <div style={Styles.name}>{props.track}</div>
        <div style={Styles.artistAlbum}>{props.artist}</div>
      </div>
      <div style={Styles.ctrlStatus}>
        {" "}
        x x 1:05 ------------------------- 3:37
      </div>
    </div>
  );
};

const Styles = {
  playerContainer: {
    display: "flex",
    flexDirection: "column",
    margin: 5,

    backgroundColor: "gray",
  },

  curTrackInfo: {
    display: "flex",
    margin: 5,
  },

  name: {
    display: "flex",
    marginRight: 15,
    marginLeft: 15,
    fontFamily: "OpenSans",
    fontWeight: 700,
  },

  artistAlbum: {
    display: "flex",
    fontFamily: "OpenSans",
    fontWeight: 400,
  },

  duration: {
    display: "flex",
    margin: 5,
    fontFamily: "OpenSans",
    fontWeight: 400,
    backgroundColor: "green",
  },

  ctrlStatus: {
    display: "flex",
    margin: 5,
    backgroundColor: "red",
  },
};

export default PlayerBar;

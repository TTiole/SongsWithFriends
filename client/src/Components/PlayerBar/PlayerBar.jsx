import React, { useState } from "react";

import "./PlayerBar.css"

import Typography from '../Typography/Typography'

const PlayerBar = (props) => {
  // let curTrack = "Attention";
  return (
    <div className="player-container">
      <div className="track-info">
        <Typography>Currently Playing:</Typography>
        <Typography margin="0 15px" bold>{props.track}</Typography>
        <Typography>{props.artist}</Typography>
      </div>
      <div className="player-control-status">
        {" "}
        x x 1:05 ------------------------- 3:37
      </div>
    </div>
  );
};

export default PlayerBar;

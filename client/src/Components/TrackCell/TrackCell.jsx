import React, { useEffect } from "react";

import Typography from "../Typography/Typography";
import "./TrackCell.css";

const TrackCell = (props) => {
  return (
    <div className="track-container" onClick={props.addSong(props.track)}>
      <div className="track-container-info">
        <Typography bold>{props.track.name}</Typography>
        <Typography>{props.track.artists}</Typography>
      </div>
      <Typography margin="5px" additionalStyles={{ backgroundColor: "green" }}>
        {props.duration}
      </Typography>
    </div>
  );
};

export default TrackCell;

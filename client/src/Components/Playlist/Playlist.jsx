import React, { useState } from "react";
import TrackCell from "../TrackCell/TrackCell.jsx";
import "./Playlist.css";

import Typography from "../Typography/Typography";

const ms2time = (ms) => {
  return new Date(ms).toISOString().slice(14, 19);
};

const Playlist = (props) => {
  const [showDelete, setShowDelete] = useState(false);
  const handleEdit = () => {
    if (showDelete === false)
      setShowDelete(true);
    else
      setShowDelete(false);
  }
  return (
    <div className="playlist-container">
      <div className="top-container">
        <Typography margin="5px" fontSize={25} bold color="#eee">
          {props.playlistName}
        </Typography>
        <button id="editBtn" onClick={handleEdit}>Edit Playlist</button>
      </div>
      <div className="tracks">
        {props.tracks.map((track) => (
          <div className="track-wrapper">
            {showDelete ? <button id="removeBtn">-</button> : null}
            <TrackCell
              key={track.id}
              duration={ms2time(track.duration_ms)}
              track={track}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlist;

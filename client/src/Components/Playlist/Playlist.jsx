import React from "react";
import TrackCell from "../TrackCell/TrackCell.jsx";
import "./Playlist.css";

import Typography from "../Typography/Typography";

const ms2time = (ms) => {
  return new Date(ms).toISOString().slice(14, 19);
};

const Playlist = (props) => {
  return (
    <div className="playlist-container">
      <Typography margin="5px" fontSize={25} bold color="#eee">
        {props.playlistName}
      </Typography>
      <div className="tracks">
        {props.tracks.map((track) => (
          <TrackCell
            key={track.id}
            duration={ms2time(track.duration_ms)}
            track={track}
            addSong={props.addSong}
            removeSong={props.removeSong}
          />
        ))}
      </div>
    </div>
  );
};

export default Playlist;

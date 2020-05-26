import React, { useState } from "react";
import TrackCell from "../TrackCell/TrackCell.jsx";
import './Playlist.css'

import Typography from '../Typography/Typography'

const Playlist = () => {
  const [tracks, setTracks] = useState([
    {
      track: "Attention",
      artist: "Charlie Puth · Voicenotes",
      duration: "3:31",
    },
    {
      track: "Lucid Dreams",
      artist: "Juice WRLD · Lucid Dreams",
      duration: "0:00",
    },
    { track: "Starboy", artist: "The Weeknd · Starboy", duration: "1:00" },
  ]);

  return (
    <div className="playlist-container">
      <Typography margin="5px" fontSize={25} bold color="#eee">Squad Playlist</Typography>
      {tracks.map((track) => (
        <TrackCell
          track={track.track}
          artist={track.artist}
          duration={track.duration}
        />
      ))}
    </div>
  );
};

export default Playlist;

import React, { useState } from "react";
import TrackCell from "./TrackCell.jsx";

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
    <div style={Styles.mainContainer}>
      <div style={Styles.platlistName}>Squad Playlist</div>
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

const Styles = {
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "55%",
    backgroundColor: "black",
  },

  playlistName: {
    display: "flex",
    fontFamily: "OpenSans",
    fontSize: 25,
    fontWeight: 700,
    color: "white",
  },
};
export default Playlist;

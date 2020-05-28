import React, { useState, useEffect } from "react";
import TrackCell from "../TrackCell/TrackCell.jsx";
import "./Playlist.css";

import Typography from "../Typography/Typography";

const ms2time = (ms) => {
  return new Date(ms).toISOString().slice(14, 19);
};

const Playlist = (props) => {
  const [tracks, setTracks] = useState([]);

  let userID = props.user.id;
  // console.log(userID);
  useEffect(() => {
    // console.log(props.user); //!TODO: WHY DOES THE USER OBJECT HERE DOESN'T HAVE PALYLISTS?
    // console.log(playlist);
    // console.log(playlists);
    let playlistName = props.playlist.name;
    return fetch(
      `http://localhost:8000/allTracks?userID=${userID}&playlistName=${playlistName}`,
      {
        method: "GET",
      }
    )
      .then((resp) => resp.json())
      .then((playlist) => {
        // console.log(playlist);
        setTracks(
          playlist.tracks.map((track) => ({
            track: track.name,
            artist: track.artists,
            duration: ms2time(track.duration_ms),
            id: track.id,
          }))
        );
      });
  }, [userID]);

  return (
    <div className="playlist-container">
      <Typography margin="5px" fontSize={25} bold color="#eee">
        {props.playlist.name}
      </Typography>
      <div className="tracks">
        {tracks.map((track) => (
          <TrackCell
            key={track.id}
            track={track.track}
            artist={track.artist}
            duration={track.duration}
          />
        ))}
      </div>
    </div>
  );
};

export default Playlist;

import React, { useState, useEffect } from "react";
import TrackCell from "../TrackCell/TrackCell.jsx";
import "./Playlist.css";

import Typography from "../Typography/Typography";

const Playlist = (props) => {
  const [tracks, setTracks] = useState([]);

  let userID = props.user.id;
  // console.log(userID);
  useEffect(() => {
    fetch(`http://localhost:8000/playlists?userID=${userID}`, {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((playlists) => {
        // console.log(props.user); //!TODO: WHY DOES THE USER OBJECT HERE DOESN'T HAVE PALYLISTS?
        // console.log(playlist);
        // console.log(playlists);
        let playlistName = playlists[3].name;
        return fetch(
          `http://localhost:8000/allTracks?userID=${userID}&playlistName=${playlistName}`,
          {
            method: "GET",
          }
        )
      })
      .then((resp) => resp.json())
      .then((playlist) => {
        // console.log(playlist);
        console.log("FF");
        setTracks(playlist.tracks.map(track => ({track: track.name, artist: track.artists, duration: "0:00", id: track.id})));
      })
      .catch((err) => console.error(err));
  }, [])

  return (
    <div className="playlist-container">
      <Typography margin="5px" fontSize={25} bold color="#eee">
        Squad Playlist
      </Typography>
      {tracks.map((track) => (
        <TrackCell
          key={track.id}
          track={track.track}
          artist={track.artist}
          duration={track.duration}
        />
      ))}
    </div>
  );
};

export default Playlist;

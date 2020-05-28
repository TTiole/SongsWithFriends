import React, { useState } from "react";
import TrackCell from "../TrackCell/TrackCell.jsx";
import "./Playlist.css";

import Typography from "../Typography/Typography";

const Playlist = (props) => {
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

  let userID = props.user.id;
  // console.log(userID);

  fetch(`http://localhost:8000/playlists?userID=${userID}`, {
    method: "GET",
  })
    .then((resp) => resp.json())
    .then((playlists) => {
      // console.log(props.user); //!TODO: WHY DOES THE USER OBJECT HERE DOESN'T HAVE PALYLISTS?
      // console.log(playlist);
      // console.log(playlists);
      let playlistName = playlists[3].name;
      fetch(
        `http://localhost:8000/allTracks?userID=${userID}&playlistName=${playlistName}`,
        {
          method: "GET",
        }
      )
        .then((resp) => resp.json())
        .then((playlist) => {
          // console.log(playlist);
          console.log("FF");
          let trackState = [];
          playlist.tracks.forEach((track) => {
            console.log(track.name);
            trackState.push({
              track: track.name,
              artist: track.artists,
              duration: "0:00",
            });
          });
          setTracks(trackState);
        });
    })
    .catch((err) => console.error(err));

  return (
    <div className="playlist-container">
      <Typography margin="5px" fontSize={25} bold color="#eee">
        Squad Playlist
      </Typography>
      {tracks.map((track) => (
        <TrackCell
          key={track.track}
          track={track.track}
          artist={track.artist}
          duration={track.duration}
        />
      ))}
    </div>
  );
};

export default Playlist;

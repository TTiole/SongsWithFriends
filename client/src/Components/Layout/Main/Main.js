import React, { useState, useEffect } from "react";
import "./Main.css";

import Playlist from "../../Playlist/Playlist.jsx";
import PlayerBar from "../../PlayerBar/PlayerBar.jsx";
import SearchOverlay from "../../SearchOverlay/SearchOverlay.jsx";

const Main = (props) => {
  const [tracks, setTracks] = useState([]);
  const [playlistNames, setPlaylistNames] = useState("");
  console.log(props);

  useEffect(() => {
    console.log("fetching....");
    fetch(`http://localhost:8000/playlists?userID=${props.user.id}`, {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((playlists) => {
        let playlistName = playlists[1].name;
        setPlaylistNames(playlistName);

        return fetch(
          `http://localhost:8000/allTracks?userID=${props.user.id}&playlistName=${playlistName}`,
          {
            method: "GET",
          }
        );
      })
      .then((resp) => resp.json())
      .then((playlist) => {
        // console.log(playlist);
        setTracks(playlist.tracks);
      })
      .catch((err) => console.error(err));
  }, []);

  if (tracks.length === 0) return <div>Loading...</div>;
  else {
    return (
      <main id="main-container">
        <div className="container-top">
          <Playlist
            user={props.user}
            tracks={props.playback.playlist.tracks.items}
            playlistName={props.playback.playlist.name}
            addSong={props.addSong}
            removeSong={props.removeSong}
          />
          <Playlist
            user={props.user}
            tracks={tracks}
            playlistName={playlistNames}
            addSong={props.addSong}
            removeSong={props.removeSong}
          />
          <button>Invite</button>
        </div>

        <PlayerBar
          track="Attention"
          artist="Charlie Puth · Voicenotes"
          duration="3:31"
        />
      </main>
    );
  }
};

export default Main;

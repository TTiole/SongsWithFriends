import React, { useState, useEffect } from "react";
import {connect} from 'react-redux'
import "./Main.css";

import {get} from '../../../Fetch'

import Playlist from "../../Playlist/Playlist.jsx";
import PlayerBar from "../../PlayerBar/PlayerBar.jsx";

const Main = (props) => {
  const [tracks, setTracks] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(1);

  useEffect(() => {
    let playlistName = props.user.playlists[selectedPlaylist].name;

    get("/allTracks", {userID: props.user.id, playlistName}, playlist => {
      setTracks(playlist.tracks);
    })
  }, [props.user.id, props.user.playlists, selectedPlaylist]);

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
            playlistName={props.user.playlists[selectedPlaylist].name}
            addSong={props.addSong}
            removeSong={props.removeSong}
          />
          <button>Invite</button>
          <SearchOverlay user={props.user} />
        </div>
        {/* <SearchOverlay /> */}
        <PlayerBar
          track="Attention"
          artist="Charlie Puth · Voicenotes"
          duration="3:31"
        />
      </main>
    );
  }
};

const mapStateToProps = (state) => {
  return { 
    user: state.userReducer.user,
    playback: state.playbackReducer.playback
  }
}

export default connect(mapStateToProps, null)(Main);

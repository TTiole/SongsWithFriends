import React, { useState, useEffect } from "react";
import { connect, useStore } from 'react-redux'
import "./Main.css";

import { get } from '../../../Fetch'

import Playlist from "../../Playlist/Playlist.jsx";
import UserLibrary from "../../Playlist/UserLibrary.jsx";
import PlayerBar from "../../PlayerBar/PlayerBar.jsx";
import SearchOverlay from '../../SearchOverlay/SearchOverlay'

const Main = (props) => {
  const [tracks, setTracks] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(1);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const handleLibrary = () => setShowLibrary(!showLibrary);
  const handlePlaylist = () => setShowPlaylist(!showPlaylist);

  useEffect(() => {
    let playlistName = props.user.playlists[selectedPlaylist].name;

    get("/allTracks", { userID: props.user.id, playlistName }, playlist => {
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
          {showPlaylist ? <Playlist
            user={props.user}
            tracks={tracks}
            playlistName={props.user.playlists[selectedPlaylist].name}
            addSong={props.addSong}
            removeSong={props.removeSong}
          /> : null}

          {showLibrary ? <UserLibrary userName={props.user.name} playlists={props.user.playlists} setSelectedPlaylist={setSelectedPlaylist} /> : null}
          <button id="inviteBtn">Invite</button>
          <button id="inviteBtn" onClick={handleLibrary}>Library</button>
          <button id="inviteBtn" onClick={handlePlaylist}>Playlist</button>

          <SearchOverlay user={props.user} open={searchOpen} handleClose={() => setSearchOpen(false)} />
        </div>
        <button id="searchBtn" onClick={() => setSearchOpen(true)}>+</button>
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
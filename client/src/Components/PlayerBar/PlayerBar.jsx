import React from "react";
import { connect } from 'react-redux';

import { refreshDevices } from '../../Redux/Actions/userAction'

import "./PlayerBar.css"

import Typography from '../Typography/Typography'
import Slider from '../Slider/Slider'

import VolumeOffRoundedIcon from '@material-ui/icons/VolumeOffRounded';
import VolumeUpRoundedIcon from '@material-ui/icons/VolumeUpRounded';
import PauseRoundedIcon from '@material-ui/icons/PauseRounded';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import SkipNextRoundedIcon from '@material-ui/icons/SkipNextRounded';
import SkipPreviousRoundedIcon from '@material-ui/icons/SkipPreviousRounded';

import {
  PLAY,
  SKIP,
  PAUSE,
  PREVIOUS,
  JUMP,
  UPDATE_PLAYBACK,
  SET_VOLUME
} from "helpers/socket_events.js";

const PlayerBar = (props) => {
  // Sends play event
  const resume = () => props.socket.emit(PLAY);

  // Sends pause event
  const pause = () => props.socket.emit(PAUSE);

  // Sends skip event
  const skip = () => props.socket.emit(SKIP);

  // Sends previous event
  const previous = () => props.socket.emit(PREVIOUS);

  // Jump to point in song
  const jumpTo = (e) => props.socket.emit(JUMP, e.target.value * 1000);

  const mute = () => props.socket.emit(SET_VOLUME, 0)

  const unmute = () => props.socket.emit(SET_VOLUME, 50);

  const songFinished = () => {
    if (props.host)
      props.socket.emit(UPDATE_PLAYBACK)
  }

  return (
    <div className="player-container">
      <div className="track-info">
        <Typography>Currently Playing:</Typography>
        <Typography margin="0 15px" bold>{props.track}</Typography>
        <Typography>{props.artist}</Typography>
      </div>
      <div className="player-control-status">
        {" "}
        x x 1:05 ------------------------- 3:37
      </div>


      {(props.member || props.host) && props.playback ? (
        <React.Fragment>
          {props.guest ? null : (props.muted ? <VolumeUpRoundedIcon onClick={unmute}>Unmute</VolumeUpRoundedIcon> : <VolumeOffRoundedIcon onClick={mute}>Mute</VolumeOffRoundedIcon>)}
          <button onClick={() => props.refreshDevices(props.userID)}>Refresh Devices</button>

          {props.playback.playing ? (
            <PauseRoundedIcon onClick={pause}>Pause</PauseRoundedIcon>
          ) : (
              <PlayArrowRoundedIcon onClick={resume}>Resume</PlayArrowRoundedIcon>
            )}

          <SkipNextRoundedIcon onClick={skip}>Skip</SkipNextRoundedIcon>
          <SkipPreviousRoundedIcon onClick={previous}>Previous</SkipPreviousRoundedIcon>
          <Slider max={props.playback.currentSongDuration} maxCallback={songFinished}
            initialValue={props.playback.initialPosition} position={props.playback.initialPosition}
            stop={!props.playback.playing} autoincrement callback={jumpTo} instanceID={props.playback.currentSong} />

          <button onClick={jumpTo}>Jump To</button>

          <p>Currently Playing: {props.playback.currentSong}</p>
          <p>Currently Playing: {props.playback.currentAlbum} </p>
          <p>Currently Playing: {props.playback.currentArtists}</p>

          {/* <input type="text" ref={this.newInputRef}/> */}
        </React.Fragment>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    member: state.userReducer.member,
    host: state.userReducer.host,
    guset: state.userReducer.guest,
    userID: state.userReducer.userID,

    playback: state.playbackReducer.playback,
    muted: state.playbackReducer.muted,

    socket: state.userReducer.socket,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    refreshDevices: (userID) => dispatch(refreshDevices(userID))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerBar);




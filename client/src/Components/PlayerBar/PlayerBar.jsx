import React, {useState, useEffect} from "react";
import { connect } from 'react-redux';

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
  let [value, setValue] = useState(props.playback.initialPosition);
  const max = props.playback.currentSongDuration;
  const stop = !props.playback.playing;
  useEffect(() => {
    const songFinished = () => {
      if (props.host)
        props.socket.emit(UPDATE_PLAYBACK)
    }
    let interval = null;
    if (stop) {
      clearInterval(interval);
    } else {
      interval = setInterval(() => {
        if (value + 1 > max) {
          clearInterval(interval);
          songFinished();
        } else {
          setValue(value + 1);
        }
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    }
  }, [stop, max, props.host, props.socket, value])

  useEffect(() => {
    setValue(0);
  }, [props.playback.currentSong])
  useEffect(() => {
    setValue(props.playback.initialPosition);
  }, [props.playback.initialPosition])
  // Sends play event
  const resume = () => props.socket.emit(PLAY);

  // Sends pause event
  const pause = () => props.socket.emit(PAUSE);

  // Sends skip event
  const skip = () => props.socket.emit(SKIP);

  // Sends previous event
  const previous = () => props.socket.emit(PREVIOUS);

  // Jump to point in song
  const jumpTo = (e) => { 
    setValue(parseInt(e.target.value));
    props.socket.emit(JUMP, e.target.value * 1000) 
  };

  const mute = () => props.socket.emit(SET_VOLUME, 0)

  const unmute = () => props.socket.emit(SET_VOLUME, 50);

  //  Convert ms to mm:ss formate
  const sec2time = (sec) => {
    if (sec === undefined)
      return "0:00";
    return new Date(sec * 1000).toISOString().slice(14, 19);
  };

  return (
    <div className="player-container">
      {(props.member || props.host) && props.playback ? (
        <React.Fragment>
          <div className="track-info">
            <Typography color="#b3b3b3" bold>Currently Playing:</Typography>
            {props.playback.currentSong === "" ? null : (
              <React.Fragment>
                <Typography margin="0 15px" color="white" bold>{props.playback.currentSong}</Typography>
                <Typography color="#b3b3b3"> {props.playback.currentAlbum} · {props.playback.currentArtists} </Typography></React.Fragment>)}
          </div>

          <div className="player-status">
            <div id="player-control">
              {props.guest ? null : (props.muted ? <VolumeUpRoundedIcon onClick={unmute}>Unmute</VolumeUpRoundedIcon> : <VolumeOffRoundedIcon onClick={mute}>Mute</VolumeOffRoundedIcon>)}
              <SkipPreviousRoundedIcon onClick={previous}>Previous</SkipPreviousRoundedIcon>
              {props.playback.playing ? (<PauseRoundedIcon onClick={pause}>Pause</PauseRoundedIcon>) : (<PlayArrowRoundedIcon onClick={resume}>Resume</PlayArrowRoundedIcon>)}
              <SkipNextRoundedIcon onClick={skip}>Skip</SkipNextRoundedIcon>
            </div>
            <div id="player-slide-bar">
              <Typography color="rgb(179, 179, 179)">{sec2time(value)}</Typography>

              <Slider max={props.playback.currentSongDuration} handleChange={e => setValue(parseInt(e.target.value))}
                initialValue={props.playback.initialPosition} position={value}
                callback={jumpTo}  />

              <Typography color="rgb(179, 179, 179)">{sec2time(props.playback.currentSongDuration)}</Typography>
            </div>

          </div>
        </React.Fragment>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    member: state.userReducer.member,
    host: state.userReducer.host,
    guest: state.userReducer.guest,

    playback: state.playbackReducer.playback,
    muted: state.playbackReducer.muted,

    socket: state.userReducer.socket,
  }
}

export default connect(mapStateToProps, null)(PlayerBar);




import React from "react";
import { connect } from 'react-redux';

import Typography from "../Typography/Typography";
import "./TrackCell.css";

import {
  QUEUE_ADD,
  QUEUE_REMOVE,
} from "helpers/socket_events.js";

const TrackCell = (props) => {
  const addSong = track => () => props.socket.emit(QUEUE_ADD, track);
  const removeSong = track => () => props.socket.emit(QUEUE_REMOVE, track);
  return (
    <div className="entry-wrapper">
      {props.showDelete ? <button id="removeBtn">-</button> : null}
      <div className="track-container" onClick={addSong(props.track)}>
        <div className="track-container-info">
          <Typography bold>{props.track.name}</Typography>
          <Typography>{props.track.artists}</Typography>
        </div>
        <Typography margin="5px" additionalStyles={{ backgroundColor: "green" }}>
          {props.duration}
        </Typography>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    socket: state.userReducer.socket
  }
}

export default connect(mapStateToProps, null)(TrackCell);

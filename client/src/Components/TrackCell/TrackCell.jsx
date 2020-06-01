import React from "react";
import { connect } from 'react-redux';

import Typography from "../Typography/Typography";
import "./TrackCell.css";

import {
  QUEUE_ADD,
  QUEUE_REMOVE,
  QUEUE_REORDER,
} from "helpers/socket_events.js";

const TrackCell = (props) => {
  const addSong = track => () => props.socket.emit(QUEUE_ADD, track);
  const removeSong = track => () => props.socket.emit(QUEUE_REMOVE, track);
  const reorderSong = (track, offset) => () => props.socket.emit(QUEUE_REORDER, track, offset);
  return (
    <div className="entry-wrapper">
      {props.showDelete ? <button id="removeBtn" onClick={reorderSong(props.track, -1)}>&#8593;</button> : null}
      {props.showDelete ? <button id="removeBtn" onClick={reorderSong(props.track, 1)}>&#8595;</button> : null}
      {props.showDelete ? <button id="removeBtn" onClick={removeSong(props.track)}>-</button> : null}
      <div className="track-container" onClick={!props.queue ? addSong(props.track):null}>
        <div className="track-container-info">
          <Typography bold color="white">{props.track.name}</Typography>
          <Typography color="#b3b3b3">{props.track.artists}</Typography>
        </div>
        <Typography margin="5px" color="#b3b3b3" additionalStyles={{ backgroundColor: "black" }}>
          {props.duration}
        </Typography>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    socket: state.userReducer.socket,
  }
}

// const mapDispatchToProps = dispatch => {
//   return {
//     test: (playback) => dispatch(modifyPlayback(playback))
//   }
// }

// props.test(playback)

export default connect(mapStateToProps, null)(TrackCell);
// export default connect(mapStateToProps, mapDispatchToProps)(TrackCell);

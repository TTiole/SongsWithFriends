import React from "react";
import { connect } from 'react-redux';

import Typography from "../Typography/Typography";
import "./TrackCell.css";
import RemoveCircleOutlineRoundedIcon from '@material-ui/icons/RemoveCircleOutlineRounded';
import ArrowDropDownCircleOutlinedIcon from '@material-ui/icons/ArrowDropDownCircleOutlined';

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
      <div className="entry-btns">
        {props.showDelete ? <ArrowDropDownCircleOutlinedIcon className="Btn" onClick={reorderSong(props.track, 2)}></ArrowDropDownCircleOutlinedIcon> : null}
        {props.showDelete ? <ArrowDropDownCircleOutlinedIcon className="Btn" style={{ transform: "rotate(180deg)" }} onClick={reorderSong(props.track, -1)}></ArrowDropDownCircleOutlinedIcon> : null}
        {props.showDelete ? <RemoveCircleOutlineRoundedIcon className="remove-btn" onClick={removeSong(props.track)}></RemoveCircleOutlineRoundedIcon> : null}
      </div>
      <div className="track-container" onClick={!props.queue ? addSong(props.track) : null}>
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

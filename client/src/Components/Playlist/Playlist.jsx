import React, { useState } from "react";
import TrackCell from "../TrackCell/TrackCell.jsx";
import "./Playlist.css";

import Tooltip from '@material-ui/core/Tooltip'
import Typography from "../Typography/Typography";
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import PlaylistAddRoundedIcon from '@material-ui/icons/PlaylistAddRounded';


//  Convert ms to mm:ss formate
const ms2time = (ms) => {
  return new Date(ms).toISOString().slice(14, 19);
};

const Playlist = (props) => {
  const [showDelete, setShowDelete] = useState(false);
  const handleEdit = () => setShowDelete(!showDelete)
  const handleBack = () => {
    props.setShowPlaylist(false);
    props.setShowLibrary(true);
  }
  return (
    <div className="playlist-container">
      <div className="top-container">
        <Typography margin="5px" fontSize={25} bold color="#eee">
          {props.playlistName}
        </Typography>
        <div className="playlist-btns">
          {props.queue ? <React.Fragment>
            <Tooltip arrow title="Edit Playlist">
              <EditRoundedIcon className="queue-button smaller" onClick={handleEdit} />
            </Tooltip>
            <Tooltip arrow title="Search for Song">
              <PlaylistAddRoundedIcon className="queue-button" onClick={() => props.setSearchOpen(true)} />
            </Tooltip>
          </React.Fragment> :
            <button className="editBtn" onClick={handleBack}>Back</button>
          }
        </div>
      </div>
      <div className="tracks">
        {props.tracks.map((track) => (
          <TrackCell
            key={track.id}
            duration={ms2time(track.duration_ms)}
            track={track}
            showDelete={showDelete}
            queue={props.queue}
          />
        ))}
        {props.tracks.length === 0 ? <Typography fontSize="12px" color="#999">No items to show</Typography> : null}
      </div>
    </div>
  );
};

export default Playlist;

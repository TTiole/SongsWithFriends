import React from "react";
import {connect} from 'react-redux'
import Typography from '../Typography/Typography'
import "./SearchOverlay.css";
import { useState } from "react";
import {get} from '../../Fetch'
import Popup from "../Popup/Popup";

import {
  QUEUE_ADD,
} from "helpers/socket_events.js";

// let testResult = [
//   {
//     title: "Attention",
//     artist: "Charlie Puth",
//     album: "Voicenotes",
//   },
//   {
//     title: "Attention",
//     artist: "Charlie Puth",
//     album: "Voicenotes",
//   },
//   {
//     title: "Attention",
//     artist: "Charlie Puth",
//     album: "Voicenotes",
//   },
//   {
//     title: "Attention",
//     artist: "Charlie Puth",
//     album: "Voicenotes",
//   },
//   {
//     title: "Attention",
//     artist: "Charlie Puth",
//     album: "Voicenotes",
//   },
// ];

const SearchOverlay = (props) => {
  const [result, setResult] = useState([]);
  const addSong = result => () => {
    props.socket.emit(QUEUE_ADD, result)
    props.handleClose();
  };
  return (
    <Popup open={props.open} handleClose={props.handleClose}>
      <Typography bold fontSize="20px" align="center">Add Songs to Queue</Typography>
      <SearchBar user={props.user} setResult={setResult} />
      <div className="search-overlay-headers">
        <Typography bold fontSize="15px">Title</Typography>
        <Typography bold fontSize="15px">Artist</Typography>
        <Typography bold fontSize="15px">Album</Typography>
        <p/>
      </div>
      <div id="result-container">
        <ResultCell addSong={addSong} result={result} />
      </div>
    </Popup>
  );
};

export const SearchBar = (props) => {
  const handleSearch = () => {
    get('/search', {userID:props.user.id}, (data) => {
        props.setResult(data);
      });
  };
  return (
    <div className="searchbar-wrapper">
      <input placeholder="Search a Song!" id="searchBox"></input>
      <button className="searchBtn" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
};

export const ResultCell = ((props) => {
  return (
    <div id="result-wrapper">
      {props.result.map((result) => (
        <div className="resultCell">
          <Typography>{result.name}</Typography>
          <Typography>{result.artists}</Typography>
          <Typography>{result.albumName} </Typography>
          <button className="searchBtn" onClick={props.addSong(result)}>Add</button>
        </div>
      ))}
    </div>
  );
});

const mapStateToProps = state => ({socket: state.userReducer.socket})
export default connect(mapStateToProps, null)(SearchOverlay);

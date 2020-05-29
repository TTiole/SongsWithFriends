import React, { useEffect } from "react";
import Typography from '../Typography/Typography'
import "./SearchOverlay.css";
import { useState } from "react";
import {get} from '../../Fetch'
import Popup from "../Popup/Popup";

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
  return (
    <Popup open={props.open} handleClose={props.handleClose}>
      <Typography bold fontSize="20px" align="center">Add Songs to Queue</Typography>
      <SearchBar user={props.user} setResult={setResult} />
      <div className="search-overlay-headers">
        <Typography bold fontSize="15px">Title</Typography>
        <Typography bold fontSize="15px">Artist</Typography>
        <Typography bold fontSize="15px">Album</Typography>
      </div>
      <div id="result-container">
        <ResultCell result={result} />
      </div>
    </Popup>
  );
};

export const SearchBar = (props) => {
  const handleSearch = () => {
    get('/search', {userID:props.user.id}, (data) => {
        props.setResult(data.map(track => ({title: track.name, artist: track.artists, album: track.albumName})));
      });
  };
  return (
    <div className="searchbar-wrapper">
      <input placeholder="Search a Song!" id="searchBox"></input>
      <button id="searchBtn" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
};

export const ResultCell = (props) => {
  return (
    <div id="result-wrapper">
      {props.result.map((result) => (
        <div className="resultCell">
          <Typography>{result.title}</Typography>
          <Typography>{result.artist}</Typography>
          <Typography>{result.album} </Typography>
        </div>
      ))}
    </div>
  );
};

export default SearchOverlay;

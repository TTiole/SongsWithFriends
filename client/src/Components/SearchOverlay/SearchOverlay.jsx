import React, { userState, useEffect } from "react";
import "./SearchOverlay.css";
import { useState } from "react";

let testResult = [
  {
    title: "Attention",
    artist: "Charlie Puth",
    album: "Voicenotes",
  },
  {
    title: "Attention",
    artist: "Charlie Puth",
    album: "Voicenotes",
  },
  {
    title: "Attention",
    artist: "Charlie Puth",
    album: "Voicenotes",
  },
  {
    title: "Attention",
    artist: "Charlie Puth",
    album: "Voicenotes",
  },
  {
    title: "Attention",
    artist: "Charlie Puth",
    album: "Voicenotes",
  },
];

const SearchOverlay = (props) => {
  const [result, setResult] = useState([]);

  useEffect(() => {
    console.log(result);
  }, [result]);
  return (
    <div id={"popup-wrapper"}>
      <div id="popup">
        Add Songs to Queue
        <SearchBar user={props.user} setResult={setResult} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "90%",
            fontSize: "15px",
          }}
        >
          <div>Title</div>
          <div>Artist</div>
          <div>Album</div>
        </div>
        <div id="result-container">
          <ResultCell result={result} />
        </div>
      </div>
    </div>
  );
};

export const SearchBar = (props) => {
  const handleSearch = () => {
    fetch(`http://localhost:8000/search?userID=${props.user.id}`)
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        let newResult = [];
        data.forEach((track) => {
          console.log(track);
          let simplifiedTrack = {
            title: track.name,
            artist: track.artists,
            album: track.albumName,
          };
          newResult.push(simplifiedTrack);
        });
        props.setResult(newResult);
        console.log(newResult);
      });
  };
  return (
    <div style={{ display: "flex", width: "90%", height: "35px" }}>
      <input placeholder="Search a Song!" id="searchBox"></input>
      <button id="searchBtn" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
};

export const ResultCell = (props) => {
  useEffect(() => {}, [props.result]);
  return (
    <div id="result-wrapper">
      {props.result.map((result) => (
        <div className="resultCell">
          <div>{result.title}</div>
          <div>{result.artist}</div>
          <div>{result.album}</div>{" "}
        </div>
      ))}
    </div>
  );
};

export default SearchOverlay;
{
}

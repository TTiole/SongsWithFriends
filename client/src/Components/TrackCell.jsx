import React, { useState } from "react";

const TrackCell = (props) => {
  // const [tracks, setTracks] = useState(props);
  return (
    <div style={Styles.trackContainer}>
      <div style={Styles.infoWrapper}>
        <div style={Styles.name}>{props.track}</div>
        <div style={Styles.artistAlbum}>{props.artist}</div>
      </div>
      <div style={Styles.duration}>{props.duration}</div>
    </div>
  );
};

const Styles = {
  trackContainer: {
    display: "flex",
    justifyContent: "space-between",
    width: "90%",
    backgroundColor: "blue",
  },

  infoWrapper: {
    display: "flex",
    flexDirection: "column",
    margin: 5,
    backgroundColor: "green",
  },

  name: {
    display: "flex",
    fontFamily: "OpenSans",
    fontWeight: 700,
  },

  artistAlbum: {
    display: "flex",
    fontFamily: "OpenSans",
    fontWeight: 400,
  },

  duration: {
    display: "flex",
    margin: 5,
    fontFamily: "OpenSans",
    fontWeight: 400,
    backgroundColor: "green",
  },
};

export default TrackCell;

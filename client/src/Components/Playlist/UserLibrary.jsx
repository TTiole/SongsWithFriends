import React from "react";
import "./UserLibrary.css";
import Typography from "../Typography/Typography";


const UserLibrary = (props) => {
    const handleLibrary = (name) => () => {
        let trackIndex = props.playlists.findIndex(item => item.name === name);
        props.setSelectedPlaylist(trackIndex);
        props.setShowLibrary(false);
        props.setShowPlaylist(true);
    }
    const musicUnicode = String.fromCodePoint(0x266A);
    return (
        <div className="library-container">
            <Typography margin="10px" fontSize={25} bold color="#eee">
                {`${props.userName}'s Library`}
            </Typography>

            <div className="playlists">
                {props.playlists.map((playlist) => (
                    <div className="entry-wrapper" onClick={handleLibrary(playlist.name)} key={playlist.id}>
                        <div className="track-container-info">
                            <Typography bold color="white">{playlist.name}</Typography>
                            <Typography color="#b3b3b3">{playlist.owner}</Typography>
                        </div>
                        <Typography margin="5px" color="#b3b3b3" additionalStyles={{ backgroundColor: "black" }}>
                            {`${playlist.numTracks} ${musicUnicode}`}
                        </Typography>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserLibrary;

// Import any spotify requests we write
const {
  getUser,
  addPlaylists,
  getSinglePlaylist,
  getAllPlaylists,
} = require("../users");
const { requestPlaylists, requestTracks } = require("../requests");

module.exports = (app) => {
  // Endpoints here

  app.get("/playlists", function (req, res) {
    let userID = req.query.userID;
    console.log(userID);
    requestPlaylists(getUser(userID))
      .then((data) => {
        // Items is an array of "playlist objects"
        let playlists = data.items;

        // Get rid of unnecessary info for each playlist
        playlists.forEach((playlist) => {
          let simplafiedPlaylist = {
            name: playlist.name,
            id: playlist.id,
            owner: playlist.owner.display_name,
            numTracks: playlist.tracks.total,
            tracks: null,
          };
          addPlaylists(userID, simplafiedPlaylist);
        });
        console.log(getAllPlaylists(userID));
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Some Errors Occured");
      });
  });

  app.get("/allTracks", function (req, res) {
    let userID = req.query.userID;
    // let playlistName = req.query.playlistName;
    let playlistName = "Winter 2019";

    let playlist = getSinglePlaylist(userID, playlistName);
    let tracks = [];

    // Get all the tracks in this playlist from Spotify
    requestTracks(getUser(userID), playlist.id).then((pages) => {
      //  CAUTION: NOT CONSIDERING MULTIPLE PAGE OF TRACKS DATA
      //  For each track on the same page, get rid of the unnecessary info
      pages.items.forEach((trackObj) => {
        //  If there's multiple artists, put them in an array beforehand
        let artistsList = [];
        trackObj.track.artists.forEach((artist) => {
          artistsList.push(artist.name);
        });

        let track = {
          albumName: trackObj.track.album.name,
          artists: artistsList,
          explicit: trackObj.track.explicit,
          id: trackObj.track.id,
          name: trackObj.track.name,
        };
        tracks.push(track);
        console.log(track);
      });
      //  Update the selected playlist
      playlist.tracks = tracks;
    });
  });
};

// 4xMXgzU2ZyZJ92iCH5HCJg

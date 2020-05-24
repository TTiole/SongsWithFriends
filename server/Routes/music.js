// Import any spotify requests we write
const {
  getUser,
  addSinglePlaylist,
  getSinglePlaylist,
  getAllPlaylists,
} = require("../users");
const {
  requestPlaylists,
  requestTracks,
  requestSearch,
} = require("../requests");

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
          let simplifiedPlaylist = {
            name: playlist.name,
            id: playlist.id,
            owner: playlist.owner.display_name,
            numTracks: playlist.tracks.total,
            tracks: null,
          };
          addSinglePlaylist(userID, simplifiedPlaylist);
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
    let playlistName = "home🏠";

    let playlist = getSinglePlaylist(userID, playlistName);
    let tracks = [];

    // Get all the tracks in this playlist from Spotify
    requestTracks(getUser(userID), playlist.id)
      .then((pages) => {
        //  CAUTION: NOT CONSIDERING MULTIPLE PAGE OF TRACKS DATA
        //  Response come back in page objects, which contains an array of
        //  playlist track object that has: added_at, added_by, is_local, and the actual track object
        pages.items.forEach((playlistTrackObj) => {
          //  If there's multiple artists, put them in an array beforehand
          tracks.push(simplifyTrack(playlistTrackObj.track));
          console.log(simplifyTrack(playlistTrackObj.track));
        });
        //  Update the selected playlist
        playlist.tracks = tracks;
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Some Errors Occured");
      });
  });

  app.get("/search", function (req, res) {
    let userID = req.query.userID;
    let itemName = "Attention";
    requestSearch(getUser(userID), encodeURIComponent(itemName), searchType)
      .then((pages) => getNextPage(getUser(userID), pages))
      .catch((err) => {
        console.log(err);
        res.status(500).send("Some Errors Occured");
      });
  });
};

const getNextPage = (user, pages) => {
  //  Possible Keys: track, album, artist, playlist, show, episode
  //  Value will always be a page object
  Object.entries(pages).forEach(([key, value]) => {
    value.items.forEach((trackObj) => {
      track = simplifyTrack(trackObj);
      console.log(track);
    });
    // Recursively invoke getNextPage to get all the search results
    if (value.next) {
      console.log(value.next);
      let nextItemName = value.next.split("query=")[1].split("&")[0];
      let nextItemType = value.next.split("type=")[1];
      requestSearch(user, nextItemName, nextItemType).then((pages) =>
        getNextPage(user, pages)
      );
    }
  });
};

const simplifyTrack = (rawTrack) => {
  //  If there's multiple artists, put them in an array beforehand
  let artistsList = [];
  rawTrack.artists.forEach((artist) => {
    artistsList.push(artist.name);
  });

  let track = {
    albumName: rawTrack.album.name,
    artists: artistsList,
    explicit: rawTrack.explicit,
    id: rawTrack.id,
    name: rawTrack.name,
  };
  return track;
};

// 4xMXgzU2ZyZJ92iCH5HCJg

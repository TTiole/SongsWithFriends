const { authUser } = require("../users");
const {
  requestUserInfo,
  requestToken,
  requestDevices,
  requestPlaylists,
  disableShuffle
} = require("../requests");

module.exports = function (app) {
  // Request authroization from user to access data
  // Current scopes: user-modify-playback-state, playlist-modify-public, user-library-read playlist-read-private
  app.get("/login", function (req, res) {

    const scopes =
      "user-modify-playback-state playlist-modify-public user-library-read playlist-read-private user-read-playback-state playlist-modify-private playlist-read-collaborative";

    // Redirects user to Spotify page, prompting if they want to allow our access to their account
    res.redirect(
      "https://accounts.spotify.com/authorize" +
        "?response_type=code" +
        "&client_id=" +
        process.env.SPOTIFY_CLIENT_ID +
        (scopes ? "&scope=" + encodeURIComponent(scopes) : "") +
        "&redirect_uri=" +
        encodeURIComponent(process.env.REDIRECT_URI)
    );
  });

  // Called when the client receives a successful authorization code from spotify
  // Turns the authorization code into a token which we can use in order to send requests in behalf of the user
  app.get("/authSuccess", function (req, res) {
    let authCode = req.query.code;
    let userID = req.query.userID;

    let user; // Declare the variable in a scope outside the promise resolutions for modification and access

    // Request to get the token
    requestToken(authCode)
      .then((data) => {
        user = authUser(userID, data.access_token, data.token_type); // Assign the user's reference to the user object
        // Get the user's devices
        return requestDevices(user);
      })
      .then((data) => {
        user.setDevices(data.devices);
        // Get user personal information for client state
        return requestUserInfo(user);
      })
      .then((data) => {
        user.name = data.display_name;
        user.spotify_id = data.id;
        // Send the information to the client
        return disableShuffle(user)
        
        
      }).then(data => {
        return requestPlaylists(user)
      }).then((data) => {
        // Items is an array of "playlist objects"
        let playlists = data.items;

        // Get rid of unnecessary info for each playlist
        user.playlists = playlists.map((playlist) => ({
            name: playlist.name,
            id: playlist.id,
            owner: playlist.owner.display_name,
            numTracks: playlist.tracks.total,
            tracks: null,
          })
        );
        res.json(user.clientInfo());
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Some Errors Occured");
      });
  });
};

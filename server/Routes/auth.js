const { authUser } = require("../users");
const { requestUserInfo, requestToken } = require("../requests");

module.exports = function (app) {
  // Request authroization from user to access data
  // Current scopes: user-modify-playback-state, playlist-modify-public, user-library-read playlist-read-private
  app.get("/login", function (req, res) {
    // Make sure the userID gets passed
    if (!req.query.userID) {
      res.status(400).end("Bad login");
      return;
    }

    const scopes =
      "user-modify-playback-state playlist-modify-public user-library-read playlist-read-private";

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

    // Request to get the token
    requestToken(authCode)
      .then((data) => {
        const user = authUser(userID, data.access_token, data.token_type);

        // Get user personal information for client state
        requestUserInfo(user).then((data) => {
          user.name = data.display_name;
          // Send the information to the client
          res.json(user.clientInfo());
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Some Errors Occured");
      });
  });
};

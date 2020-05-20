const {authUser} = require('../users')
const {getUserInfo, getToken} = require('../requests')

module.exports = function (app) {
  // Request authroization from user to access data
  // Current scopes: user-modify-playback-state, playlist-modify-public, user-library-read
  app.get("/login", function (req, res) {
    // Make sure the userID gets passed
    if(!req.query.userID) {
      res.status(400).end("Bad login")
      return;
    }

    const scopes =
      "user-modify-playback-state playlist-modify-public user-library-read";

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

  app.get("/authSuccess", function (req, res) {
    let authCode = req.query.code;
    let userID = req.query.userID;
    
    getToken(authCode).then((data) => {
      const user = authUser(userID,data.access_token, data.token_type)
      // Get user personal information for client state
      
      getUserInfo(user).then((data) => {
        user.setName(data.display_name);
        res.json(user.clientInfo())
      })
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Some Errors Occured");
    });
  });
};

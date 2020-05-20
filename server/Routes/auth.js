module.exports = function (app) {
  // Request authroization from user to access data
  // Current scopes: user-modify-playback-state, playlist-modify-public, user-library-read
  app.get("/login", function (req, res) {
    var scopes =
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
    reqAccessToken(req.query.code, res);
  });

  function reqAccessToken(authCode, res) {
    fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.SPOTIFY_CLIENT_ID +
              ":" +
              process.env.SPOTIFY_CLIENT_SECRET
          ).toString("base64"),
      },
      body: `grant_type=authorization_code&code=${authCode}&redirect_uri=${encodeURIComponent(
        process.env.REDIRECT_URI
      )}`,
    })
      .then((response) => response.json())
      .then((data) => res.end(data))
      .catch((err) => {
        console.log(err);
        res.end("Some Errors Occured");
      });
  }
};

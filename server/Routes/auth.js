require("../users");

module.exports = function (app, fetch, user) {
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
    let authCode = req.query.code;

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
      .then((response) => response.text())
      .then((data) => {
        let retStr = JSON.parse(data);

        user.token = retStr.access_token;
        user.token_type = retStr.token_type;

        console.log(user);
        res.redirect("http://localhost:8000/API_request");
      })
      .catch((err) => {
        console.log(err);
        res.end("Some Errors Occured");
      });
  });
};

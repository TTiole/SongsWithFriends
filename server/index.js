"use strict";
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const fetch = require("node-fetch");

require("dotenv").config(); // Setup dotenv

// Create the express app
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Routes and middleware
// app.use(/* ... */)
// app.get(/* ... */)

// Error handlers
// app.use(function fourOhFourHandler(req, res) {
//   res.status(404).send();
// });
// app.use(function fiveHundredHandler(err, req, res, next) {
//   console.error(err);
//   res.status(500).send();
// });

app.get("/", function (res) {
  // res.end("Server is up");
  console.log("Server is up");
});

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
    .then((response) => response.text())
    .then((data) => res.end(data))
    .catch((err) => {
      console.log(err);
      res.end("end err");
    });
}

io.on("connect", (socket) => {});

// Start server
const port = process.env.SERVER_PORT || 8000; // Default to 8000
server.listen(process.env.SERVER_PORT, function (err) {
  if (err) {
    return console.error(err);
  }
  console.log(`Started at http://localhost:${process.env.SERVER_PORT}`);
});

"use strict";
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const fetch = require("node-fetch");

require("dotenv").config(); // Setup dotenv

// Create the express app
const app = express();
require("./Routes/auth")(app);
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

app.get("/getPlaylist", function (req, res) {});

io.on("connect", (socket) => {});

// Start server
const port = process.env.SERVER_PORT || 8000; // Default to 8000
server.listen(process.env.SERVER_PORT, function (err) {
  if (err) {
    return console.error(err);
  }
  console.log(`Started at http://localhost:${process.env.SERVER_PORT}`);
});

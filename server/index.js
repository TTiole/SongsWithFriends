"use strict";
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:3000",
};

require("dotenv").config(); // Setup dotenv
// Create the express app
const app = express();

app.options("*", cors(corsOptions));

app.use(cors(corsOptions));

require("./Routes/auth")(app);
require("./Routes/music")(app);

const server = http.createServer(app);
const io = socketio(server);
const {CONNECT} = require("../helpers/socket_events");
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
  console.log("Server is up");
});

// Handle socket.io stuff in socket.js
io.on(CONNECT, require('./socket'));

// Start server
const port = process.env.SERVER_PORT || 8000; // Default to 8000
server.listen(process.env.SERVER_PORT, function (err) {
  if (err) {
    return console.error(err);
  }
  console.log(`Started at http://localhost:${process.env.SERVER_PORT}`);
});

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

// Set up CORS. Necessary for localhost
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

// Import all the routes
require("./Routes/auth")(app);
require("./Routes/music")(app);

// Create the server. Allow it to listen to websockets
const server = http.createServer(app);
const io = socketio(server);

// Root route, for testing to ensure server is working
app.get("/", function (res) {
  console.log("Server is up");
});

// Handle socket.io stuff in socket.js
const { CONNECT } = require("../helpers/socket_events");
io.on(CONNECT, require("./socket"));

// Start server
const port = process.env.SERVER_PORT || 8000; // Default to 8000
server.listen(process.env.SERVER_PORT, function (err) {
  if (err) {
    return console.error(err);
  }
  console.log(`Started at http://localhost:${process.env.SERVER_PORT}`);
});

"use strict";
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require('cors');
const corsOptions = {
  origin: "http://localhost:3000"
}
const {addUser, removeUser} = require("./users")

require("dotenv").config(); // Setup dotenv
// Create the express app
const app = express();

require("./Routes/auth")(app);

const server = http.createServer(app);
const io = socketio(server);
const events = require('../helpers/socket_events') 
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

app.options('*', cors(corsOptions))

app.use(cors(corsOptions))

app.get("/", function (res) {
  console.log("Server is up");
});

io.on(events.CONNECT, (socket) => {
  // User has entered the website
  // Add it to the list of users
  addUser(socket.id)

  // On disconnect remove the user
  socket.on(events.DISCONNECT, () => {
    removeUser(socket.id)
  })
});

// Start server
const port = process.env.SERVER_PORT || 8000; // Default to 8000
server.listen(process.env.SERVER_PORT, function (err) {
  if (err) {
    return console.error(err);
  }
  console.log(`Started at http://localhost:${process.env.SERVER_PORT}`);
});

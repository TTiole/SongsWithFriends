'use strict'
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const events = require('../helpers/socket_events')
require('dotenv').config() // Setup dotenv

// Create the express app
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Routes and middleware
// app.use(/* ... */)
// app.get(/* ... */)

app.get("/", (req,res) => {
  res.end("Testing")
})

io.on('connection', socket => {
  console.log("Socket connection established")
})

// Start server
const port = process.env.SERVER_PORT || 8000 // Default to 8000
server.listen(process.env.SERVER_PORT, function (err) {
  if (err) {
    return console.error(err)
  }
  console.log(`Started at http://localhost:${process.env.SERVER_PORT}`)
})

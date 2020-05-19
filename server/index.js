'use strict'
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
require('dotenv').config() // Setup dotenv

// Create the express app
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Routes and middleware
// app.use(/* ... */)
// app.get(/* ... */)

// Error handlers
app.use(function fourOhFourHandler (req, res) {
  res.status(404).send()
})
app.use(function fiveHundredHandler (err, req, res, next) {
  console.error(err)
  res.status(500).send()
})

io.on('connect', socket => {
  
})

// Start server
const port = process.env.SERVER_PORT || 3000 // Default to 3000
server.listen(process.env.SERVER_PORT, function (err) {
  if (err) {
    return console.error(err)
  }
  console.log(`Started at http://localhost:${process.env.SERVER_PORT}`)
})

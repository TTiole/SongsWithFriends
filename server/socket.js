const { addUser, removeUser, getUser } = require("./users");
const { addRoom } = require('./rooms')
const events = require("../helpers/socket_events");


module.exports = socket => {
  console.log("New connection")
  // User has entered the website
  // Add it to the list of users
  addUser(socket.id);

  socket.on(events.CREATE, () => {
    addRoom(getUser(socket.id));
  })

  // On disconnect remove the user
  socket.on(events.DISCONNECT, () => {
    removeUser(socket.id);
  });
}
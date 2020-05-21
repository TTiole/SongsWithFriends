const { addUser, removeUser } = require("./users");
const events = require("../helpers/socket_events");

module.exports = socket => {
  console.log("New connection")
  // User has entered the website
  // Add it to the list of users
  addUser(socket.id);

  // On disconnect remove the user
  socket.on(events.DISCONNECT, () => {
    removeUser(socket.id);
  });
}
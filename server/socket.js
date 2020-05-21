const { addUser, removeUser, getUser } = require("./users");
const { addRoom, getRoom } = require('./rooms')
const events = require("../helpers/socket_events");


module.exports = socket => {
  console.log("New connection")
  // User has entered the website
  // Add it to the list of users
  addUser(socket.id);

  // On room creation add a new room and change the user to be a host
  socket.on(events.CREATE, () => {
    const room = addRoom(getUser(socket.id));
    socket.join(room.id)
    socket.emit(events.CREATE, room.id) // Emit the event back if success
  })

  socket.on(events.JOIN, id => {
    let room = getRoom(id);
    if(room == null) {
      socket.emit(events.ERROR, "The room you entered is invalid")
    } else {
      socket.join(room.id);
      socket.emit(events.JOIN);
    }
  })

  // On disconnect remove the user
  socket.on(events.DISCONNECT, () => {
    removeUser(socket.id);
  });
}
const { addUser, removeUser, getUser } = require("./users");
const { addRoom, getRoom, closeRoom } = require('./rooms')
const events = require("../helpers/socket_events");


module.exports = io => socket => {
  console.log("New connection")
  // User has entered the website
  // Add it to the list of users
  addUser(socket.id);

  // On room creation add a new room and change the user to be a host
  socket.on(events.CREATE, () => {
    const user = getUser(socket.id)
    if(user.room !== "") {
        socket.emit(events.ERROR, "You're already in a room")
    } else {
      const room = addRoom(user); // Create the room in the rooms object
      socket.join(room.id) // Join the socket room
      user.room = room.id; // Update the room property of user
      user.host = true;  // Set the user as host
      socket.emit(events.CREATE, room.id) // Emit the event back if success
    }
  })

  // On room join add the user to the members array of the room
  socket.on(events.JOIN, id => {
    const user = getUser(socket.id);
    if(user.room !== "") {
      socket.emit(events.ERROR, "You're already in a room")
    } else {
      let room = getRoom(id);
      if(room == null) {
        socket.emit(events.ERROR, "The room you entered is invalid")
      } else {
        socket.join(id); // Join the socket room
        room.addMember(user); // Add the member to the rooms object
        user.room = id // Update the room property of user
        socket.emit(events.JOIN);
      }
    }
  })

  // On room leave, reset the user room property
  socket.on(events.LEAVE, () => {
    const user = getUser(socket.id);
    if(user.room === "") {
      socket.emit(events.ERROR, "You are not in a room")
    } else {
      let room = getRoom(user.room);
      room.removeMember(user); // Remove the user from the room object
      socket.leave(user.room); // Leave the socket room
      user.room = ""; // Update the user object
      socket.emit(events.LEAVE, room.id)
    }
  })

  // On room destroy, get rid of the room, and wipe the information off all its users
  socket.on(events.DESTROY, () => {
    const user = getUser(socket.id);
    const roomID = user.room;
    if(roomID === "") {
      socket.emit(events.ERROR, "You are not in a room")
    } else if (!user.host) {
      socket.emit(events.ERROR, "You are not a host")
    } else {
      closeRoom(roomID); // Close the room, updating everyone's objects
      io.of('/').in(roomID).clients((error, socketIDs) => {
        if(error) {
          socket.emit(events.ERROR, `Error getting room clients: ${error}`)
        } else {
          // Make all clients leave socket room
          socket.to(roomID).emit(events.DESTROYED, roomID);
          socket.emit(events.DESTROY, roomID)
          socketIDs.forEach(socketID => io.sockets.sockets[socketID].leave(roomID))
          
        }
      })
    }
  })
  // On disconnect remove the user
  socket.on(events.DISCONNECT, () => {
    removeUser(socket.id);
  });
}
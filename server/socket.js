const { addUser, removeUser, getUser } = require("./users");
const { addRoom, getRoom, closeRoom } = require('./rooms')
const { setSongPosition, nextSong, previousSong, resumeSong, pauseDevice, requestContext, playContext, createTempPlaylist, deleteTempPlaylist } = require('./requests')
const events = require("../helpers/socket_events");
const {makeid} = require("../helpers/string_utils")


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
      createTempPlaylist(user, makeid(16)).then(({id, name, uri, owner, tracks}) => {
        room.playlist = {id, name, uri, owner, tracks};
        socket.emit(events.CREATE, room.getPlayback(), room.id) // Emit the event back if success
      })
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

        // Get the currently playing information from host
        requestContext(room.host).then(playback => {
          playContext(user, playback.context.uri, playback.item.uri, playback.progress_ms).then(() => {
            socket.emit(events.JOIN, room.getPlayback()); // Success
          })
        })
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
      pauseDevice(user); // Pause the user's playback
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
      deleteTempPlaylist(user, getRoom(roomID).playlist.id)
      getRoom(roomID).members.forEach(user => pauseDevice(user))
      closeRoom(roomID); // Close the room, updating everyone's user objects and removing the room
      // Go through all the clients in the room
      io.of('/').in(roomID).clients((error, socketIDs) => {
        if(error) {
          socket.emit(events.ERROR, `Error getting room clients: ${error}`)
        } else {
          // Let all the members know the room has been destroyed
          socket.to(roomID).emit(events.DESTROYED, roomID);
          // Let the host know the room has been destroyed successfully
          socket.emit(events.DESTROY, roomID)
          // Make all clients leave socket room
          socketIDs.forEach(socketID => io.sockets.sockets[socketID].leave(roomID))
          
          // TODO: Destroy temporary playlist
        }
      })
    }
  })

  // When receiving the play event, resume the song
  socket.on(events.PLAY, () => {
    const user = getUser(socket.id);
    let room = getRoom(user.room);
    room.playing = true;
    room.members.forEach(user => resumeSong(user))
    io.to(room.id).emit(events.PLAY, room.getPlayback())
  })

  // When receiving the pause event, resume the song
  socket.on(events.PAUSE, () => {
    const user = getUser(socket.id);
    let room = getRoom(user.room);
    room.playing = false;
    room.members.forEach(user => pauseDevice(user))
    io.to(room.id).emit(events.PAUSE, room.getPlayback())
  })

  // When receiving the jump event, make the song jump to a position
  socket.on(events.JUMP, (pos) => {
    const user = getUser(socket.id);
    let room = getRoom(user.room);
    room.members.forEach(user => setSongPosition(user, pos))
  })

  // When receiving the skip event, skip the song
  socket.on(events.SKIP, () => {
    const user = getUser(socket.id);
    let room = getRoom(user.room);
    room.members.forEach(user => nextSong(user))
  })

  // When receiving the previous event, go to the previous song
  socket.on(events.PREVIOUS, () => {
    const user = getUser(socket.id);
    let room = getRoom(user.room);
    room.members.forEach(user => previousSong(user))
  })

  // On disconnect remove the user
  socket.on(events.DISCONNECT, () => {
    removeUser(socket.id);
  });
}
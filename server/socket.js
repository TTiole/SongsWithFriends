const { addUser, removeUser, getUser } = require("./users");
const { addRoom, getRoom, closeRoom } = require("./rooms");
const {
  setSongPosition,
  nextSong,
  previousSong,
  resumeSong,
  pauseDevice,
  requestContext,
  playContext,
  createTempPlaylist,
  deleteTempPlaylist,
  requestAddQueue,
  requestDeleteQueue,
  requestReorderQueue,
  setVolume
} = require("./requests");
const events = require("../helpers/socket_events");
const { makeid } = require("../helpers/string_utils");

module.exports = (io) => (socket) => {
  console.log("New connection");
  // User has entered the website
  // Add it to the list of users
  addUser(socket.id);

  // On room creation add a new room and change the user to be a host
  socket.on(events.CREATE, () => {
    const user = getUser(socket.id);
    if (user.room !== "") {
      socket.emit(events.ERROR, "You're already in a room");
    } else {
      const room = addRoom(user); // Create the room in the rooms object
      socket.join(room.id); // Join the socket room
      console.log(`roomId: ${room.id}`);
      user.room = room.id; // Update the room property of user
      user.host = true; // Set the user as host
      createTempPlaylist(user, makeid(16)).then(
        ({ id, name, uri, owner, tracks }) => {
          room.playlist = { id, name, uri, owner, tracks };
          playContext(user, uri).then(data => { // Begin the queue context for the host
            pauseDevice(user);
            socket.emit(events.CREATE, room.getPlayback(), room.id); // Emit the event back if success
          })
        }
      );
    }
  });

  // On room join add the user to the members array of the room
  socket.on(events.JOIN, (id) => {
    const user = getUser(socket.id);
    if (user.room !== "") {
      socket.emit(events.ERROR, "You're already in a room");
    } else {
      let room = getRoom(id);
      if (room == null) {
        socket.emit(events.ERROR, "The room you entered is invalid");
      } else {
        socket.join(id); // Join the socket room
        user.room = id; // Update the room property of user

        // Get the currently playing information from host
        requestContext(room.host).then((playback) => {
          room.currentSong = playback.item ? playback.item.name : "";
          room.currentAlbum = playback.item ? playback.item.album.name : "";
          room.currentArtists = playback.item ? playback.item.artists.map((artist) => " " + artist.name).toString().slice(1) : [];
          room.currentSongDuration = playback.item ? playback.item.duration_ms / 1000 : 0;
          room.playing = playback.is_playing;
          room.initialPosition = playback.progress_ms / 1000;
          if (user.isGuest()) { // Guest
            socket.emit(events.JOIN, room.getPlayback()); // Success
            room.addGuest(user);
          } else {
            room.addMember(user);
            playContext(
              user,
              playback.context.uri,
              playback.item.uri,
              playback.progress_ms
            ).then(() => {
              if (!room.is_playing)
                pauseDevice(user);
              socket.emit(events.JOIN, room.getPlayback()); // Success
            });
          }
        });
      }
    }
  });

  // On room leave, reset the user room property
  socket.on(events.LEAVE, () => {
    leaveRoom();
  });

  // On room destroy, get rid of the room, and wipe the information off all its users
  socket.on(events.DESTROY, () => {
    destroyRoom();
  });

  socket.on(events.SET_VOLUME, (percentage) => {
    const user = getUser(socket.id);
    setVolume(user, percentage)
    socket.emit(events.SET_VOLUME, percentage)
  })

  socket.on(events.QUEUE_ADD, (track) => {
    const user = getUser(socket.id);
    let room = getRoom(user.room);
    requestAddQueue(user.isGuest() ? room.host : user, room.playlist.id, track).then(() => {
      room.playlist.tracks.items.push(track);
      io.to(room.id).emit(events.QUEUE_ADD, room.getPlayback());
    });
  });

  socket.on(events.QUEUE_REMOVE, (track) => {
    const user = getUser(socket.id);
    let room = getRoom(user.room);
    requestDeleteQueue(user.isGuest() ? room.host : user, room.playlist.id, track).then(() => {
      //! Better, shorter way to do this?
      room.playlist.tracks.items = room.playlist.tracks.items.filter(item => item.name !== track.name);
      io.to(room.id).emit(events.QUEUE_REMOVE, room.getPlayback());
    });
  });

  socket.on(events.QUEUE_REORDER, (track, offset) => {

    const user = getUser(socket.id);
    let room = getRoom(user.room);

    //  Find the selected song's index in queue
    let trackIndex = room.playlist.tracks.items.findIndex(item => item.name === track.name);
    //  The new offset is always either current index +1 or -1
    let newOffset = trackIndex + offset;

    //  Don't reorder songs that on very top or very buttom
    if (newOffset < 0)
      newOffset = 0;
    if (newOffset >= room.playlist.tracks.items.length)
      newOffset = room.playlist.tracks.items.length - 1;

    requestReorderQueue(user.isGuest() ? room.host : user, room.playlist.id, trackIndex, newOffset).then(() => {
      //  Save the reordered track and delete it from queue
      let tmpTrack = room.playlist.tracks.items[trackIndex];
      room.playlist.tracks.items.splice(trackIndex, 1);
      //  Add the reordered track back to the new offset
      room.playlist.tracks.items.splice(newOffset, 0, tmpTrack);
      io.to(room.id).emit(events.QUEUE_REORDER, room.getPlayback());
    })
  });

  // When receiving the play event, resume the song
  socket.on(events.PLAY, () => {
    const user = getUser(socket.id);
    let room = getRoom(user.room);
    room.playing = true;
    room.members.forEach((user) => resumeSong(user));
    io.to(room.id).emit(events.PLAY, room.getPlayback());
  });

  // When receiving the pause event, resume the song
  socket.on(events.PAUSE, () => {
    const user = getUser(socket.id);
    let room = getRoom(user.room);
    room.playing = false;
    room.members.forEach((user) => pauseDevice(user));
    io.to(room.id).emit(events.PAUSE, room.getPlayback());
  });

  // When receiving the jump event, make the song jump to a position
  socket.on(events.JUMP, (pos) => {
    const user = getUser(socket.id);
    let room = getRoom(user.room);
    room.initialPosition = pos / 1000;
    Promise.all(room.members.map((user) => setSongPosition(user, pos))).then(datas => {
      io.to(room.id).emit(events.UPDATE_PLAYBACK, room.getPlayback());
    });
  });

  // When receiving the skip event, skip the song
  socket.on(events.SKIP, () => {
    const user = getUser(socket.id);
    let room = getRoom(user.room);

    Promise.all(room.members.map((user) => nextSong(user))).then((datas) => {
      requestContext(room.host).then((playback) => {
        room.currentSong = playback.item.name;
        room.currentAlbum = playback.item.album.name;
        room.currentArtists = playback.item.artists.map((artist) => " " + artist.name).toString().slice(1);
        room.currentSongDuration = playback.item.duration_ms / 1000;
        room.playing = true;
        io.to(room.id).emit(events.SKIP, room.getPlayback());
      });
    });
  });

  // When receiving the previous event, go to the previous song
  socket.on(events.PREVIOUS, () => {
    const user = getUser(socket.id);
    let room = getRoom(user.room);
    Promise.all(room.members.map((user) => previousSong(user))).then((datas) => {
      requestContext(room.host).then((playback) => {
        room.currentSong = playback.item.name;
        room.currentAlbum = playback.item.album.name;
        room.currentArtists = playback.item.artists.map((artist) => " " + artist.name).toString().slice(1);
        room.playing = true;
        room.currentSongDuration = playback.item.duration_ms / 1000;
        io.to(room.id).emit(events.PREVIOUS, room.getPlayback());
      });
    });
  });

  socket.on(events.UPDATE_PLAYBACK, () => {
    const user = getUser(socket.id);
    let room = getRoom(user.room);
    requestContext(room.host).then(playback => {
      room.currentSong = playback.item.name;
      room.currentAlbum = playback.item.album.name;
      room.currentArtists = playback.item.artists.map((artist) => " " + artist.name).toString().slice(1);
      room.currentSongDuration = playback.item.duration_ms / 1000;
      io.to(room.id).emit(events.UPDATE_PLAYBACK, room.getPlayback());
    })
  })

  // On disconnect remove the user
  socket.on(events.DISCONNECT, () => {
    const user = getUser(socket.id);
    if (user.host) destroyRoom();
    else if (user.room !== "")
      // User is a member
      leaveRoom();
    removeUser(socket.id);
  });

  /* ----- HELPERS ------ */

  const leaveRoom = () => {
    const user = getUser(socket.id);
    if (user.room === "") {
      socket.emit(events.ERROR, "You are not in a room");
    } else {
      let room = getRoom(user.room);

      socket.leave(user.room); // Leave the socket room
      user.room = ""; // Update the user object
      socket.emit(events.LEAVE, room.id);
      if (user.isGuest()) {
        room.removeGuest(user);
      } else {
        room.removeMember(user); // Remove the user from the room object
        pauseDevice(user); // Pause the user's playback
      }
    }
  };

  const destroyRoom = () => {
    const user = getUser(socket.id);
    const roomID = user.room;
    if (roomID === "") {
      socket.emit(events.ERROR, "You are not in a room");
    } else if (!user.host) {
      socket.emit(events.ERROR, "You are not a host");
    } else {
      deleteTempPlaylist(user, getRoom(roomID).playlist.id);
      getRoom(roomID).members.forEach((user) => pauseDevice(user));
      closeRoom(roomID); // Close the room, updating everyone's user objects and removing the room
      // Go through all the clients in the room
      io.of("/")
        .in(roomID)
        .clients((error, socketIDs) => {
          if (error) {
            socket.emit(events.ERROR, `Error getting room clients: ${error}`);
          } else {
            // Let all the members know the room has been destroyed
            socket.to(roomID).emit(events.DESTROYED, roomID);
            // Let the host know the room has been destroyed successfully
            socket.emit(events.DESTROY, roomID);
            // Make all clients leave socket room
            socketIDs.forEach((socketID) =>
              io.sockets.sockets[socketID].leave(roomID)
            );
          }
        });
    }
  };
};

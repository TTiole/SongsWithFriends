const {makeid} = require('../helpers/string_utils');
const {getUser} = require('./users')
let rooms = [];
class Room {
  constructor(id, host) {
    this.id = id; this.members = [host]; this.host = host;
    this.playing = false;
    this.playlist = null;
    this.currentSong = "";
    this.currentSongDuration = 0;
    this.initialPosition = 0;
  }

  // Adds a member to the room
  addMember = user => {
    this.members.push(user);
  }

  // Removes a member from a room
  removeMember = user => {
    this.members = this.members.filter(member => member.id !== user.id);
  }

  getPlayback = () => ({playing: this.playing, playlist: this.playlist, currentSong: this.currentSong, currentSongDuration: this.currentSongDuration, initialPosition: this.initialPosition})
}

/**
 * Takes a user and creates a room with that user being host. Adds the room to the rooms array
 * @param {User} host User object which will be the host of the room
 */
const addRoom = (host) => {
  const id = makeid(8);
  const room = new Room(id, host)
  rooms.push(room);
  return room;
}

/**
 * Takes a room ID and removes the room from the rooms array, and updates all the members in the room to no longer be in it.
 * @param {String} id Room ID
 */
const closeRoom = id => {
  const room = getRoom(id);
  // Go through each member and remove them from the room
  room.members.forEach(member => {
    // Get the reference from the users array
    let user = getUser(member.id);
    user.host = false;
    user.room = "";
  })
  rooms = rooms.filter(room => room.id !== id)
} 

/**
 * Takes a room id and returns the user object associated with the host
 * @param {String} id Room ID
 * @returns {User}
 */
const getHost = id => getRoom(id).host

/**
 * Takes a room id and returns the room object
 * @param {String} id Room ID
 * @returns {Room}
 */
const getRoom = id => rooms.find(room => room.id === id)

module.exports = {
  addRoom, closeRoom, getRoom, getHost
}
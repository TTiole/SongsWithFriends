const {makeid} = require('../helpers/string_utils');
const {getUser} = require('./users')
let rooms = [];
class Room {
  constructor(id, host) {
    this.id = id; this.members = [host]; this.host = host;
  }

  addMember = user => {
    this.members.push(user);
  }

  removeMember = user => {
    this.members = this.members.filter(member => member.id !== user.id);
  }
}

const addRoom = (host) => {
  const id = makeid(8);
  host.room = id;
  host.host = true;
  const room = new Room(id, host)
  rooms.push(room);
  return room;
}
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

const getHost = id => getRoom(id).host

const getRoom = id => rooms.find(room => room.id === id)

module.exports = {
  addRoom, closeRoom, getRoom, getHost
}
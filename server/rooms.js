let rooms = [];
class Room {
  constructor(id, members, host) {
    this.id = id; this.members = members; this.host = host;
  }

  addMember = user => {
    this.members.push(user);
  }

  removeMember = user => {
    this.members = this.members.filter(member => member.id !== user.id);
  }
}

const addRoom = (id, members, host) => rooms.push(new Room(id, members, host))
const closeRoom = id => {
  rooms = rooms.filter(room => room.id !== id)
} 
const getRoom = id => rooms.find(room => room.id === id)
const getRoomByMember = uid => rooms.find(room => room.getMembers().find(user => user.id === uid) !== undefined)

module.exports = {
  addRoom, closeRoom, getRoom, getRoomByMember
}
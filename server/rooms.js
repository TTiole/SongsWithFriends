let rooms = [];
class Room {
  constructor(id, members, host) {
    this.id = id; this.members = members; this.host = host;
  }

  getId = () => this.id;

  getMembers = () => this.members;
  
  getHost = () => this.host;

  addMember = user => {
    this.members.push(user);
  }

  removeMember = user => {
    this.members = this.members.filter(member => member.getId() !== user.getId());
  }
}

const addRoom = (id, members, host) => rooms.push(new Room(id, members, host))
const closeRoom = id => {
  rooms = rooms.filter(room => room.getId() !== id)
} 
const getRoom = id => rooms.find(room => room.getId() === id)
const getRoomByMember = uid => rooms.find(room => room.getMembers().find(user => user.getId() === uid) !== undefined)

module.exports = {
  addRoom, closeRoom, getRoom, getRoomByMember
}
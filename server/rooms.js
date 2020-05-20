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
class User {
  constructor(id, name, token) {
    this.id = id; this.name = name; this.token = token;
  }

  getId = () => this.id;
  getName = () => this.name;
  getToken = () => this.token;
}
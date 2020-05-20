module.exports = class User {
  constructor(id, name, token, token_type) {
    this.id = id;
    this.name = name;
    this.token = token;
    this.token_type = token_type;
  }

  getId = () => this.id;
  getName = () => this.name;
  getToken = () => this.token;
  getTokenType = () => this.token_type;
};

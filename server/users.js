let users = [];
class User {
  constructor(id) {
    this.id = id;
    this.name = "";
    this.token = "";
    this.token_type = "";
    this.playback_device = "";
    this.room = "";
    this.host = false;

    // Music related objects/vars
    this.playlists = [];
  }

  // Takes spotify token information and sets it to the user. Returns the user object
  auth = (token, token_type) => {
    this.token = token;
    this.token_type = token_type;
    return this; // return the user object for chaining
  };

  // Returns all the information that is OK for the client to have
  clientInfo = () => ({
    name: this.name,
    id: this.id,
    playbackDevice: this.playback_device,
  });
}

/**
 * Returns the user object given an ID
 * @param {String} id user ID (given by the socket)
 * @returns {User}
 */
const getUser = (id) => users.find((user) => user.id === id);

/**
 * Takes the user ID and token information to authenticate the user with Spotify
 * @param {String} id User id (given by the socket)
 * @param {String} token The spotify token
 * @param {String} token_type The spotify token type
 * @returns {User} returns the user object which was authenticated
 */
const authUser = (id, token, token_type) => getUser(id).auth(token, token_type);

/**
 * Adds a new user to the global users array
 * @param {String} id User ID (given by the socket)
 */
const addUser = (id) => users.push(new User(id));

/**
 * Removes a new user to the global users array
 * @param {String} id User ID (given by the socket)
 */
const removeUser = (id) => {
  users = users.filter((user) => user.id !== id);
};

module.exports = {
  getUser,
  authUser,
  addUser,
  removeUser,

  addPlaylists,
  getSinglePlaylist,
  getAllPlaylists,
};

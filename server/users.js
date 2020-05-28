let users = [];
class User {
  constructor(id) {
    this.id = id;
    this.name = "";
    this.token = "";
    this.token_type = "";
    this.playback_device = null;
    this.playback_devices = [];
    this.room = "";
    this.host = false;
    this.spotify_id = 0;

    // Music related objects/vars
    this.playlists = [];
  }

  // Takes spotify token information and sets it to the user. Returns the user object
  auth = (token, token_type) => {
    this.token = token;
    this.token_type = token_type;
    return this; // return the user object for chaining
  };

  setDevices = (devices) => {
    this.playback_devices = devices;
    // Get the device that is active
    this.playback_device = devices.find((device) => device.is_active);
  };

  // Returns all the information that is OK for the client to have
  clientInfo = () => ({
    name: this.name,
    id: this.id,
    spotify_id: this.spotify_id,
    playbackDevice: this.playback_device,
    playbackDevices: this.playback_devices,
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
 * Removes a existing user from the global users array
 * @param {String} id User ID (given by the socket)
 */
const removeUser = (id) => {
  users = users.filter((user) => user.id !== id);
};

/**
 * Add a single playlist object to a specific user's playlist list
 * @param {String} id User ID
 * @param {Object} playlist playlist object that contains playlist name, id, owner, numTracks, tracks
 */
const addSinglePlaylist = (id, playlist) =>
  getUser(id).playlists.push(playlist);

/**
 * Get a single playlist object from a specific user's playlist list
 * @param {String} id User ID
 * @param {String} playlist playlist name
 */
const getSinglePlaylist = (id, playlistName) =>
  getUser(id).playlists.find((playlist) => playlist.name === playlistName);

/**
 * Add all the playlist objects from a specific user's playlist list
 * @param {String} id User ID
 */
const getAllPlaylists = (id) => {
  return getUser(id).playlists;
};

module.exports = {
  getUser,
  authUser,
  addUser,
  removeUser,

  addSinglePlaylist,
  getSinglePlaylist,
  getAllPlaylists,
};

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

  auth = (token, token_type) => {
    this.token = token;
    this.token_type = token_type;
    return this; // return the user object for chaining
  };

  clientInfo = () => ({
    name: this.name,
    id: this.id,
    playbackDevice: this.playback_device,
  });
}

const getUser = (id) => users.find((user) => user.id === id);
// This returns the user as well
const authUser = (id, token, token_type) => getUser(id).auth(token, token_type);
const addUser = (id) => users.push(new User(id));
const removeUser = (id) => {
  users = users.filter((user) => user.id !== id);
};

const addPlaylists = (id, playlist) => getUser(id).playlists.push(playlist);

const getSinglePlaylist = (id, playlistName) =>
  getUser(id).playlists.find((playlist) => playlist.name === playlistName);

const getAllPlaylists = (id) => {
  return getUser(id).playlists;
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

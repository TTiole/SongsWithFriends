const fetch = require("node-fetch");

const { getUser } = require("./users");

// Use authorization code in order to get a user token
const getToken = (authCode) =>
  fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(
          process.env.SPOTIFY_CLIENT_ID +
            ":" +
            process.env.SPOTIFY_CLIENT_SECRET
        ).toString("base64"),
    },
    body: `grant_type=authorization_code&code=${authCode}&redirect_uri=${encodeURIComponent(
      process.env.REDIRECT_URI
    )}`,
  }).then((response) => response.json());

// Get user information
const getUserInfo = (user) =>
  fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: {
      Authorization: user.getTokenType() + " " + user.getToken(),
    },
  }).then((response) => response.json());

const getUserPlaylists = (user) => {
  return fetch(`https://api.spotify.com/v1/users/${user.name}/playlists`, {
    method: "GET",
    headers: {
      Authorization: user.getTokenType() + " " + user.getToken(),
    },
  }).then((response) => response.json());
};

const getSinglePlaylist = (user, playlistID) => {
  fetch(`https://api.spotify.com/v1/playlists/${playlist_id}`, {
    method: "GET",
    headers: {
      Authorization: user.getTokenType() + " " + user.getToken(),
    },
  }).then((response) => response.json());
};

module.exports = {
  getUserInfo,
  getToken,
  getUserPlaylists,
  getSinglePlaylist,
};

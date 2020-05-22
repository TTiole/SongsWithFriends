const fetch = require("node-fetch");

/**
 * Takes a path and automatically sends a request to it, using the passed user's token
 * @param {String} path Path to Spotify endpoint
 * @param {User} user User authorizing the request
 * @returns {Promise} Returns a promise containing the parsed json data
 */
const requestSpotify = (path, user) => {
  // Input validation
  if (path == null || path === "" || !path.includes("/"))
    throw new Error("Path is invalid");
  if (user == null) throw new Error("User is undefined or has not been passed");
  if (user.token_type === "" || user.token === "")
    throw new Error("User is not authorized");
  try {
    // send the request
    return fetch(`https://api.spotify.com/v1${path}`, {
      method: "GET",
      headers: {
        Authorization: `${user.token_type} ${user.token}`,
      },
    }).then((resp) => resp.json());
  } catch (err) {
    console.error(err);
    throw new Error("Error calling spotify API. See above");
  }
};

// Use authorization code in order to get a user token
const requestToken = (authCode) =>
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
const requestUserInfo = (user) => requestSpotify("/me", user);

// Get user playlists
const requestPlaylists = (user) =>
  requestSpotify(`/users/${user.name}/playlists`, user);

// Get all the tracks within the specified playlist
const requestTracks = (user, trackID) =>
  requestSpotify(`/playlists/${trackID}/tracks`, user);

module.exports = {
  requestUserInfo,
  requestToken,
  requestPlaylists,
  requestTracks,
};

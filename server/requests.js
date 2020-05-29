const fetch = require("node-fetch");

/**
 * Takes a path and automatically sends a request to it, using the passed user's token
 * @param {String} path Path to Spotify endpoint
 * @param {User} user User authorizing the request
 * @param {String} method Optional, default value = GET. The request method
 * @param {Object} body Optional, default value = null. The request body. Not compatible with GET method.
 * @param {Boolean} expectEmptyBody Optional, default value = false. Determines whether fetch should expect an empty body
 * @returns {Promise} Returns a promise containing the parsed json data
 */
const requestSpotify = (
  path,
  user,
  method = "GET",
  body = null,
  expectEmptyBody = false
) => {
  // Input validation
  if (path == null || path === "" || !path.includes("/"))
    throw new Error("Path is invalid");
  if (user == null) throw new Error("User is undefined or has not been passed");
  if (user.token_type === "" || user.token === "")
    throw new Error("User is not authorized");

  try {
    const fetchObject = {
      method,
      headers: {
        Authorization: `${user.token_type} ${user.token}`,
      },
    };

    // Add the body to the parameters if it has been passed and is not a GET
    if (method !== "GET" && body !== null) {
      fetchObject.body = JSON.stringify(body);
      fetchObject.headers["Content-Type"] = "application/json";
    }
    // send the request
    return fetch(`https://api.spotify.com/v1${path}`, fetchObject).then(
      (resp) => {
        if (resp.status === 204 || expectEmptyBody)
          // No content, returned by POST and PUT requests
          return resp.text();
        if (resp.status >= 300)
          resp.text().then((text) => {
            throw new Error(text);
          });
        else return resp.json();
      }
    );
  } catch (err) {
    console.error(err);
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

// Search for songs, albums, etc.
const requestSearch = (user, itemName, searchType) => {
  // console.log(`searching: /search?q=name:${itemName}&type=${searchType}`);
  return requestSpotify(`/search?q=${itemName}&type=${searchType}`, user);
};

// Get the user's playback devices
const requestDevices = (user) => requestSpotify(`/me/player/devices`, user);

// Set the user's playback device
const assignDevice = (user, device_id) =>
  requestSpotify(`/me/player`, user, "PUT", {
    device_ids: [device_id],
    play: false,
  });

// Pause the user's device
// If device_id not passed, it'll pause the current device
const pauseDevice = (user) => requestSpotify(`/me/player/pause`, user, "PUT");

// Go to previous song
const previousSong = (user) =>
  requestSpotify(`/me/player/previous`, user, "POST");

// Go to next song
const nextSong = (user) => requestSpotify(`/me/player/next`, user, "POST");

// Set the position of a song. pos is the time from the start in ms
// Optionally takes in device_id
const setSongPosition = (user, position_ms) =>
  requestSpotify(`/me/player/seek?position_ms=${position_ms}`, user, "PUT");

// Resume song
const resumeSong = (user) => requestSpotify(`/me/player/play`, user, "PUT");

// Get information on what's currently playing
const requestContext = (user) => requestSpotify(`/me/player`, user);

// Play music based off a context at a specific song and position
const playContext = (user, context_uri, offset, position_ms) =>
  requestSpotify(`/me/player/play`, user, "PUT", {
    context_uri,
    offset: { uri: offset },
    position_ms,
  });

// Rqeust to add an item(track) to the playlist
//! IMPORTANT: THERES A BUG WHICH REMOVES ALL SONGS FROM THE PLAYLIST HERE......
const requestAddQueue = (user, playlist_id, trackObj) => {
  return requestSpotify(
    `/playlists/${playlist_id}/tracks?uris=${trackObj.uri}`,
    user,
    "POST"
  );
};

// Rqeust to delete an item(track) to the playlist
// TODO: Add offset and/or snapshot_id to remove specific track
const requestDeleteQueue = (user, playlist_id, trackObj) => {
  let reqBody = {
    tracks: [
      {
        uri: trackObj.uri,
      },
    ],
  };
  return requestSpotify(
    `/playlists/${playlist_id}/tracks`,
    user,
    "DELETE",
    reqBody
  );
};

const requestReorderQueue = (user, playlist_id, itemOffset, newOffset) => {
  let reqBody = {
    range_start: itemOffset,
    insert_before: newOffset,
  };
  return requestSpotify(
    `/playlists/${playlist_id}/tracks`,
    user,
    "PUT",
    reqBody
  );
};

// Creates temporary
const createTempPlaylist = (user, name) =>
  requestSpotify(`/users/${user.spotify_id}/playlists`, user, "POST", {
    name,
    public: false,
    collaborative: true,
    description:
      "Temporary playlist for Songs with Friends. Deleted once room is destroyed",
  });

const deleteTempPlaylist = (user, playlist_id) =>
  requestSpotify(
    `/playlists/${playlist_id}/followers`,
    user,
    "DELETE",
    null,
    true
  );

module.exports = {
  requestUserInfo,
  requestToken,
  requestPlaylists,
  requestTracks,
  requestSearch,
  requestDevices,
  assignDevice,
  pauseDevice,
  previousSong,
  nextSong,
  setSongPosition,
  resumeSong,
  playContext,
  requestContext,
  requestAddQueue,
  requestDeleteQueue,
  requestReorderQueue,
  createTempPlaylist,
  deleteTempPlaylist,
};

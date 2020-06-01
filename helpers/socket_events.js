// Add song to queue
const QUEUE_ADD = "queue_add";
// Remove song from queue
const QUEUE_REMOVE = "queue_remove";
// Reorder songs from queue
const QUEUE_REORDER = "queue_reoder";
// Play the music
const PLAY = "play";
// Pause the music
const PAUSE = "pause";
// Skip a song
const SKIP = "skip";
// Previous song
const PREVIOUS = "previous"
// Jump to song position
const JUMP = "jump"
// Disconnect from the server
const DISCONNECT = "disconnect";
// Connect to the server
const CONNECT = "connect";
// Join a room
const JOIN = "swf-join";
// Leave a room
const LEAVE = "leave";
// Create a room
const CREATE = "create";
// Destroy a room (that you own)
const DESTROY = "destroy";
// Be kicked out due to a room that you don't own being destroyed
const DESTROYED = "destroyed"
// Display error
const ERROR = "swf-error";

const UPDATE_PLAYBACK = "update_playback"

const SET_VOLUME = "set_volume"

module.exports = {
  QUEUE_ADD, QUEUE_REMOVE, QUEUE_REORDER,
  PLAY, PAUSE, SKIP, PREVIOUS, JUMP, UPDATE_PLAYBACK, SET_VOLUME,
  DISCONNECT, CONNECT,
  JOIN, LEAVE, CREATE, DESTROY, DESTROYED,
  ERROR
}
import {JOIN_ROOM, GET_PLAYLISTS, CREATE_ROOM, PLAY, RESUME, PAUSE, SKIP, PREVIOUS, JUMP, ADD_QUEUE, REMOVE_QUEUE, REORDER_QUEUE} from './action_types'

export const joinRoomPlaybackSuccess = (playback) => {
  return {
    type: JOIN_ROOM,
    payload: playback
  }
}

export const getPlaylists = (playback) => {
  return {
    type: GET_PLAYLISTS,
    payload: playback
  }
}

export const createRoomPlaybackSuccess = (playback) => {
  return {
    type: CREATE_ROOM,
    payload: playback
  }
}

export const playSucess = (playback) => {
  return {

  }
}
import {JOIN_ROOM, MODIFY_PLAYBACK, TOGGLE_MUTE} from './action_types'

const playbackActionGenerator = (type) => (playback) => ({
  type, payload: playback
})

export const joinRoomPlaybackSuccess = (roomID, playback) => {
  return {
    type: JOIN_ROOM, payload: {roomID, playback}
  }
}
export const modifyPlayback = playbackActionGenerator(MODIFY_PLAYBACK)

export const toggleMute = mute => ({
  type: TOGGLE_MUTE, payload: mute
})
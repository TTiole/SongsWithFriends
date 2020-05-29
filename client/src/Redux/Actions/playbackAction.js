import {JOIN_ROOM, CREATE_ROOM, MODIFY_PLAYBACK} from './action_types'

const playbackActionGenerator = (type) => (playback) => ({
  type, payload: playback
})

export const joinRoomPlaybackSuccess = playbackActionGenerator(JOIN_ROOM)

export const createRoomSuccess = playbackActionGenerator(CREATE_ROOM)
export const modifyPlayback = playbackActionGenerator(MODIFY_PLAYBACK)

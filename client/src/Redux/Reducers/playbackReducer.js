import {JOIN_ROOM, MODIFY_PLAYBACK, CREATE_ROOM, TOGGLE_MUTE} from '../Actions/action_types'

const initialState = {playback: null, muted: false}

export default  (state = initialState, action) => {
  switch(action.type) {
    case MODIFY_PLAYBACK:
    return {...state, playback: action.payload}
    case JOIN_ROOM:
    case CREATE_ROOM:
      return {...state, playback: action.payload.playback}
    case TOGGLE_MUTE:
      return {...state, muted: action.payload}
    default: return state;
  }

}
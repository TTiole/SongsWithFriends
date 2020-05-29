import {JOIN_ROOM, MODIFY_PLAYBACK, CREATE_ROOM} from '../Actions/action_types'

const initialState = {playback: null}

export default  (state = initialState, action) => {
  switch(action.type) {
    case JOIN_ROOM:
    case CREATE_ROOM:
    case MODIFY_PLAYBACK:
      return {...state, playback: action.payload}
    default: return state;
  }

}
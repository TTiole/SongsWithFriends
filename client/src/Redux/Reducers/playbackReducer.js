import {JOIN_ROOM, GET_PLAYLISTS, CREATE_ROOM} from './action_types'
import io from "socket.io-client";

const initialState = {playback: null}

export default  (state = initialState, action) => {
  switch(action.type) {
    case JOIN_ROOM:
    case CREATE_ROOM:
      return {...state, playback: action.payload}
    default: return state;
  }

}
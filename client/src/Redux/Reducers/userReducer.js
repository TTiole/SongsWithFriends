import {AUTHENTICATE_USER, CREATE_ROOM, JOIN_ROOM, DESTROY_ROOM, DESTROYED_ROOM, LEAVE_ROOM, CONNECT, GUEST_LOGIN, MODIFY_USER, LOGOUT} from '../Actions/action_types'


const initialState = {socket: null, userID: "", user: null, loggedIn: false, member: false, host: false, roomID: "", guest: false}

export default  (state = initialState, action) => {
  switch(action.type) {
    case CONNECT:
      return {...state, socket: action.payload}
    case AUTHENTICATE_USER:
      return {...state, user: action.payload, loggedIn: true, userID: state.socket.id}
    case GUEST_LOGIN:
      return {...state, loggedIn: true, guest: true, userID: state.socket.id}
    case CREATE_ROOM:
      return {...state, host: true, roomID: action.payload}
    case JOIN_ROOM:
      return {...state, member: true}
    case DESTROYED_ROOM:
    case LEAVE_ROOM:
      return {...state, member: false}
    case DESTROY_ROOM:
      return {...state, host: false}
    case MODIFY_USER:
      return {...state, user: action.payload}
    case LOGOUT:
      state.socket.disconnect(true);
      return initialState
    default: return state;
  }

}
import {AUTHENTICATE_USER, CREATE_ROOM, CONNECT, JOIN_ROOM} from './action_types'

export const connectUser = (server) => {
  return {
    type: CONNECT,
    payload: server
  }
}

export const authenticateUser = (code, userID) => (dispatch, getState, api) => {
  return api.get(`/authSuccess`, {userID, code}, (data) => {
    dispatch(completeAuthenticateUser(data))
  })
}

export const joinRoom = () => {
  return {
    type: JOIN_ROOM,
    payload: null
  }
}

const completeAuthenticateUser = user => {
  return {
    type: AUTHENTICATE_USER,
    payload: user
  }
}

export const createRoomUserSuccess = (roomID) => {
  return {
    type: CREATE_ROOM,
    payload: roomID
  }
}
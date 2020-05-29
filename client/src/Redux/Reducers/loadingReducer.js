import {DEACTIVATE_LOADING, ACTIVATE_LOADING, CLOSE_RESPONSE_MODAL, OPEN_RESPONSE_MODAL} from '../Actions/action_types.js'

const initialState = {loading: false, modalOpen: false, modalText: ''};

export default (state = initialState, action) => {
  switch(action.type) {
    case DEACTIVATE_LOADING:
    case ACTIVATE_LOADING:
      return {
        ...state, loading: action.payload
      }
    case CLOSE_RESPONSE_MODAL:
    case OPEN_RESPONSE_MODAL:
      return {
        ...state, modalOpen: action.payload.open, modalText: action.payload.text
      }
    default:
      return state;
  }
}
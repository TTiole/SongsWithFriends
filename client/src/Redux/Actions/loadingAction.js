import {DEACTIVATE_LOADING, ACTIVATE_LOADING, CLOSE_RESPONSE_MODAL, OPEN_RESPONSE_MODAL} from './action_types'

export const deactivateLoading = () => {
  return {
    type: DEACTIVATE_LOADING,
    payload: false
  }
}

export const activateLoading = () => {
  return {
    type: ACTIVATE_LOADING,
    payload: true
  }
}

export const triggerResponseModal = (text) => {
  return {
    type: OPEN_RESPONSE_MODAL,
    payload: {open: true, text}
  }
}

export const closeResponseModal = () => {
  return {
    type: CLOSE_RESPONSE_MODAL,
    payload: {open: false, text: ''}
  }
}

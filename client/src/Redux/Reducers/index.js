import { combineReducers } from 'redux';

import userReducer from './userReducer.js'
import playbackReducer from './playbackReducer'
import loadingReducer from './loadingReducer.js'

export default combineReducers({ userReducer,playbackReducer, loadingReducer })
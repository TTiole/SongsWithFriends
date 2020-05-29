import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from './Reducers'
import thunk from 'redux-thunk'
import api from '../Fetch.js'

let store;
// dev tools middleware
const composeSetup = process.env.NODE_ENV !== 'production' && typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose
store = createStore(rootReducer, composeSetup(
  applyMiddleware(thunk.withExtraArgument(api))
));

export default store;
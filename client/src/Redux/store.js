import {createStore, applyMiddleware, compose} from 'redux'
import rootReducer from './Reducers'
import thunk from 'redux-thunk'
import api from '../Fetch.js'

let store;
if(process.env.REACT_APP_ENVIRONMENT === 'PROD')
  store = createStore(rootReducer, applyMiddleware(thunk.withExtraArgument(api)));
else
  store = createStore(rootReducer, compose(
    applyMiddleware(thunk.withExtraArgument(api)), 
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
  );

export default store;
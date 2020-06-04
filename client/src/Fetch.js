import store from './Redux/store.js'
import {server} from 'helpers/constants'
import {deactivateLoading, activateLoading, triggerResponseModal} from './Redux/Actions/loadingAction'
/**
 * @param {string} url [resource to access]
 * @param {object} queryParamObj [Optional (default null): object containing key-value pairs of query parameters]
 * @param {function} callback [request callback, operates like a .then]
 */
 
 export const get = (url, queryParamObj = null, callback, props = {}, additionalText = null, errorCallback = null) => {
  store.dispatch(activateLoading());
  let path = server+url;
  // Adds query parameters to url
  if(queryParamObj !== null) {
    path = path + '?';
    Object.keys(queryParamObj).forEach((el, i) => {
      if(i !== 0)
        path = path+'&';
      path = `${path}${el}=${queryParamObj[el]}`;
    });
  }

  return fetch(path).then(resp => {
    if(resp.status >= 400) {
      requestError(resp);
      if(errorCallback)
        errorCallback();
      return Promise.reject("Response error");
    } else {
      return resp.json();
    }
  }).then(data => {
    if(additionalText != null)
      store.dispatch(triggerResponseModal(additionalText));
    callback(data);
  })
  .catch(err => console.error(err))
  .finally(() => {
    store.dispatch(deactivateLoading());
  })
}

/**
 * @param {string} url [resource to access]
 * @param {object} body [object containing key-value pairs of json body]
 * @param {function} callback [request callback, operates like a .then]
 */
export const post = (url, queryParamObj = null, body = {}, callback, props, additionalText = null, errorCallback = null) => {
  store.dispatch(activateLoading());
  let path = server+url;
  let error = false;
  // Adds query parameters to url
  if(queryParamObj !== null) {
    path = path + '?';
    Object.keys(queryParamObj).forEach((el, i) => {
      if(i !== 0)
        path = path+'&';
      path = `${path}${el}=${queryParamObj[el]}`;
    });
  }
  return fetch(path, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      'Content-Type':'application/json'
    },
    ...props
  }).then(resp => {
    if(resp.status >= 400) {
      error = resp.status;
      return resp.text();
    } else {
      return resp.json();
    }
  }).then(data => {
    if(error) {
      requestError(error, data);
      if(errorCallback)
        errorCallback();
    }
    if(additionalText != null)
      store.dispatch(triggerResponseModal(additionalText));
    callback(data);
  }).catch(err => console.error(err)).finally(() => {
    store.dispatch(deactivateLoading());
  })
}

const requestError = (code, text) => {
  // Server returned response with an error code that's not success
  // Such an error will be defined by us, so display the modal with the error text
  if(code === 400) {
    store.dispatch(triggerResponseModal(text));
  } else if(code === 500) {
    store.dispatch(triggerResponseModal('There was a server error. Try again later'))
  } else {
    console.log(text);
  }
} 

export default {get, post};
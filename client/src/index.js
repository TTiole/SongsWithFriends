import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

import {Provider} from 'react-redux'
import store from './Redux/store'

import App from "./Components/App/App";

ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
  document.getElementById("root")
);

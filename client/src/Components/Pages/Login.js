import React from 'react';
import './Login.css'

import {connect} from 'react-redux'

const Login = (props) => {
  return (
    <div>
      <a href={`http://localhost:8000/login?userID=${props.userID}`}>
        Try sign in
      </a>
      <button onClick={props.guestLogin}>Guest login</button>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    userID: state.userReducer.userID,
  }
}

export default connect(mapStateToProps, null)(Login)
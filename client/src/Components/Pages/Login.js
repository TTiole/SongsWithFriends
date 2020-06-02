import React from 'react';
import './Login.css'

import {connect} from 'react-redux'
import Typography from '../Typography/Typography'

const Login = (props) => {
  return (
    <div id='login'>
      <div>
        <Typography component="h2" color="#fff" fontSize="30px" align="center">Welcome To Songs With Friends</Typography>
        <Typography component="h6" color="#fff" fontSize="20px" align="center">Whether at a party or across the globe, SWF allows you to enjoy your music <font color="#4af95b">together</font></Typography>
      </div>
      <div id='login-actions'>
        <a href={`http://localhost:8000/login?userID=${props.userID}`} className="button outlined">
          Sign in
        </a>
        <button onClick={props.guestLogin} className="outlined">Guest login</button>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    userID: state.userReducer.userID,
  }
}

export default connect(mapStateToProps, null)(Login)
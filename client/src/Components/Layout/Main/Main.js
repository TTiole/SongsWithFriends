import React from "react";
import { connect } from 'react-redux'
import "./Main.css";

import Login from '../../Pages/Login'
import Play from '../../Pages/Play'
import Room from '../../Pages/Room'
import Chat from "../../Chat/Chat"

const Main = (props) => {
  let Page;
  if (!props.loggedIn)
    Page = Login;
  else if (!props.host && !props.member)
    Page = Room;
  else
    Page = Play;
  return (
    <main id="main-container">
      <Page guestLogin={props.guestLogin} />
      <Chat></Chat>
    </main>
  );
};

const mapStateToProps = (state) => {
  return {
    host: state.userReducer.host,
    loggedIn: state.userReducer.loggedIn,
    member: state.userReducer.member,
  }
}

export default connect(mapStateToProps, null)(Main);
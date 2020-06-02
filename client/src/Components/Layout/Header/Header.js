import React, { useState } from 'react';
import { connect } from 'react-redux'
import './Header.css'
import Popup from '../../Popup/Popup';
import Typography from '../../Typography/Typography'

import { refreshDevices, setDevice, logout } from '../../../Redux/Actions/userAction'
import {
  LEAVE,
  DESTROY,
} from "helpers/socket_events.js";


const Header = (props) => {
  // Sends LEAVE event
  const leaveRoom = () => props.socket.emit(LEAVE);

  // Sends DESTROY event
  const destroyRoom = () => props.socket.emit(DESTROY);

  const [devicesPopup, setDevicesPopup] = useState(false);
  return (
    <header>
      <div id='header-logo'>
        <Typography color="#02bb4f" fontSize="35px" additionalStyles={{ fontFamily: "Architects Daughter" }}>SWF</Typography>
      </div>
      <div id='header-actions'>
        {props.loggedIn ? <button>Invite</button> : null}

        {props.loggedIn && props.user !== null ? <React.Fragment>
          {props.guest ? null : <button onClick={() => setDevicesPopup(true)}>Devices</button>}
          <Popup open={devicesPopup} handleClose={() => setDevicesPopup(false)}>
            {props.user.playbackDevices.map((device) => (
              <button key={device.id} onClick={() => props.setDevice(device.id, props.userID)}>
                {device.name} {device.is_active ? "(Active)" : ""}
              </button>
            ))}
            <button onClick={() => props.refreshDevices(props.userID)}>Refresh Devices</button>
          </Popup>
        </React.Fragment> : null}


        {props.loggedIn ? <button onClick={props.logout}>Log Out</button> : null}

        {props.host ? (
          <button onClick={destroyRoom}>Destroy room</button>
        ) : null}

        {/* Displays if member */}
        {props.member ? (
          <button onClick={leaveRoom}>Leave room</button>
        ) : null}
      </div>
    </header>
  );
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.userReducer.loggedIn,
    guest: state.userReducer.guest,
    host: state.userReducer.host,
    user: state.userReducer.user,
    socket: state.userReducer.socket
  }
}

const mapDispatchToProps = dispatch => {
  return {
    refreshDevices: (userID) => dispatch(refreshDevices(userID)),
    setDevice: (deviceID, userID) => dispatch(setDevice(deviceID, userID)),
    logout: () => dispatch(logout())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
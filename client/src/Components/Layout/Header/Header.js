import React, { useState } from 'react';
import {connect} from 'react-redux'
import './Header.css'
import Popup from '../../Popup/Popup';
import Typography from '../../Typography/Typography'

import { refreshDevices, setDevice, logout } from '../../../Redux/Actions/userAction'


const Header = (props) => {
  const [devicesPopup, setDevicesPopup] = useState(false);
  return (
    <header>
      <div id='header-logo'>
        <Typography color="#02bb4f" fontSize="35px" additionalStyles={{fontFamily:"Architects Daughter"}}>SWF</Typography>
      </div>
      <div id='header-actions'>
        {props.loggedIn && props.user !== null ? <React.Fragment>
          {props.guest ? null:<button onClick={() => setDevicesPopup(true)}>Devices</button>}
          <Popup open={devicesPopup} handleClose={() => setDevicesPopup(false)}>
            {props.user.playbackDevices.map((device) => (
              <button key={device.id} onClick={() => props.setDevice(device.id, props.userID)}>
                {device.name} {device.is_active ? "(Active)" : ""}
              </button>
            ))}
            <button onClick={() => props.refreshDevices(props.userID)}>Refresh Devices</button>
          </Popup>
        </React.Fragment> :null}
        {props.loggedIn ? <button onClick={props.logout}>Log Out</button>:null}
      </div>
    </header>
  );
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.userReducer.loggedIn,
    guest: state.userReducer.guest,
    user: state.userReducer.user
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
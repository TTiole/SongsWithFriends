import React, { useState } from 'react';
import { connect } from 'react-redux'
import './Header.css'
import Popup from '../../Popup/Popup';
import Typography from '../../Typography/Typography'
import RefreshRoundedIcon from '@material-ui/icons/RefreshRounded';
import PhoneAndroidRoundedIcon from '@material-ui/icons/PhoneAndroidRounded';
import LaptopChromebookRoundedIcon from '@material-ui/icons/LaptopChromebookRounded';
import DevicesOtherRoundedIcon from '@material-ui/icons/DevicesOtherRounded';
import Tooltip from '@material-ui/core/Tooltip'

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

  const [inviteOpen, setInviteOpen] = useState(false);

  const [devicesPopup, setDevicesPopup] = useState(false);

  let devices = [];
  if (props.user)
    devices = props.user.playbackDevices.filter(device => !device.is_restricted && !device.is_private_session);
  return (
    <header>
      <div id='header-logo'>
        <Typography color="#02bb4f" fontSize="35px" additionalStyles={{ fontFamily: "Architects Daughter" }}>SWF</Typography>
      </div>
      <div id='header-actions'>
        {props.loggedIn && props.user !== null ? <React.Fragment>
          {props.guest ? null : <button onClick={() => setDevicesPopup(true)}>Devices</button>}
          <Popup open={devicesPopup} className="devices-popup" handleClose={() => setDevicesPopup(false)}>
            <div id="device-popup-header">
              <Typography fontSize="20px" margin="0 30px 0 0">Select the device you want to play music from</Typography>
              <Tooltip arrow title="Refresh" >
                <RefreshRoundedIcon onClick={() => props.refreshDevices(props.userID)} />
              </Tooltip>
            </div>
            {devices.map((device) => (
              <Device key={device.id} {...device} handleClick={() => props.setDevice(device.id, props.userID)} />
            ))}
            {devices.length === 0 ? <Typography fontSize="12px" color="#999">No items to show. Please ensure your devices are connected to the internet. If they are, restart Spotify on them.</Typography> : null}
          </Popup>
        </React.Fragment> : null}
        {props.member || props.host ? <button onClick={() => setInviteOpen(true)}>Invite</button> : null}

        <Popup open={inviteOpen} handleClose={() => setInviteOpen(false)}>
          <div style={{ display: "flex", height: "100%", justifyContent: "center", alignItems: "center" }}>
            <Typography fontSize="20px">Your room ID is:  {props.roomID !== null ? props.roomID : "XXXX"}</Typography>
          </div>
        </Popup>

        {props.host ? (
          <button onClick={destroyRoom}>Destroy room</button>
        ) : null}

        {/* Displays if member */}
        {props.member ? (
          <button onClick={leaveRoom}>Leave room</button>
        ) : null}

        {props.loggedIn ? <button onClick={props.logout}>Log Out</button> : null}

      </div>
    </header>
  );
}

const Device = ({ name, type, handleClick }) => {
  let Icon = DevicesOtherRoundedIcon;
  if (type === "Computer") {
    Icon = LaptopChromebookRoundedIcon
  } else if (type === "Smartphone") {
    Icon = PhoneAndroidRoundedIcon
  }

  return <div className="device-container" onClick={handleClick}>
    <Icon /><Typography fontSize="16px">{name}</Typography>
  </div>
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.userReducer.loggedIn,
    guest: state.userReducer.guest,
    host: state.userReducer.host,
    user: state.userReducer.user,
    socket: state.userReducer.socket,
    roomID: state.userReducer.roomID,
    userID: state.userReducer.userID
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
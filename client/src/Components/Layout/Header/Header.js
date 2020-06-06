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
import Drawer from '@material-ui/core/Drawer'
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import ChatBubbleOutlineRoundedIcon from '@material-ui/icons/ChatBubbleOutlineRounded';
import useWindowSize from '../../../useWindowSize'

import { refreshDevices, setDevice, logout, toggleChat } from '../../../Redux/Actions/userAction'
import {
  LEAVE,
  DESTROY,
} from "helpers/socket_events.js";

import {mobileWidth, tabletWidth} from "helpers/constants"

const Header = (props) => {
  // Sends LEAVE event
  const leaveRoom = () => props.socket.emit(LEAVE);

  // Sends DESTROY event
  const destroyRoom = () => props.socket.emit(DESTROY);

  const [inviteOpen, setInviteOpen] = useState(false);

  const [devicesPopup, setDevicesPopup] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const size = useWindowSize();

  const renderHeaderItems = () => 
  <React.Fragment>
    {!props.guest && props.loggedIn && props.user !== null ? <button onClick={() => setDevicesPopup(true)}>Devices</button>:null}
    {props.member || props.host ? <button onClick={() => setInviteOpen(true)}>Invite</button> : null}
    {props.host ? (
      <button onClick={destroyRoom}>Destroy room</button>
    ) : null}
    {props.member ? (
      <button onClick={leaveRoom}>Leave room</button>
    ) : null}
    {props.loggedIn ? <button onClick={props.logout}>Log Out</button> : null}
  </React.Fragment>

  let devices = [];
  if (props.user)
    devices = props.user.playbackDevices.filter(device => !device.is_restricted && !device.is_private_session);
  return (
    <header>
      <div id='header-logo'>
        <Typography color="#02bb4f" fontSize="35px" additionalStyles={{ fontFamily: "Architects Daughter" }}>SWF</Typography>
      </div>
      {size.width < tabletWidth ? 
      <div id='header-actions'>
        {props.member || props.host ? <ChatBubbleOutlineRoundedIcon onClick={props.openChat}/>:null}
        <MenuRoundedIcon onClick={() => setDrawerOpen(true)}/>
        <Drawer anchor={size.width < mobileWidth ? "top":"right"} id="header-actions-drawer" onClose={() => setDrawerOpen(false)} open={drawerOpen}>
          {renderHeaderItems()}
        </Drawer>
      </div>:
      <div id='header-actions'>
        {renderHeaderItems()}
      </div>
      }
      <Popup open={inviteOpen} handleClose={() => setInviteOpen(false)}>
        <div style={{ display: "flex", height: "100%", justifyContent: "center", alignItems: "center" }}>
          <Typography fontSize="20px">Your room ID is:  {props.roomID !== null ? props.roomID : "XXXX"}</Typography>
        </div>
      </Popup>
      {props.loggedIn && props.user !== null ?
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
        </Popup>:null
      }
    </header>
  );
}

const Device = ({ name, type, handleClick, is_active }) => {
  let Icon = DevicesOtherRoundedIcon;
  if (type === "Computer") {
    Icon = LaptopChromebookRoundedIcon
  } else if (type === "Smartphone") {
    Icon = PhoneAndroidRoundedIcon
  }

  return <div className="device-container" onClick={handleClick}>
    <Icon /><Typography fontSize="16px">{name} {is_active ? " (Active)":""}</Typography>
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
    userID: state.userReducer.userID,
    member: state.userReducer.member
  }
}

const mapDispatchToProps = dispatch => {
  return {
    refreshDevices: (userID) => dispatch(refreshDevices(userID)),
    openChat: () => dispatch(toggleChat(true)),
    setDevice: (deviceID, userID) => dispatch(setDevice(deviceID, userID)),
    logout: () => dispatch(logout())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
import React from 'react';
import './Popup.css'

const Popup = (props) => {

  return (
    <div className={"popup-wrapper"} style={{display: props.open ? "flex":"none"}} onClick={props.handleClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        {props.children}
        <button className="popup-close" onClick={props.handleClose}>&#10005;</button>
      </div>
    </div>
  );
}

export default Popup
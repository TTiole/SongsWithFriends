import React from 'react';
import './Popup.css'

const Popup = ({open = false, children, handleClose, className="", ...rest}) => {

  return (
    <div className={"popup-wrapper " + className} style={{ display: open ? "flex" : "none" }} onClick={handleClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        {children}
        <button className="popup-close" onClick={handleClose}>&#10005;</button>
      </div>
    </div>
  );
}

export default Popup
import React from 'react';
import './Error.css'
// We didn't think MUI would be allowed, but since it was we decided to take advantage of it for minor stuff like this
import Snackbar from '@material-ui/core/Snackbar'

const Error = (props) => {
  return (
    <Snackbar className="swf-error" anchorOrigin={{
      vertical: "top",
      horizontal: "center"
    }} autoHideDuration={2000} onClose={props.handleClose} message={props.message} open={props.open} />
  );
}

export default Error
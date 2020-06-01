import React from 'react';
import './Loader.css'
import Typography from '../Typography/Typography'

/**
 * Component for the spinning Rguroo logo. No dependencies
 * @param {bool} active Required. Determines whether spinner is active. When active, entire page will be placed on the 
 * background with a black transparent overlay with this spinner spinning.
 */
const Loader = ({active = false}) => {
  return (
    <div className={`loader-vignette ${active?'active':''}`}>
      <div className={`loader-wrapper`}>
        <Typography color="#02bb4f" fontSize="35px" additionalStyles={{fontFamily:"Architects Daughter"}}>SWF</Typography>
        <Ring color="rgb(2, 187, 79)" backgroundColor="#000000" size={150}/>
      </div>
    </div>
  );
}

function Ring({ backgroundColor, color, size, className = "", style = {} }) {
  const circles = 
    <div
        style={{
            borderColor: `${color} transparent transparent transparent`,
            width: size * 0.8,
            height: size * 0.8,
            margin: size * 0.1,
            borderWidth: size * 0.03,
            background: `${backgroundColor}`
        }}
    ></div>

  return (
      <div className={`lds-ring ${className}`} style={{ width: size, height: size, ...style }}>
          {circles}
      </div>
  )
}
 
export default Loader;
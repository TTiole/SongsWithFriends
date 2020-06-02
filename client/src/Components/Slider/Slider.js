import React from 'react';
import './Slider.css'

const Slider = ({ max, callback, position = 0, handleChange }) => {
  
  return (
    <div className="slider-container">
      <input type="range" min={0} max={max} onMouseUp={callback} value={position} onChange={handleChange} />
    </div>
  );
}

export default Slider
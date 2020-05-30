import React from 'react';
import './Slider.css'

const Slider = ({max, callback, autoincrement = false, stop = true, initialValue = 0}) => {
  return (
    <div className="slider-container">
      <input type="range" min={0} max={max} onMouseUp={callback} defaultValue={initialValue}  />
    </div>
  );
}

export default Slider
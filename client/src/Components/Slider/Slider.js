import React, {useState, useEffect} from 'react';
import './Slider.css'

const Slider = ({max, callback, autoincrement = false, stop = true, initialValue = 0, maxCallback = null, instanceID, position = 0}) => {
  let [value, setValue] = useState(initialValue);
  useEffect(() => {
    let interval = null;
    if(stop && autoincrement) {
      clearInterval(interval);
    } else if (!stop && autoincrement) {
      interval = setInterval(() => {
        if(value+1 > max) {
          clearInterval(interval);
          maxCallback();
        } else {
          setValue(value+1);
        }
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    }
  }, [stop, autoincrement, max, maxCallback, value])

  useEffect(() => {
    setValue(0);
  }, [instanceID])
  useEffect(() => {
    setValue(position);
  }, [position])
  return (
    <div className="slider-container">
      <input type="range" min={0} max={max} onMouseUp={callback} value={value} onChange={e => setValue(parseInt(e.target.value))} />
    </div>
  );
}

export default Slider
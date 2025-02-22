import React from "react";

const RangeSlider = ({ step, min, max }) => {
    const [minValue, setMinValue] = React.useState(min);
    const [maxValue, setMaxValue] = React.useState(max);
    const handleMinChange = e => {
      e.preventDefault();
      const value = parseFloat(e.target.value);
      // the new min value is the value from the event.
      // it should not exceed the current max value!
      const newMinVal = Math.min(value, maxValue - step);
      setMinValue(newMinVal);
    };
    const handleMaxChange = e => {
      e.preventDefault();
      const value = parseFloat(e.target.value);
      // the new max value is the value from the event.
      // it must not be less than the current min value!
      const newMaxVal = Math.max(value, minValue + step);
      setMaxValue(newMaxVal);
    };
    return (
      <div>
        <input
          type="range"
          value={minValue}
          min={min}
          max={max}
          step={step}
          onChange={handleMinChange}
        />
        <input
          type="range"
          value={maxValue}
          min={min}
          max={max}
          step={step}
          onChange={handleMaxChange}
        />
      </div>
    );
  };

  export default RangeSlider;
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

const BtnsRange = ({ value, onIncrement, onDecrement, isPlaying, min, max }) => {
  return (
    <div className="flex gap-2">
      <span 
        onClick={() => !isPlaying && value > min && onDecrement()} 
        className={`size-8 flex items-center justify-center border border-gray-500 rounded ${
          !isPlaying && value > min ? 'cursor-pointer hover:bg-gray-700' : 'cursor-not-allowed opacity-50'
        }`}
      >
        <FontAwesomeIcon icon={faMinus} />
      </span>
      <span className="my-1">{value}</span>
      <span 
        onClick={() => !isPlaying && value < max && onIncrement()} 
        className={`size-8 flex items-center justify-center border border-gray-500 rounded ${
          !isPlaying && value < max ? 'cursor-pointer hover:bg-gray-700' : 'cursor-not-allowed opacity-50'
        }`}
      >
        <FontAwesomeIcon icon={faPlus} />
      </span>
    </div>
  );
};

export default BtnsRange;

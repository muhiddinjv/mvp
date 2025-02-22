import { useState } from 'react';

export const Card = ({ front, back }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`w-80 h-48 bg-gray-800 border rounded-lg shadow-md cursor-pointer transform transition-transform duration-500 ${
        flipped ? 'rotate-180' : ''
      }`}
      onClick={() => setFlipped(!flipped)}
    >
      <div className="relative w-full h-full">
        <div
          className={`absolute w-full h-full flex items-center justify-center text-4xl ${
            flipped ? 'hidden' : ''
          }`}
        >
          {front}
        </div>
        <div
          className={`absolute w-full h-full flex items-center justify-center text-xl bg-gray-800 text-white transform rotate-180 ${
            flipped ? '' : 'hidden'
          }`}
        >
          {back}
        </div>
      </div>
    </div>
  );
};

export default Card;

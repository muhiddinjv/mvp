import React from 'react';

const Button = ({ theme, disabled = false, onClick, text, fontSize = 'xl' }) => {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      className={`text-${fontSize} size-8 rounded border border-gray-500 hover:bg-gray-700 ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${theme === 'dark' ? 'bg-gray-800 text-slate-300' : 'bg-gray-100 text-slate-800'}`}
    >
      {text}
    </button>
  );
};

export default Button;

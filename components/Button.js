function Button({theme, onClick, text}){
  return (
    <button onClick={onClick} className={`${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} hover:bg-gray-400 size-8 rounded`}>{text}</button>
  );
}


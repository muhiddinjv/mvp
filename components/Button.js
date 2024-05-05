function Button({theme, fn, text}){
  return (
    <button onClick={fn} className={`${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} hover:bg-gray-400 size-8 rounded`}>{text}</button>
  );
}


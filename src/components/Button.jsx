function Button({theme, onClick, text, fontSize}){
  return (
    <button onClick={onClick} className={`${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} hover:bg-gray-400 text-${fontSize ? fontSize : 'xl'} size-8 rounded`}>{text}</button>
  );
}

export default Button;


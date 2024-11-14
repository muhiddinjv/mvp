function Button({theme, disabled, onClick, text, fontSize}){
  return (
    <button onClick={onClick} disabled={disabled} className={`text-${fontSize ? fontSize : 'xl'} size-8 rounded border border-gray-500 hover:bg-gray-700`}>{text}</button>
  );
}

export default Button;


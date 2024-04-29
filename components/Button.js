function Button({fn, text}){
  return (
    <button onClick={fn} className="bg-gray-200 hover:bg-gray-300 text-black px-3">{text}</button>
  );
}
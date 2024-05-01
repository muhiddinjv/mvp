function Button({fn, text}){
  const { wordLimit } = React.useContext(GlobalContext);

  function result(){
    if(text === "words"){
      if(wordLimit === 1000) return <>∞</>;
      return wordLimit
    }
  }

  return (
    <div className="h-8">
      <button onClick={fn} className="bg-gray-200 hover:bg-gray-300 text-black h-full px-4 rounded">{text} {result()}</button>
    </div>
  );
}
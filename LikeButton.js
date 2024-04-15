function LikeButton(){
  const {useState} = React;

  const [liked, setLiked] = useState(false);

  if (liked) {
    return 'You liked this through a React component.'; 
  }

  return (
    <button onClick={() => setLiked(true)} class="text-white bg-blue-700 hover:bg-blue-800 font-medium px-6 py-2 rounded dark:bg-blue-600 dark:hover:bg-blue-700">Like</button>
  );
}

ReactDOM.render(<LikeButton />,document.querySelector('#root'));

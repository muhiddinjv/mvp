import React from 'react'
import './index.css'
import App from './App.jsx'
import {createRoot} from 'react-dom/client'

export const GlobalContext = React.createContext();

function GlobalProvider({ children }){
  const [wordLimit, setWordLimit] = React.useState(
    JSON.parse(localStorage.getItem("wordLimit")) || 100
  );
  const [chapterId, setChapterId] = React.useState(
    JSON.parse(localStorage.getItem("chapterId")) || "1"
  )
  const [ chapters, setChapters ] = React.useState(JSON.parse(localStorage.getItem('chapters')) || []);
  const [ verseId, setVerseId ] = React.useState();

  React.useEffect(() => {
    fetch('/json/chapters.json')
      .then(res => res.json())
      .then(data => {
        setChapters(data); 
        localStorage.setItem('chapters', JSON.stringify(data))
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <GlobalContext.Provider value={{ 
      wordLimit, setWordLimit, 
      chapterId, setChapterId, 
      chapters, setChapters, 
      verseId, setVerseId,
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

let container = null;
document.addEventListener('DOMContentLoaded', function() {
  if (!container) {
    container = document.getElementById('root');
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <GlobalProvider>
          <App/>
        </GlobalProvider>
      </React.StrictMode>
    )}
});

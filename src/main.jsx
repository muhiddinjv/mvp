import React from 'react'
import './index.css'
import App from './App.jsx'
import {createRoot} from 'react-dom/client'
import { SpeedInsights } from "@vercel/speed-insights/react"

export const GlobalContext = React.createContext();

function GlobalProvider({ children }){
  const [wordLimit, setWordLimit] = React.useState(
    JSON.parse(localStorage.getItem("wordLimit")) || 100
  );
  const [chapterId, setChapterId] = React.useState(
    JSON.parse(localStorage.getItem("surah")) || 1
  )
  const [ chapters, setChapters ] = React.useState([]);
  const [ verseId, setVerseId ] = React.useState();
  // const [ bookmark, setBookmark ] = React.useState(
  //   JSON.parse(localStorage.getItem("bookmark")) || ''
  // );

  function parentFunc(arg){
    console.log('hi there from parentFunc')
  }

  React.useEffect(() => {
    fetch('/json/chapters.json')
      .then(res => res.json())
      .then(data => setChapters(data))
      .catch(err => console.log(err));
  }, []);

  return (
    <GlobalContext.Provider value={{ 
      wordLimit, setWordLimit, 
      chapterId, setChapterId, 
      chapters, setChapters, 
      verseId, setVerseId,
      // bookmark, setBookmark,
      parentFunc
    }}>
      {children}
      <SpeedInsights />
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

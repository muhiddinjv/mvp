import React, { useEffect, useState } from 'react'
import './index.css'
import App from './App.jsx'
import {createRoot} from 'react-dom/client'
import { Analytics } from "@vercel/analytics/react";
import moment from 'moment';
import { State } from "ts-fsrs";

export const CardStorage = {
  loadCards: (words, chapterId) => {
    const storedCards = localStorage.getItem(`cards_${chapterId}`);
    if (storedCards) {
      const parsedCards = JSON.parse(storedCards);
      return parsedCards;
    }
    return words.map(card => ({
      ...card,
      due: moment().valueOf(),
      difficulty: 0,
      elapsed_days: 0,
      lapses: 0,
      last_review: null,
      reps: 0,
      scheduled_days: 0,
      stability: 0,
      state: State.New
    }));
  },
  saveCards: (cards, chapterId) => {
    const data = JSON.stringify(cards);
    if (data.length > 5000000) { // Example limit, adjust as needed
      console.warn("Data size exceeds limit, consider optimizing.");
    } else {
      localStorage.setItem(`cards_${chapterId}`, data);
    }
  },
};

export const GlobalContext = React.createContext();

function GlobalProvider({ children }){
  const [wordLimit, setWordLimit] = useState(
    JSON.parse(localStorage.getItem("wordLimit")) || 100
  );
  const [chapterId, setChapterId] = useState(
    JSON.parse(localStorage.getItem("chapterId")) || "1"
  )
  const [showSlider, setShowSlider] = useState(
    JSON.parse(localStorage.getItem("showSlider")) || false
  );
  const [showButtons, setShowButtons] = useState(
    JSON.parse(localStorage.getItem("showButtons")) || false
  );
  const [ chapters, setChapters ] = useState(
    JSON.parse(localStorage.getItem('chapters')) || []
  );
  const [ verseId, setVerseId ] = useState();
  const [ words, setWords ] = useState([]);
  const [cards, setCards] = useState([]);
  const [cardCounts, setCardCounts] = useState({});

  useEffect(() => {
    fetch('/json/chapters.json')
      .then(res => res.json())
      .then(data => {
        setChapters(data); 
        localStorage.setItem('chapters', JSON.stringify(data))
      })
      .catch(err => console.log("Error loading chapters:", err));
  }, []);

  useEffect(() => {
    fetch(`/json/words.json`)
      .then((res) => res.json())
      .then((json) => {
        setWords(json);
        // Load cards for each chapter
        const newCardCounts = {};
        for (const chapter of chapters) {
          const storedCards = CardStorage.loadCards(json[chapter.id], chapter.id);
          setCards(prevCards => [...prevCards, ...storedCards]);

          const newCount = storedCards.filter(card => card.state === State.New).length;
          const learningCount = storedCards.filter(card => (card.state === State.Learning || card.state === State.Relearning) && moment(card.due).isSameOrBefore(moment())).length;
          const reviewCount = storedCards.filter(card => card.state === State.Review && moment(card.due).isSameOrBefore(moment())).length;

          newCardCounts[chapter.id] = { newCount, learningCount, reviewCount };
        }
        setCardCounts(newCardCounts);
      })
      .catch((err) => console.error("Error loading words:", err));
  }, [chapters]);

  return (
    <GlobalContext.Provider value={{ 
      wordLimit, setWordLimit, 
      chapterId, setChapterId, 
      chapters, setChapters, 
      verseId, setVerseId,
      showSlider, setShowSlider,
      showButtons, setShowButtons,
      words, setWords,
      cards, setCards,
      cardCounts, setCardCounts
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
          <Analytics />
        </GlobalProvider>
      </React.StrictMode>
    )}
});

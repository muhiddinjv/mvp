import React from 'react'
import './index.css'
import App from './App.jsx'
import {createRoot} from 'react-dom/client'
import {ErrorBoundary, Loading} from './components';
import { SpeedInsights } from "@vercel/speed-insights/react"

export const GlobalContext = React.createContext();

function GlobalProvider({ children }){
  const [wordLimit, setWordLimit] = React.useState(
    JSON.parse(localStorage.getItem("wordLimit")) || 100
  );
  const [surahNum, setSurahNum] = React.useState(
    JSON.parse(localStorage.getItem("surah")) || 1
  )

  return (
    <GlobalContext.Provider value={{ wordLimit, setWordLimit, surahNum, setSurahNum }}>
      {children}
      <SpeedInsights />
    </GlobalContext.Provider>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary fallback={<Loading/>}>
      <GlobalProvider>
        <App/>
      </GlobalProvider>
    </ErrorBoundary>
  </React.StrictMode>
)

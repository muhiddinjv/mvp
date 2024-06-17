import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ErrorBoundary from './components/ErrorBoundary.jsx';
import Loading from './components/Loading.jsx';

export const GlobalContext = React.createContext();

function GlobalProvider({ children }){
  const [wordLimit, setWordLimit] = React.useState(
    JSON.parse(localStorage.getItem("wordLimit")) || 100
  );
  const [surahNum, setSurahNum] = React.useState(
    JSON.parse(localStorage.getItem("surah")) || 36
  );

  return (
    <GlobalContext.Provider value={{ wordLimit, setWordLimit, surahNum, setSurahNum }}>
      {children}
    </GlobalContext.Provider>
  );
};

let rootContainer = document.getElementById('root');
const root = ReactDOM.createRoot(rootContainer);

root.render(
  <React.StrictMode>
    <GlobalProvider>
      <ErrorBoundary fallback={<Loading/>}>
        <App/>
      </ErrorBoundary>
    </GlobalProvider>
  </React.StrictMode>,
)

import React from 'react'
import './index.css'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx';
import Loading from './components/Loading.jsx';

export const GlobalContext = React.createContext();

function GlobalProvider({ children }){
  const [wordLimit, setWordLimit] = React.useState(
    JSON.parse(localStorage.getItem("wordLimit")) || 100
  );
  const [surahNum, setSurahNum] = React.useState(
    JSON.parse(localStorage.getItem("surah")) || 1
  );

  return (
    <GlobalContext.Provider value={{ wordLimit, setWordLimit, surahNum, setSurahNum }}>
      {children}
    </GlobalContext.Provider>
  );
};

const rootContainer = document.getElementById('root')
const root = ReactDOM.createRoot(rootContainer);

root.render(
  <React.StrictMode>
    <ErrorBoundary fallback={<Loading/>}>
      <GlobalProvider>
        <App/>
      </GlobalProvider>
    </ErrorBoundary>
  </React.StrictMode>
)

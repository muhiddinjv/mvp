const GlobalContext = React.createContext();

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

function Index() {
  return (
    <GlobalProvider>
      <App/>
    </GlobalProvider>
  );
}

ReactDOM.render(<Index />, document.querySelector("#root"));

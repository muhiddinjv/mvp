const GlobalContext = React.createContext();

function GlobalProvider({ children }){
  const [wordLimit, setWordLimit] = React.useState(
    JSON.parse(localStorage.getItem("wordLimit")) || 100
  );

  return (
    <GlobalContext.Provider value={{ wordLimit, setWordLimit }}>
      {children}
    </GlobalContext.Provider>
  );
};

function App() {
  return (
    <GlobalProvider>
      <Route path="/">
        <Surahs />
      </Route>
      <Route path="/36">
        <Surah />
      </Route>
    </GlobalProvider>
  );
}

ReactDOM.render(<App />, document.querySelector("#root"));

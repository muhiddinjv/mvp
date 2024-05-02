const GlobalContext = React.createContext();

const GlobalProvider = ({ children }) => {
  const [wordLimit, setWordLimit] = React.useState(JSON.parse(localStorage.getItem("wordLimit"))||100);

  return (
    <GlobalContext.Provider value={{ wordLimit, setWordLimit }}>
      {children}
    </GlobalContext.Provider>
  );
};

function App() {
  return (
    <GlobalProvider>
      <Surah />
    </GlobalProvider>
  );
}

ReactDOM.render(<App />, document.querySelector("#root"));

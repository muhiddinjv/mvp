function App() {
  const { surahNum } = React.useContext(GlobalContext);
  
  return (
    <>
      <Route path="/index.html">
        <Surahs />
      </Route>
      <Route path={`/${surahNum}`}>
        <Surah />
      </Route>
    </>
  );
}

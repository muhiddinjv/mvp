function Surah() {
  const { ayahs, loading } = useAyahs(36);
  const { theme, toggleTheme } = useTheme("dark");
  const { fontSize, enlargeFont } = useFontSize(16);
  const [ language, changeLanguage ] = React.useState("e");
  const { setWordLimit } = React.useContext(GlobalContext);
  console.log(theme)
  
  if (loading) {
    return <div>Loading...</div>;
  }

  let groupedAyahs = [];
  const ayahKeys = Object.keys(ayahs);
  for (let i = 0; i < ayahKeys.length; i += 5) {
    const group = ayahKeys.slice(i, i + 5).map(key => ayahs[key]);
    groupedAyahs.push(group);
  }

  function handleLanguage(){
    if (language == "e") changeLanguage("d");
    if (language == "d") changeLanguage("c");
    if (language == "c") changeLanguage("e");
  }

  const cycleWordLimit = () => {
    setWordLimit((prevLimit) => {
      let newLimit;
      if (prevLimit === 1000) newLimit = 5;
      else if (prevLimit === 5) newLimit = 3;
      else if (prevLimit === 3) newLimit = 1;
      else newLimit = 1000; // Reset to no limit
      localStorage.setItem('wordLimit', newLimit);
      return newLimit;
    });
  };

  return (
    <div
      className={`${
        theme === "dark"
          ? "bg-gray-800 text-white"
          : "bg-gray-100 text-gray-900"
      } h-screen`}
    >
      <header className="header flex flex-col items-center p-4">
        <div className="tools w-full max-w-sm flex justify-between">
          <Button fn={cycleWordLimit} text="words" />
          <Button fn={toggleTheme} text={theme=="light"?<span>&#9734;</span>:<span>&#x263C;</span>} />
          <Button fn={handleLanguage} text="language" />
          <div className="font-size flex items-center">
            <Button fn={() => enlargeFont(false)} text="−" />
            <div className="fontSizeDiv mx-2 text-lg">{fontSize}</div>
            <Button fn={() => enlargeFont(true)} text="+" />
          </div>
        </div>
        <div className="hidden">
          <span>Surah: Yasin | </span>
          <span>Verses: 84</span>
        </div>
      </header>
      <main style={{ fontSize: `${fontSize}px` }}>
        {groupedAyahs.map((group, index) => (
          <Accordion key={index} titleAyah={group[0]} panelAyahs={group.slice(1)} lang={language} />
        ))}
      </main>
    </div>
  );
}

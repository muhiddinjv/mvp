function Sura() {
  const { ayahs, loading } = useAyahs();
  const { theme, toggleTheme } = useTheme("dark");
  const { fontSize, enlargeFont } = useFontSize(16);
  const [ language, changeLanguage ] = React.useState("e");
  const [wordQty, setWordQty] = React.useState(
    JSON.parse(localStorage.getItem("wordQty"))
  );
  
  if (loading) {
    return <div>Loading...</div>;
  }

  const groupedAyahs = [];
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

  return (
    <div
      className={`App ${
        theme === "dark"
          ? "bg-gray-800 text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <header className="header flex flex-col items-center p-4">
        <div className="tools w-full max-w-96 flex justify-between">
          <Button fn={() => getWords(wordQty, setWordQty)} text="words" />
          <Button fn={toggleTheme} text="theme" />
          <Button fn={handleLanguage} text="language" />
          <div className="font-size flex items-center">
            <Button fn={() => enlargeFont(false)} text="−" />
            <div className="fontSizeDiv mx-2 text-lg">{fontSize}</div>
            <Button fn={() => enlargeFont(true)} text="+" />
          </div>
        </div>
        <div>
          <span>Surah: Yasin | </span>
          <span>Verses: 84 | </span>
          <span>Yaseen </span>
        </div>
      </header>
      <main className="main" style={{ fontSize: `${fontSize}px` }}>
        {groupedAyahs.map((group, index) => (
          <Accordion key={index} titleAyah={group[0]} panelAyahs={group.slice(1)} lang={language} />
        ))}
      </main>
    </div>
  );
}

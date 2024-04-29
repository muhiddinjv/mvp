function Sura() {
  const { theme, toggleTheme } = useTheme("dark");
  const { fontSize, enlargeFont } = useFontSize(16);
  const { language, changeLanguage } = useLanguage("translation");

  const [wordQty, setWordQty] = React.useState(
    JSON.parse(localStorage.getItem("wordQty"))
  );
  const [verses, setVerses] = React.useState([]);

  React.useEffect(() => {
    const fetchVerses = async () => {
      const response = await fetch("../data/mvp.json");
      const data = await response.json();

      const processedVerses = data.verses.map((verse) => {
        const words = verse[language].split(" ");
        for (let key in wordQty) {
          if (wordQty[key]) return words.slice(0, key).join(" ");
        }
        return words.join(" ");
      });
      setVerses(processedVerses);
    };

    fetchVerses();
  }, [language, wordQty]);

  React.useEffect(() => {
    localStorage.setItem("wordQty", JSON.stringify(wordQty));
  }, [wordQty]);

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
          <Button fn={changeLanguage} text="language" />
          <div className="font-size flex items-center">
            <Button fn={() => enlargeFont(false)} text="−" />
            <div className="fontSizeDiv mx-2 text-lg">{fontSize}</div>
            <Button fn={() => enlargeFont(true)} text="+" />
          </div>
        </div>
      </header>
      <main className="main" style={{ fontSize: `${fontSize}px` }}>
        {verses.map((verse, index) => (
          <div key={index}>
            <span>{index + 1} </span>
            <span className="mb-2">{verse}</span>
          </div>
        ))}
      </main>
    </div>
  );
}

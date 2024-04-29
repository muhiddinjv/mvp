function Sura() {
  const [ sura, setSura ] = React.useState({})
  const [ verses, setVerses ] = React.useState([]);
  const { theme, toggleTheme } = useTheme("dark");
  const { fontSize, enlargeFont } = useFontSize(16);
  const { language, changeLanguage } = useLanguage("translation");

  const [wordQty, setWordQty] = React.useState(
    JSON.parse(localStorage.getItem("wordQty"))
  );
  console.log('wordQty', wordQty)


  React.useEffect(() => {
    const fetchVerses = async () => {
      try {
        const response = await fetch("../data/mvp.json");
        const data = await response.json();
        setSura(data);
  
        const processedVerses = data.verses.map((verse) => {
          const words = verse[language].split(" ");
          for (let key in wordQty) {
            if (wordQty[key]) return words.slice(0, key).join(" ");
          }
          return words.join(" ");
        });
        setVerses(processedVerses);
      } catch (error) {
        console.log(error)
      }
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
        <div>
          <span>Surah: {sura.id} | </span>
          <span>Verses: {sura.total_verses} | </span>
          <span>{sura.name} </span>
          <span>{sura.translation}</span>
        </div>
      </header>
      <main className="main" style={{ fontSize: `${fontSize}px` }}>
      <Accordion verses={verse}/>
        {/* <Test2 verses={sura} /> */}
        
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

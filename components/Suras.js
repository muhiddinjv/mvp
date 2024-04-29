function Suras() {
  const {useState, useEffect} = React;
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'translation');
  const [fontSize, setFontSize] = useState(parseInt(localStorage.getItem('fontSize'), 10) || 16);
  const [wordQty, setWordQty] = useState(JSON.parse(localStorage.getItem('wordQty')) || { 0: true, 1: false, 2: false, 3: false });
  const [verses, setVerses] = useState([]);
  function getWords() {
    let i = 0;
    for (const key in wordQty) {
      if (wordQty[key]) {
        wordQty[key] = false;
        i = Object.keys(wordQty).indexOf(key);
      }
    }
    const nextKey = Object.keys(wordQty)[i + 1];

    if (i === 3) {
      wordQty[0] = true;
    } else {
      wordQty[nextKey] = true;
    }
    localStorage.setItem("wordQty", JSON.stringify(wordQty));
    setWordQty(JSON.parse(localStorage.getItem('wordQty')))
    console.log('wordQty', wordQty)
  }

  useEffect(() => {
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

  useEffect(() => {
    localStorage.setItem('theme', theme);
    localStorage.setItem('language', language);
    localStorage.setItem('fontSize', fontSize.toString());
    localStorage.setItem('wordQty', JSON.stringify(wordQty));
  }, [theme, language, fontSize, wordQty]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const changeLanguage = () => {
    const newLanguage = language === 'text' ? 'transliteration' : language === 'transliteration' ? 'translation' : 'text';
    setLanguage(newLanguage);
  };

  const enlargeFont = (increase) => {
    setFontSize(fontSize + (increase ? 1 : -1));
  };

  return (
    <div className={`App ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <header className="header flex flex-col items-center p-4">
        <div className="tools w-full max-w-96 flex justify-between">
          <Button fn={getWords} text="words" />
          <Button fn={toggleTheme} text="theme" />
          <Button fn={changeLanguage} text="language" />
          <div className="font-size flex items-center">
            <Button fn={() => enlargeFont(false)} text="&#8722;" />
            <div className="fontSizeDiv mx-2 text-lg">{fontSize}</div>
            <Button fn={() => enlargeFont(true)} text="&#43;" />
          </div>
        </div>
      </header>
      <main className="main" style={{ fontSize: `${fontSize}px` }}>
        {verses.map((verse, index) => (
          <div>
            <span>{index+1} </span>
            <span key={index} className="mb-2">{verse}</span>
          </div>
        ))}
      </main>
    </div>
  );
};
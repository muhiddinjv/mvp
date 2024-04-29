// Define separate functions for each responsibility
function useTheme(defaultTheme) {
  const [theme, setTheme] = React.useState(
    localStorage.getItem("theme") || defaultTheme
  );

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  React.useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, toggleTheme };
}

function useFontSize(defaultSize) {
  const [fontSize, setFontSize] = React.useState(
    parseInt(localStorage.getItem("fontSize"), 10) || defaultSize
  );

  const enlargeFont = (increase) => {
    setFontSize(fontSize + (increase ? 1 : -1));
  };

  React.useEffect(() => {
    localStorage.setItem("fontSize", fontSize.toString());
  }, [fontSize]);

  return { fontSize, enlargeFont };
}

function useLanguage(defaultLanguage) {
  const [language, setLanguage] = React.useState(
    localStorage.getItem("language") || defaultLanguage
  );

  const changeLanguage = () => {
    const newLanguage =
      language === "text"
        ? "transliteration"
        : language === "transliteration"
        ? "translation"
        : "text";
    setLanguage(newLanguage);
  };

  React.useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  return { language, changeLanguage };
}

function getWords(wordQty, setWordQty) {
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
  setWordQty(JSON.parse(localStorage.getItem("wordQty")));
  console.log("wordQty", wordQty);
}

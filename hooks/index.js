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

const useAyahs = (ayahNumber) => {
  const [ayahs, setAyahs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAyahs = async () => {
      try {
        const response = await fetch(`../data/${ayahNumber}.json`);
        const data = await response.json();
        setAyahs(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Ayahs:", error);
        setLoading(false);
      }
    };

    fetchAyahs();
  }, []);

  return { ayahs, loading };
};

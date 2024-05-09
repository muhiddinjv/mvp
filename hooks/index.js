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
    language === "e" ? "d" : 
    language === "d" ? "c" : 
    language === "c" ? "e" : "e";
    setLanguage(newLanguage);
  };

  React.useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  return { language, changeLanguage };
}

function useAyahs(ayahNumber) {
  const [ayahs, setAyahs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAyahs = async () => {
      try {
        const response = await fetch(`../data/json/${ayahNumber}.json`);
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

function addPFieldToObject(obj) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const childObj = obj[key];
      if (childObj.w && Array.isArray(childObj.w)) {
        childObj.w.forEach((word, index) => {
          const pageNumber = `036_${key.padStart(3, '0')}_${(index + 1).toString().padStart(3, '0')}`;
          word.p = pageNumber;
        });
      }
    }
  }
    // Convert the updated data to a JSON string
  const jsonStr = JSON.stringify(obj, null, 2);

  // Create a Blob with the JSON data
  const blob = new Blob([jsonStr], { type: 'application/json' });

  // Create a temporary URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create a link element to trigger the download
  const link = document.createElement('a');
  link.href = url;
  link.download = 'updatedData.json';

  // Append the link to the document and trigger the download
  document.body.appendChild(link);
  link.click();

  // Clean up by revoking the URL object
  URL.revokeObjectURL(url);
}


function uuid(){
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r && 0x3 | 0x8);
      setId(v.toString(16));
      return v.toString(16);
  });
}

const sajdaSurahs = [7, 13, 16, 17, 19, 22, 25, 27, 32, 38, 41, 53, 84, 96];
const sajdaAyahs = [206, 15, 50, 109, 58, 18, 60, 26, 15, 24, 38, 62, 21, 19];
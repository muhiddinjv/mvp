import React from "react";

// Hooks ---------------------------------
export function useTheme(defaultTheme) {
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

export function useFontSize(defaultSize) {
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

export function useLanguage() {
  const [language, setLanguage] = React.useState(
    localStorage.getItem("language") || 'en'
  );

  React.useEffect(() => {
    if (language === undefined) {
      setLanguage('en');
    }
  }, []);

  const changeLanguage = () => {
    const newLanguage =
    language === "en" ? "tr" : 
    language === "tr" ? "ar" : 
    language === "ar" ? "en" : "en";
    setLanguage(newLanguage);
  };

  React.useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  return { language, changeLanguage };
}

export function useAyahs(ayahNumber) {
  const [ayahs, setAyahs] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  const fetchData = async () => {
    const headers = { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
    const url = `/json/surah/${ayahNumber}.json`;
    
    try {
      const response = await fetch(url, headers);
      const json = await response.json();
      setAyahs(json);
      setLoading(false)
    } catch (error) {
      console.log("error", error);
      setLoading(true)
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [ayahNumber]); // React to changes in ayahNumber

  const groupedAyahs = React.useMemo(() => {
    if (!ayahs) return []; // Return early if ayahs is not yet available
    const keys = Object.keys(ayahs);
    return keys.reduce((acc, _, i) => {
      if (i % 5 === 0) acc.push(keys.slice(i, i + 5).map(key => ({...ayahs[key], id: key })));
      return acc;
    }, []);
  }, [ayahs]); 

  return { ayahs, groupedAyahs, loading };
};

export function useBookmarks(verseId){
    const [bookmarked, setBookmarked] = React.useState(false);

    React.useEffect(() => {
        const bookmarksString = localStorage.getItem('bookmarks') || '';
        setBookmarked(bookmarksString.includes(verseId));
    }, [verseId]);

    const getParsedBookmarks = () => {
      const bookmarksString = localStorage.getItem('bookmarks') || '';
      if (!bookmarksString) return [];
      return bookmarksString.split('|').map(bookmark => {
          const [chapterId, verseId] = bookmark.split('_');
          return { chapterId: parseInt(chapterId, 10), verseId: parseInt(verseId, 10) };
      });
    }

    const createBookmark = () => {
        let bookmarksString = localStorage.getItem('bookmarks') || '';
        if (!bookmarksString.includes(verseId)) {
            bookmarksString += bookmarksString? '|' + verseId : verseId;
            localStorage.setItem('bookmarks', bookmarksString);
            localStorage.setItem('verseId', verseId);
            setBookmarked(true);
        }
    };

    const removeBookmark = () => {
        let bookmarksString = localStorage.getItem('bookmarks');
        if (bookmarksString) {
            const bookmarksEntries = bookmarksString.split('|');
            bookmarksString = bookmarksEntries.filter(entry => entry !== verseId).join('|');
            localStorage.setItem('bookmarks', bookmarksString);
            localStorage.setItem('verseId', '');
            setBookmarked(false);
        }
    };

    const toggleBookmark = () => {
        const bookmarksString = localStorage.getItem('bookmarks') || '';
        if (bookmarksString.includes(verseId)) {
            removeBookmark();
        } else {
            createBookmark();
        }
    };

    return [bookmarked, toggleBookmark, getParsedBookmarks];
};

// Helper functions ----------------------
export function addNewline(array, lang){
  let newResult = '';
  for (let i = 0; i < array.length; i++) {
    newResult += array[i][lang];
    if ((i + 1) % 3 === 0) {
      newResult += '\n';
    } else {
      newResult += ' ';
    }
  }
  return newResult;
};

export function addPFieldToObject(obj) {
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

export function uuid(){
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r && 0x3 | 0x8);
      setId(v.toString(16));
      return v.toString(16);
  });
}

export const sajdaVerses = ['7_206', '13_15', '16_50', '17_109', '19_58', '22_18', '22_77', '25_60', '27_26', '32_15', '38_24', '41_38', '53_62', '84_21', '96_19'];
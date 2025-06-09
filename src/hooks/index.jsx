import { useEffect, useMemo, useRef, useState } from "react";

// Hooks ---------------------------------
export function useTheme(defaultTheme) {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || defaultTheme
  );

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, toggleTheme };
}

export function useFontSize(defaultSize) {
  const [fontSize, setFontSize] = useState(
    parseInt(localStorage.getItem("fontSize"), 10) || defaultSize
  );

  const enlargeFont = (increase) => {
    setFontSize(fontSize + (increase ? 1 : -1));
  };

  useEffect(() => {
    localStorage.setItem("fontSize", fontSize.toString());
  }, [fontSize]);

  return { fontSize, enlargeFont };
}

export function useAyahs(folder,suraNum) {
  const [ayahs, setAyahs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const headers = { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    const url = `/json/${folder}/${suraNum}.json`;
    
    try {
      const response = await fetch(url, headers);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const json = await response.json();
      setAyahs(json);
    } catch (error) {
      console.error("Fetch error:", error);
      setAyahs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [suraNum]);

  const groupedAyahs = useMemo(() => {
    if (!ayahs || ayahs.length === 0) return [];
    const keys = Object.keys(ayahs);
    return keys.reduce((acc, _, i) => {
      if (i % 5 === 0) acc.push(keys.slice(i, i + 5).map(key => ({...ayahs[key], id: key })));
      return acc;
    }, []);
  }, [ayahs]);

  return { ayahs, groupedAyahs, loading };
}

export function useBookmarks(verseId){
    const [bookmarked, setBookmarked] = useState(false);

    useEffect(() => {
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

export function useSwipe(input) {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
      setTouchEnd(0); // otherwise the swipe is fired even with usual touch events
      setTouchStart(e.targetTouches[0].clientX);
  }

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
      if (!touchStart || !touchEnd) return;
      
      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;

      if (isLeftSwipe) {
          input.onSwipedLeft();
      }
      if (isRightSwipe) {
          input.onSwipedRight();
      }
  }

  return {
      onTouchStart,
      onTouchMove,
      onTouchEnd
  }

  /* HOW ITS USED IN A COMPONENT
   const swipeHandlers = useSwipe({ onSwipedLeft: () => console.log('left'), onSwipedRight: () => console.log('right') });
   <div {...swipeHandlers}></div>
  */
}

export function useAudioPlayer(chapterid, minValue, maxValue) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAyah, setCurrentAyah] = useState(null);
  const [currentRepetition, setCurrentRepetition] = useState(1);
  const [repetitions, setRepetitions] = useState(10);
  
  const audioRef = useRef(new Audio());
  const remoteUrlAyah = 'https://everyayah.com/data/Alafasy_128kbps';

  // Cleanup effect
  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Audio end handler
  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => {
      if (isPlaying && currentAyah < maxValue) {
        playAyah(currentAyah + 1);
      } else if (currentRepetition < repetitions) {
        setCurrentRepetition(prev => prev + 1);
        playAyah(minValue);
      } else {
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
        setCurrentAyah(null);
        setCurrentRepetition(1);
      }
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [isPlaying, currentAyah, maxValue, currentRepetition, repetitions, minValue]);

  const playAyah = (ayahNumber) => {
    const audio = audioRef.current;
    
    const formattedChapter = chapterid.toString().padStart(3, '0');
    const formattedAyah = ayahNumber.toString().padStart(3, '0');
    const audioFileName = `${formattedChapter}${formattedAyah}.mp3`;

    audio.src = `${remoteUrlAyah}/${audioFileName}`;
    
    audio.play()
      .then(() => {
        setCurrentAyah(ayahNumber);
      })
      .catch(error => {
        console.error('Audio playback failed:', error);
      });
  };

  const togglePlayback = () => {
    if (isPlaying) {
      const audio = audioRef.current;
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      setCurrentRepetition(1);
    } else {
      setIsPlaying(true);
      setCurrentRepetition(1);
      playAyah(minValue);
    }
  };

  const cycleRepetitions = () => {
    setRepetitions(prev => {
      switch(prev) {
        case 10: return 20;
        case 20: return 30;
        default: return 10;
      }
    });
  };

  return {
    isPlaying,
    currentRepetition,
    repetitions,
    togglePlayback,
    cycleRepetitions
  };
}

export function useVerseRange(totalVerses) {
  const [minValue, setMinValue] = useState(1);
  const [maxValue, setMaxValue] = useState(1);

  useEffect(() => {
    if (totalVerses) {
      setMaxValue(totalVerses);
    }
  }, [totalVerses]);

  const adjustMinValue = (increment) => {
    const newValue = minValue + increment;
    if (newValue >= 1 && newValue < maxValue) {
      setMinValue(newValue);
    }
  };

  const adjustMaxValue = (increment) => {
    const newValue = maxValue + increment;
    if (newValue > minValue && newValue <= totalVerses) {
      setMaxValue(newValue);
    }
  };

  return {
    minValue,
    maxValue,
    setMinValue,
    setMaxValue,
    adjustMinValue,
    adjustMaxValue
  };
}

// Helper functions ----------------------
export function uuid(){
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r && 0x3 | 0x8);
      setId(v.toString(16));
      return v.toString(16);
  });
}

export const sajdaVerses = ['7_206', '13_15', '16_50', '17_109', '19_58', '22_18', '22_77', '25_60', '27_26', '32_15', '38_24', '41_38', '53_62', '84_21', '96_19'];
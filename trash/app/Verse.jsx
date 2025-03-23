import React, { useState, useEffect, useRef, useContext } from 'react';
import { GlobalContext } from '../main';
import { useBookmarks } from '../hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as bookmarkOn } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as bookmarkOff } from '@fortawesome/free-regular-svg-icons';

const Verse = ({ ayahNumber, ayah, selectedLanguage }) => {
    console.log(JSON.stringify(ayah))
  const { wordLimit, chapterId, showButtons } = useContext(GlobalContext);
  const [bookmarked, toggleBookmark] = useBookmarks(ayah.id);

  const [audioAyah, setAudioAyah] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCycling, setIsCycling] = useState(false);
  const [audioCycle, setAudioCycle] = useState(null);
  const [cycleFrom, setCycleFrom] = useState(null);

  const timer = useRef(null);
  const clickCount = useRef(0);

  // URLs for fetching word and ayah audio files.
  const remoteUrlWord = `https://words.audios.quranwbw.com/${chapterId}`;
  const remoteUrlAyah = 'https://everyayah.com/data/Alafasy_128kbps';

  // Optionally expand verses if this verse was bookmarked previously.
  useEffect(() => {
    const verseId = localStorage.getItem('verseId');
    if (verseId === ayah.id) {
      // (Expand logic can be added here if needed)
    }
  }, [ayah.id]);

  const playWord = (wordUrl) => {
    clickCount.current += 1;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (clickCount.current === 1) {
        highlightWord(wordUrl.p);
        const audio = new Audio(`${remoteUrlWord}/${wordUrl.p}.mp3`);
        audio.onerror = () => {
          alert('Failed to load audio file');
          audio.pause();
          audio.currentTime = 0;
          setIsPlaying(false);
        };
        audio.play();
      }
      clickCount.current = 0;
    }, 200);
  };

  // Sets the starting index for word cycling.
  const startCycleFrom = (index) => {
    if (timer.current) clearTimeout(timer.current);
    clickCount.current = 0;
    setCycleFrom(index);
  };

  // Toggles ayah playback. Plays the audio file corresponding to the first word of the ayah.
  const playAyah = (url) => {
    if (audioAyah && !audioAyah.paused) {
      audioAyah.pause();
      setIsPlaying(false);
    } else {
      const [prefix, middle] = url.p.split('_');
      const audioFileName = `${prefix}${middle}.mp3`;
      const audio = new Audio(`${remoteUrlAyah}/${audioFileName}`);
      setAudioAyah(audio);
      audio.play()
        .then(() => setIsPlaying(true))
        .catch((error) => console.error('Audio playback failed:', error));
      let playCount = 1;
      audio.onerror = () => {
        alert('Failed to load audio file');
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
      };
      audio.onended = () => {
        if (playCount < 10) {
          playCount++;
          audio.play();
        } else {
          audio.pause();
          audio.currentTime = 0;
          setIsPlaying(false);
        }
      };
    }
  };

  // Toggles the cycling of word audio.
  const toggleCycleWords = (urls) => {
    setIsCycling(!isCycling);
    if (!isCycling) {
      cycleWords(urls);
    } else if (audioCycle) {
      audioCycle.pause();
    }
  };

  // Cycles through word audios starting from the chosen index.
  const cycleWords = (urls) => {
    let cycleIndex = cycleFrom || 0;
    let urlIndex = 0;
    let playCount = 0;

    const playNext = () => {
      if (urlIndex > cycleIndex) {
        urlIndex = 0;
        playCount++;
        if (playCount > cycleIndex) {
          playCount = 0;
          cycleIndex++;
          if (cycleIndex >= urls.length) {
            setIsCycling(false);
            return;
          }
        }
      }
      const wordUrl = urls[urlIndex];
      highlightWord(wordUrl.p);
      const audio = new Audio(`${remoteUrlWord}/${wordUrl.p}.mp3`);
      setAudioCycle(audio);
      audio.play();
      audio.onerror = () => {
        alert('Failed to load audio file');
        audio.pause();
        audio.currentTime = 0;
        setIsCycling(false);
      };
      audio.onended = () => {
        urlIndex++;
        playNext();
      };
    };

    playNext();
  };

  // Highlights a word element by adding temporary CSS classes.
  const highlightWord = (id) => {
    const wordElement = document.querySelector(`[data-id="${id}"]`);
    if (wordElement) {
      wordElement.classList.add('text-indigo-500', 'font-bold');
      setTimeout(() => {
        wordElement.classList.remove('text-indigo-500', 'font-bold');
      }, 1000);
    }
  };

  return (
    <div id={ayah.id} className="w-full text-right break-all whitespace-normal">
      <div className={`${showButtons ? 'hidden' : 'flex'} justify-end gap-2 my-2 text-lg`}>
        <span 
          onClick={() => toggleBookmark()} 
          className="flex items-center justify-center border border-gray-500 rounded cursor-pointer size-7"
        >
          <FontAwesomeIcon icon={bookmarked ? bookmarkOn : bookmarkOff} />
        </span>
        <span 
          onClick={() => toggleCycleWords(ayah.w)} 
          className="flex items-center justify-center border border-gray-500 rounded cursor-pointer size-7"
        >
          <FontAwesomeIcon icon={isCycling ? 'pause' : 'arrows-rotate'} />
        </span>
        <span 
          onClick={() => playAyah(ayah.w[0])} 
          className="flex items-center justify-center border border-gray-500 rounded cursor-pointer size-7"
        >
          <FontAwesomeIcon icon={isPlaying ? 'pause' : 'play'} />
        </span>
      </div>
      <div className="text-right">
        <span className="font-bold">
          {/* {ayah.id.replace(/^\d{1,3}_/, "")}{' '} */}
        </span>
        {ayah.sajda && <span className="px-2 border border-gray-500 rounded">۩</span>}
        {ayah.w.slice(0, wordLimit).map((word, index) => (
          <span
            key={index}
            data-id={word.p}
            onDoubleClick={() => startCycleFrom(index)}
            onClick={() => playWord(word)}
            className={`mr-1 cursor-pointer rtl ${cycleFrom === index ? 'border' : ''}`}
          >
            {word[selectedLanguage]}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Verse;

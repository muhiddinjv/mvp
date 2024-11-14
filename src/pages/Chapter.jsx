import React from'react';
import { Loading, Accordion, Button } from '../components';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { GlobalContext } from '../main';
import { useAyahs, useFontSize, useLanguage, useTheme } from '../hooks';
import mustSayThis from '../assets/bismillah.png';
import MultiRangeSlider from "multi-range-slider-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPause, faPlay, faPlus } from '@fortawesome/free-solid-svg-icons';

function Chapter() {
  const [minValue, setMinValue] = React.useState(1);
  const [maxValue, setMaxValue] = React.useState(1);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [ayaSliderVisible, setAyaSliderVisibile] = React.useState(false)
  const [currentAyah, setCurrentAyah] = React.useState(null);
  const [repetitions, setRepetitions] = React.useState(10);
  const [currentRepetition, setCurrentRepetition] = React.useState(1);

  const audioRef = React.useRef(new Audio());
  const remoteUrlAyah = 'https://everyayah.com/data/Alafasy_128kbps';

  const { chapterid } = useParams();
  const { wordLimit, setWordLimit, chapters } = React.useContext(GlobalContext);
  const { groupedAyahs, loading } = useAyahs(chapterid);
  const { theme, toggleTheme } = useTheme("dark");
  const { fontSize, enlargeFont } = useFontSize(16);
  const { language, changeLanguage } = useLanguage();
  const vid = localStorage.getItem('verseId')

  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const audio = audioRef.current;
    audio.addEventListener('ended', handleAudioEnd);
    return () => {
      audio.removeEventListener('ended', handleAudioEnd);
    };
  }, [isPlaying, currentAyah, maxValue]);



  React.useEffect(() => {
    setTimeout(() => {
      if (location.state?.fromBookmark) {
        scrollToVerse();
      }
    }, 500);
  }, [location.state]);

  React.useEffect(() => {
    if (chapters[chapterid-1].verses) {
      setMaxValue(chapters[chapterid-1].verses);
    }
  }, [groupedAyahs]);



  // Add this to handle cleanup
  React.useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const cycleRepetitions = () => {
    setRepetitions(prev => {
      switch(prev) {
        case 10: return 20;
        case 20: return 30;
        default: return 10;
      }
    });
  };

  const handleAudioEnd = () => {
    if (isPlaying) {
      if (currentAyah < maxValue) {
        // Continue to next ayah in current repetition
        playAyah(currentAyah + 1);
      } else if (currentRepetition < repetitions) {
        // Start next repetition from minValue
        setCurrentRepetition(prev => prev + 1);
        playAyah(minValue);
      } else {
        // Reset everything after all repetitions are done
        const audio = audioRef.current;
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
        setCurrentAyah(null);
        setCurrentRepetition(1);
      }
    }
  };

  const togglePlayback = () => {
    const audio = audioRef.current;

    if (isPlaying) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      setCurrentAyah(null);
      setCurrentRepetition(1);
    } else {
      setIsPlaying(true);
      setCurrentRepetition(1);
      playAyah(minValue);
    }
  };

  const handleSliderChange = (e) => {
    setMinValue(e.minValue);
    setMaxValue(e.maxValue);
  };

  const playAyah = (ayahNumber) => {
    const audio = audioRef.current;
    
    // Format chapter number to 3 digits (e.g., 001, 012, 114)
    const formattedChapter = chapterid.toString().padStart(3, '0');
    // Format ayah number to 3 digits
    const formattedAyah = ayahNumber.toString().padStart(3, '0');
    const audioFileName = `${formattedChapter}${formattedAyah}.mp3`;

    audio.src = `${remoteUrlAyah}/${audioFileName}`;
    
    audio.onerror = function () {
      console.error('Failed to load audio file');
      handleAudioEnd();
    };

    audio.play()
      .then(() => {
        setCurrentAyah(ayahNumber);
      })
      .catch(error => {
        console.error('Audio playback failed:', error);
        handleAudioEnd();
      });
  };



  const toggleAyaSliderVisibility = () => setAyaSliderVisibile(!ayaSliderVisible)
  
  const cycleWordLimit = () => {
    setWordLimit((prevLimit) => {
      let newLimit;
      if (prevLimit === 100) newLimit = 7;
      else if (prevLimit === 7) newLimit = 5;
      else if (prevLimit === 5) newLimit = 3;
      else if (prevLimit === 3) newLimit = 1;
      else newLimit = 100; // Reset to max limit
      localStorage.setItem('wordLimit', newLimit);
      return newLimit;
    });
  };
  
  function scrollToVerse(){
    let element = document.getElementById(vid);
    element?.scrollIntoView({
      behavior: 'smooth', 
      // block: "center"
    });
  }

  function getPrevChapter(){
    if(chapterid > 1) navigate(`/${parseInt(chapterid) - 1}`)
  }

  function getNextChapter(){
    if(chapterid < 114) navigate(`/${parseInt(chapterid) + 1}`)
  }

  const adjustMinValue = (increment) => {
    const newValue = minValue + increment;
    if (newValue >= 1 && newValue < maxValue) {
      setMinValue(newValue);
    }
  };

  const adjustMaxValue = (increment) => {
    const newValue = maxValue + increment;
    if (newValue > minValue && newValue <= chapters[chapterid-1].verses) {
      setMaxValue(newValue);
    }
  };

  return (
    <div className={`${theme === "dark" ? "bg-gray-800 text-slate-300" : "bg-gray-100 text-slate-800" } min-h-screen w-full pb-6`}>
      <header className={`${theme === "dark" ? "bg-gray-800 text-slate-300" : "bg-gray-100 text-slate-800" } header flex flex-col items-center p-4 sticky top-0 z-20`}>
        <div className="flex justify-between w-full tools max-w-96">
          <Button theme={theme} fontSize="2xl" onClick={getPrevChapter} text='<' />
          <Link to="/" className={`border border-gray-500 hover:bg-gray-700 size-8 rounded flex items-center justify-center text-2xl`}>⌂</Link>
          <Button theme={theme} onClick={cycleWordLimit} text={wordLimit == 100 ? <>ထ</> : wordLimit }/>
          {/* <Button theme={theme} onClick={toggleTheme} text={theme=="light"?<>&#9734;</>:<>&#9733;</>} /> */}
          <Button theme={theme} onClick={toggleAyaSliderVisibility} text={ayaSliderVisible?<>&#9734;</>:<>&#9733;</>} />
          <Button theme={theme} onClick={changeLanguage} text={language} />
          <div className="flex items-center font-size">
            <Button theme={theme} onClick={() => enlargeFont(false)} text={<FontAwesomeIcon icon={faMinus} />} />
            <span className="mx-2 text-lg fontSizeDiv">{fontSize}</span>
            <Button theme={theme} onClick={() => enlargeFont(true)} text={<FontAwesomeIcon icon={faPlus} />} />
          </div>
          <Button theme={theme} fontSize="2xl" onClick={getNextChapter} text='>' />
        </div>
        <div className={`${ayaSliderVisible && 'hidden'} w-full mt-4 max-w-96`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex gap-2">
              <Button 
                theme={theme} 
                onClick={() => adjustMinValue(-1)} 
                text={<FontAwesomeIcon icon={faMinus} />} 
                disabled={isPlaying || minValue <= 1}
              />
              <span className="my-1">{minValue}</span>
              <Button 
                theme={theme} 
                onClick={() => adjustMinValue(1)} 
                text={<FontAwesomeIcon icon={faPlus} />}
                disabled={isPlaying || minValue >= maxValue - 1}
              />
            </div>

            <div className="flex items-center gap-2">
              <span onClick={cycleRepetitions} className="flex items-center justify-center h-8 border border-gray-500 rounded cursor-pointer min-w-14 hover:bg-gray-700">
                {currentRepetition}/{repetitions}×
              </span>
              <span onClick={togglePlayback} className="flex items-center justify-center border border-gray-500 rounded cursor-pointer size-8 hover:bg-gray-700">
                <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
              </span>
            </div>

            <div className="flex gap-2">
              <Button 
                theme={theme} 
                onClick={() => adjustMaxValue(-1)} 
                text={<FontAwesomeIcon icon={faMinus} />}  
                disabled={isPlaying || maxValue <= minValue + 1}
              />
              <span className="my-1">{maxValue}</span>
              <Button 
                theme={theme} 
                onClick={() => adjustMaxValue(1)} 
                text={<FontAwesomeIcon icon={faPlus} />} 
                disabled={isPlaying || maxValue >= chapters[chapterid-1].verses}
              />
            </div>
          </div>

          <MultiRangeSlider
            min={1}
            max={chapters[chapterid-1].verses || 1}
            step={1}
            minValue={minValue}
            maxValue={maxValue}
            onChange={handleSliderChange}
            onInput={(e) => {
              setMinValue(e.minValue);
              setMaxValue(e.maxValue);
            }}
            label={false}
            ruler={false}
            disabled={isPlaying}
            style={{
              border: "none",
              boxShadow: "none",
              padding: "15px 10px",
              opacity: isPlaying ? "0.5" : "1",
              pointerEvents: isPlaying ? "none" : "auto",
            }}
            barInnerColor={theme === "dark" ? "#4B5563" : "#E5E7EB"}
            barLeftColor={theme === "dark" ? "#374151" : "#D1D5DB"}
            barRightColor={theme === "dark" ? "#374151" : "#D1D5DB"}
            thumbLeftColor={theme === "dark" ? "#9CA3AF" : "#6B7280"}
            thumbRightColor={theme === "dark" ? "#9CA3AF" : "#6B7280"}
          />
        </div>
      </header>
      <main style={{ fontSize: `${fontSize}px` }}>
        <div className="mb-2 text-xl text-center">{chapters[chapterid-1]?.id} {chapters[chapterid-1]?.text[language]} {chapters[chapterid-1]?.words} words</div>
        <img src={mustSayThis} className='z-10 mx-auto mb-4 max-w-52' alt='bismillah icon' style={{ filter: theme === "dark" && 'invert(80%)' }}/>
        {loading ? <Loading /> : groupedAyahs?.map((group, index) => (
          <Accordion key={index} titleAyah={group[0]} panelAyahs={group?.slice(1)} lang={language}/>
        ))}
      </main>
    </div>
  );
}

export default Chapter;
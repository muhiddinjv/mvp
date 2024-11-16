import React, {useState, useContext} from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import MultiRangeSlider from "multi-range-slider-react";

import { Loading, Accordion,BtnsRange, BtnsPlayback, BtnsHeader } from '../components';
import { useAudioPlayer, useTheme, useVerseRange, useLanguage, useAyahs, useFontSize } from '../hooks';
import { GlobalContext } from '../main';
import mustSayThis from '../assets/bismillah.png';

function Chapter() {
  const { chapterid } = useParams();
  const [ ayaSliderVisible, setAyaSliderVisible ] = useState(false);
  const { chapters, wordLimit, setWordLimit } = useContext(GlobalContext);
  const { groupedAyahs, loading } = useAyahs(chapterid);
  const { language, changeLanguage } = useLanguage();
  const { fontSize, enlargeFont } = useFontSize(16);
  const { theme } = useTheme("dark");
  
  const navigate = useNavigate();
  const location = useLocation();
  const verseId = localStorage.getItem('verseId')
  const { verses, id, words, text } = chapters[chapterid-1];

  React.useEffect(() => {
    setTimeout(() => {
      if (location.state?.fromBookmark) {
        scrollToVerse();
      }
    }, 500);
  }, [location.state]);

  React.useEffect(() => {
    if (verses) {
      setMaxValue(verses);
    }
  }, [groupedAyahs]);

  const {
    minValue,
    maxValue,
    setMinValue,
    setMaxValue,
    adjustMinValue,
    adjustMaxValue
  } = useVerseRange(verses);

  const {
    isPlaying,
    currentRepetition,
    repetitions,
    togglePlayback,
    cycleRepetitions,
  } = useAudioPlayer(chapterid, minValue, maxValue);

  function scrollToVerse(){
    let element = document.getElementById(verseId);
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

  const toggleAyaSliderVisibility = () => {
    setAyaSliderVisible(!ayaSliderVisible);
  };
  
  const cycleWordLimit = () => {
    setWordLimit((prevLimit) => {
      let newLimit;
      if (prevLimit === 100) newLimit = 7;
      else if (prevLimit === 7) newLimit = 5;
      else if (prevLimit === 5) newLimit = 3;
      else if (prevLimit === 3) newLimit = 1;
      else newLimit = 100;
      localStorage.setItem('wordLimit', newLimit);
      return newLimit;
    });
  };

  

  return (
    <div className={`${theme === "dark" ? "bg-gray-800 text-slate-300" : "bg-gray-100 text-slate-800"} min-h-screen w-full pb-6`}>
      <header className={`${theme === "dark" ? "bg-gray-800 text-slate-300" : "bg-gray-100 text-slate-800"} header flex flex-col items-center p-4 sticky top-0 z-20`}>
        <BtnsHeader
          theme={theme}
          getPrevChapter={getPrevChapter}
          getNextChapter={getNextChapter}
          cycleWordLimit={cycleWordLimit}
          wordLimit={wordLimit}
          toggleAyaSliderVisibility={toggleAyaSliderVisibility}
          ayaSliderVisible={ayaSliderVisible}
          changeLanguage={changeLanguage}
          language={language}
          fontSize={fontSize}
          enlargeFont={enlargeFont}
        />
        <div className={`${ayaSliderVisible && 'hidden'} w-full mt-4 max-w-96`}>
          <div className="flex items-center justify-between mb-2">
            <BtnsRange
              value={minValue}
              onIncrement={() => adjustMinValue(1)}
              onDecrement={() => adjustMinValue(-1)}
              isPlaying={isPlaying}
              min={1}
              max={maxValue - 1}
            />
            <BtnsPlayback
              isPlaying={isPlaying}
              currentRepetition={currentRepetition}
              repetitions={repetitions}
              onTogglePlay={togglePlayback}
              onCycleRepetitions={cycleRepetitions}
            />
            <BtnsRange
              value={maxValue}
              onIncrement={() => adjustMaxValue(1)}
              onDecrement={() => adjustMaxValue(-1)}
              isPlaying={isPlaying}
              min={minValue + 1}
              max={verses}
            />
          </div>
          <MultiRangeSlider
            min={1}
            max={verses || 1}
            step={1}
            minValue={minValue}
            maxValue={maxValue}
            onChange={(e) => {
              setMinValue(e.minValue);
              setMaxValue(e.maxValue);
            }}
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

      <main style={{ fontSize: `${fontSize}px` }} className='flex flex-col items-center' >
        <div className='w-full max-w-96'>
        <div className="mb-2 text-xl text-center">{id} {text[language]} ({verses} verses, {words} words)</div>
        <img src={mustSayThis} className='z-10 mx-auto mb-4 max-w-52' alt='bismillah icon' style={{ filter: theme === "dark" && 'invert(80%)' }}/>
        {loading ? <Loading /> : groupedAyahs?.map((group, index) => (
          <Accordion key={index} titleAyah={group[0]} panelAyahs={group?.slice(1)} lang={language}/>
        ))}
        </div>
      </main>
    </div>
  );
}

export default Chapter;
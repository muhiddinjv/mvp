import React from 'react';
import { GlobalContext } from "../main";
import { sajdaSurahs } from '../hooks';

function Ayah({ ayahKey, ayah, lang }) {
    const { wordLimit, surahNum } = React.useContext(GlobalContext);
    const [audioAyah, setAudioAyah] = React.useState(null);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [isCycling, setIsCycling] = React.useState(false);
    const [audioCycle, setAudioCycle] = React.useState(null);
    const [cycleFrom, setCycleFrom] = React.useState(null); 
     
    const timer = React.useRef(null);
    const clickCount = React.useRef(0); 
    
    const localUrlWord = '../data/aud/word';
    const localUrlAyah = '../data/aud/ayah';
    const remoteUrlWord = `https://words.audios.quranwbw.com/${surahNum}`;
    const remoteUrlAyah = 'https://everyayah.com/data/Alafasy_128kbps';

    function playWord(url){
        clickCount.current += 1;
    
        if (timer.current) {
          clearTimeout(timer.current);
        }
    
        timer.current = setTimeout(() => {
          if (clickCount.current === 1) {
            highlightWord(url.p);
            const audio = new Audio(`${remoteUrlWord}/${url.p}.mp3`);
            audio.play();
          }
          clickCount.current = 0;
        }, 200);
    };

    function startCycleFrom(index){
        clearTimeout(timer.current);
        clickCount.current = 0;
        setCycleFrom(index)
    }
    
    function playAyah(url) {
        if (audioAyah && !audioAyah.paused) {
            audioAyah.pause();
            setIsPlaying(false);
        } else {
            const middleDigits = url.p.split('_')[1];
            const audioFileName = `${url.p.split('_')[0]}${middleDigits}.mp3`;
    
            const audio = new Audio(`${remoteUrlAyah}/${audioFileName}`);
            setAudioAyah(audio);
            audio.play();
            setIsPlaying(true);
    
            let playCount = 1; 
            audio.onended = function () {
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
    }

    function toggleCycleWords(urls) {
        setIsCycling(!isCycling);
        if (!isCycling) {
            cycleWords(urls); 
        } else {
            if (audioCycle) {
                audioCycle.pause(); 
            }
        }
    }

    function cycleWords(urls) {
        let cycleIndex = cycleFrom || 0; // Tracks the current cycle
        let urlIndex = 0; // Tracks the current URL within the cycle
        let playCount = 0; // Tracks how many times the current cycle has been played
    
        function playNext() {
            if (urlIndex > cycleIndex) {
                urlIndex = 0;
                playCount++;
                if (playCount > cycleIndex) {
                    playCount = 0;
                    cycleIndex++;
                    if (cycleIndex >= urls.length) {
                        setIsCycling(false);
                        return; // Stop the function when all cycles are completed
                    }
                }
            }
    
            const url = urls[urlIndex];
            highlightWord(url.p);
            const audio = new Audio(`${remoteUrlWord}/${url.p}.mp3`);
            setAudioCycle(audio);
            audio.play();
            audio.onended = function() {
                urlIndex++;
                playNext(); // Play the next URL after the current one finishes 
            };
        }
    
        playNext(); // Start the sequence
    }

    function highlightWord(id) {
        const wordElement = document.querySelector(`[data-id="${id}"]`);
        wordElement.classList.add('text-indigo-500', 'font-bold');
        setTimeout(() => {
            wordElement.classList.remove('text-indigo-500', 'font-bold');
        }, 1000);
    }

    return (
        <div id={ayahKey} className="text-left break-all whitespace-normal">
            {sajdaSurahs.includes(ayah.surah) && sajdaAyahs.includes(parseInt(ayahKey)) && (
                <span className="arrow-up-icon">&#129033;</span>
                )}
            <span onClick={() => playAyah(ayah.w[0])} className="text-indigo-500 font-extrabold cursor-pointer">{`${isPlaying ? '□' : '▷'}`}</span>
            <span onClick={() => toggleCycleWords(ayah.w)} className="ml-1 text-indigo-500 font-extrabold cursor-pointer">{`${isCycling ? '□' : '○'}`}</span>
            <span className="ml-1">{ayahKey}</span>
            {ayah.w.slice(0, wordLimit).map((word, index) => (
                <span data-id={word.p} onDoubleClick={()=>startCycleFrom(index,word.p)} onClick={()=>playWord(word)} key={index} className={`ml-1 cursor-pointer rtl ${cycleFrom === index && 'border'}`}>{word[lang]}</span>
            ))}
        </div>
    )
};

export default Ayah;

/*
TODO: add when needed
↻ ◁ || ▷ ↺ 
*/
  

  

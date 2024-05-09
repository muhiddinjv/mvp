

const Ayah = ({ ayahKey, ayah, lang }) => {
    const { wordLimit } = React.useContext(GlobalContext);
    const [audioAyah, setAudioAyah] = React.useState(null);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [isCycling, setIsCycling] = React.useState(false);
    const [audioCycle, setAudioCycle] = React.useState(null);

    function playWord(url) {
        try {
            highlightWord(url.p)
            const audio = new Audio(`../data/aud/word/${url.p}.mp3`);
            audio.play();
        } catch (error) {
            console.log('error', error)
        }
    }
    
    function playAyah(url) {
        if (audioAyah && !audioAyah.paused) {
            audioAyah.pause();
            setIsPlaying(false);
        } else {
            const middleDigits = url.p.split('_')[1];
            const audioFileName = `${url.p.split('_')[0]}${middleDigits}.mp3`;

            const audio = new Audio(`../data/aud/ayah/${audioFileName}`);
            setAudioAyah(audio);
            audio.play();
            audio.onended = function () {
                audio.pause();
                audio.currentTime = 0;
                setIsPlaying(false);
            };
            setIsPlaying(true);
        }
    }

    function toggleCycleWords(urls) {
        setIsCycling(!isCycling); // Toggle cycling state
        if (!isCycling) {
            cycleWords(urls); // Start cycling if not currently cycling
        } else {
            if (audioCycle) {
                audioCycle.pause(); // Pause the current playing audio
            }
        }
    }

    function cycleWords(urls) {
        let cycleIndex = 0; // Tracks the current cycle
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
            const audio = new Audio(`../data/aud/word/${url.p}.mp3`);
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
        wordElement.classList.add('font-bold');
        setTimeout(() => {
            wordElement.classList.remove('font-bold');
        }, 1000);
    }

    return (
        <div id={ayahKey} className="text-left">
            <span className="hidden">{ayahKey}</span>
            {sajdaSurahs.includes(ayah.surah) && sajdaAyahs.includes(parseInt(ayahKey)) && (
                <span className="arrow-up-icon">&#129033;</span>
            )}
            <span onClick={() => playAyah(ayah.w[0])} className="text-indigo-500 font-extrabold cursor-pointer">{`${isPlaying ? '□' : '▷'}`}</span>
            <span onClick={() => toggleCycleWords(ayah.w)} className="ml-1 text-indigo-500 font-extrabold cursor-pointer">{`${isCycling ? '□' : '○'}`}</span>
            {ayah.w.slice(0, wordLimit).map((word, index) => (
                <span data-id={word.p} onClick={() => playWord(word)} key={index} className="ml-2 cursor-pointer">{word[lang]}</span>
            ))}
            {/* <div className="col-12 f-t">
                <span className="a-n">{ayahKey} </span>
                <span>{ayah.a.g}</span>
            </div> */}
        </div>
    )
};

/*
TODO: add these icons when needed
↻ ◁ || ▷ ↺ 

function cycleWords(urls) {
    let currentIndex = 0;
    let interval;

    function playNext() {
        const url = urls[currentIndex % urls.length];
        playWord(url);

        currentIndex++;
        if (currentIndex === urls.length) {
            currentIndex = 0;
        }
    }

    // playNext(); // Play the first audio immediately

    interval = setInterval(playNext, 2000);
}

function cycleWords(urls) {
    let currentIndex = 0;
    let playCount = 0;
    let reps = 1;
    let interval;

    function playNext() {
        for (let i = 0; i < reps; i++) {
            for (let j = 0; j <= currentIndex; j++) {
                const url = urls[j % urls.length];
                playWord(url);
            }
        }

        playCount++;
        if (playCount === currentIndex + 1) {
            playCount = 0;
            if (currentIndex === urls.length - 1) {
                currentIndex = 0;
                reps++;
            } else {
                currentIndex++;
            }
        }
    }

    playNext();
    interval = setInterval(playNext, 2000);
}

- Cycle 1:  `u1`, end playing 
- Cycle 2:  `u1`, end playing ,  `u2`, end playing ,  `u1`, end playing ,  `u2`, end playing 
- Cycle 3:  `u1`, end playing ,  `u2`, end playing ,  `u3`, end playing ,  `u1`, end playing ,  `u2`, end playing ,  `u3`, end playing ,  `u1`, end playing ,  `u2`, end playing ,  `u3`, end playing 

*/
  

  

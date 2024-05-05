const sajdaSurahs = [7, 13, 16, 17, 19, 22, 25, 27, 32, 38, 41, 53, 84, 96];
const sajdaAyahs = [206, 15, 50, 109, 58, 18, 60, 26, 15, 24, 38, 62, 21, 19];

const Ayah = ({ ayahKey, ayah, lang }) => {
    const { wordLimit } = React.useContext(GlobalContext);
    const [audio, setAudio] = React.useState(null);

    function playWord(url) {
        try {
            highlightWord(url.p)
            const audio = new Audio(`../data/aud/word/${url.p}.mp3`);
            audio.play();
            audio.onended = function () {
                audio.pause();
                audio.currentTime = 0;
            };
        } catch (error) {
            console.log('error', error)
        }
    }

    function playAyah(url) {
        if (audio && !audio.paused) {
            audio.pause();
        } else {
            const middleDigits = url.p.split('_')[1];
            const audioFileName = `${url.p.split('_')[0]}${middleDigits}.mp3`;

            const newAudio = new Audio(`../data/aud/ayah/${audioFileName}`);
            setAudio(newAudio);
            newAudio.play();
            newAudio.onended = function () {
                newAudio.pause();
                newAudio.currentTime = 0;
            };
        }
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
            <span onClick={() => playAyah(ayah.w[0])} className="text-indigo-500 font-extrabold cursor-pointer">▷</span>
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
*/
  

  

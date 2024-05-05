const sajdaSurahs = [7, 13, 16, 17, 19, 22, 25, 27, 32, 38, 41, 53, 84, 96];
const sajdaAyahs = [206, 15, 50, 109, 58, 18, 60, 26, 15, 24, 38, 62, 21, 19];

const Ayah = ({ ayahKey, ayah, lang }) => {
    const { wordLimit } = React.useContext(GlobalContext);

    function playAudio(url) {
        try {
            highlightWord(url.p)
            const audio = new Audio(`../data/aud/${url.p}.mp3`);
            audio.play();
            audio.onended = function () {
                audio.pause();
                audio.currentTime = 0;
            };
        } catch (error) {
            console.log('error', error)
        }
    }

    function highlightWord(elId) {
        const wordElement = document.querySelector(`[data-id="${elId}"]`);
        wordElement.classList.add('font-bold');
        setTimeout(() => {
            wordElement.classList.remove('font-bold');
        }, 1000);
    }

    return (
        <div id={ayahKey} className="text-left">
            <span className="">{ayahKey}</span>
            {sajdaSurahs.includes(ayah.surah) && sajdaAyahs.includes(parseInt(ayahKey)) && (
                <span className="arrow-up-icon">&#129033;</span>
            )}
            {ayah.w.slice(0, wordLimit).map((word, index) => (
                <span data-id={word.p} onClick={() => playAudio(word)} key={index} className="overflow-hidden">
                    <span className="ml-1 cursor-pointer">{word[lang]}</span>
                </span>
            ))}
            {/* <div className="col-12 f-t">
                <span className="a-n">{ayahKey} </span>
                <span>{ayah.a.g}</span>
            </div> */}
        </div>
    )
};
  

  

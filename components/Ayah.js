const sajdaSurahs = [7, 13, 16, 17, 19, 22, 25, 27, 32, 38, 41, 53, 84, 96];
const sajdaAyahs = [206, 15, 50, 109, 58, 18, 60, 26, 15, 24, 38, 62, 21, 19];

const Ayah = ({ ayahKey, ayah, lang }) => {
    return (
        <div id={ayahKey}>
            <div className="">
                <span className="">{ayahKey}</span>
                {sajdaSurahs.includes(ayah.surah) && sajdaAyahs.includes(parseInt(ayahKey)) && (
                    <span className="arrow-up-icon">&#129033;</span>
                )}
                {ayah.w.map((word, index) => (
                    <span key={index} className="overflow-hidden" data-ts-mishary={word.b} data-ts-husary={word.h}>
                        <Word text={word[lang]} />
                    </span>
                ))}
                {/* <div className="col-12 f-t">
                    <span className="a-n">{ayahKey} </span>
                    <span>{ayah.a.g}</span>
                </div> */}
            </div>
        </div>
    )
};

  

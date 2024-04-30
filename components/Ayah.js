const sajdaSurahs = [7, 13, 16, 17, 19, 22, 25, 27, 32, 38, 41, 53, 84, 96];
const sajdaAyahs = [206, 15, 50, 109, 58, 18, 60, 26, 15, 24, 38, 62, 21, 19];

const Ayah = ({ ayahKey, ayah, ara, tra, eng }) => {
    console.log(ayah)
    return (
        <div className={`col-11 s-a`} id={ayahKey}>
            <div className="a">
                <span className="a-n">{ayahKey}</span>
                {sajdaSurahs.includes(ayah.surah) && sajdaAyahs.includes(parseInt(ayahKey)) && (
                    <span className="sw sajda-icon">&#129033;</span>
                )}
                {ayah.w.map((word, index) => (
                    <span key={index} className="sw" data-ts-mishary={word.b} data-ts-husary={word.h}>
                        {ara && <Word text={word.c} />}
                        {tra && <Word text={word.d} />}
                        {eng && <Word text={word.e} />}
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

  

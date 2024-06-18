import React from'react';
import { Loading, Accordion, Button } from '../components';
import { Link } from 'react-router-dom';
import { GlobalContext } from '../main';
import { useAyahs, useFontSize, useLanguage, useTheme } from '../hooks';

function Surah() {
  const { wordLimit, setWordLimit, surahNum } = React.useContext(GlobalContext);
  const { groupedAyahs, loading } = useAyahs(surahNum);
  const { theme, toggleTheme } = useTheme("dark");
  const { fontSize, enlargeFont } = useFontSize(16);
  const { language, changeLanguage } = useLanguage();
  console.log('groupedAyahs :>> ', groupedAyahs);

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

  return (
    <div className={`${theme === "dark" ? "bg-gray-800 text-slate-300" : "bg-gray-100 text-slate-800" } min-h-screen w-full pb-6`}>
      <header className="header flex flex-col items-center p-4">
        <div className="tools w-full max-w-72 flex justify-between">
          <Link to="/" className={`${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} hover:bg-gray-400 size-8 rounded flex items-center justify-center text-2xl`}>{`<`}</Link>
          <Button theme={theme} onClick={cycleWordLimit} text={wordLimit == 100 ? <>∞</> : wordLimit }/>
          <Button theme={theme} onClick={toggleTheme} text={theme=="light"?<>&#9734;</>:<>&#9733;</>} />
          <Button theme={theme} onClick={changeLanguage} text={language} />
          <div className="font-size flex items-center">
            <Button theme={theme} onClick={() => enlargeFont(false)} text="−" />
            <div className="fontSizeDiv mx-2 text-lg">{fontSize}</div>
            <Button theme={theme} onClick={() => enlargeFont(true)} text="+" />
          </div>
        </div>
        <div className="hidden">
          <span>Surah: Yasin | </span>
          <span>Verses: 84</span>
        </div>
      </header>
      <main style={{ fontSize: `${fontSize}px` }}>
        {loading ? <Loading /> : groupedAyahs?.map((group, index) => (
          <Accordion key={index} titleAyah={group[0]} panelAyahs={group?.slice(1)} lang={language}/>
        ))}
      </main>
    </div>
  );
}

export default Surah;
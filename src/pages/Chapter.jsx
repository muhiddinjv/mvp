import React from'react';
import { Loading, Accordion, Button } from '../components';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { GlobalContext } from '../main';
import { useAyahs, useFontSize, useLanguage, useTheme, useSwipe } from '../hooks';
import mustSayThis from '../assets/bismillah.png';

function Chapter() {
  const { chapterid } = useParams();
  const { wordLimit, setWordLimit, chapters, chapterId } = React.useContext(GlobalContext);
  const { groupedAyahs, loading } = useAyahs(chapterid || chapterId);
  const { theme, toggleTheme } = useTheme("dark");
  const { fontSize, enlargeFont } = useFontSize(16);
  const { language, changeLanguage } = useLanguage();
  const vid = localStorage.getItem('verseId')
  console.log({chapterid, chapterId, groupedAyahs})

  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    setTimeout(() => {
      if (location.state?.fromBookmark) {
        scrollToVerse();
      }
    }, 500);
  }, [location.state]);
  
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

  return (
    <div className={`${theme === "dark" ? "bg-gray-800 text-slate-300" : "bg-gray-100 text-slate-800" } min-h-screen w-full pb-6`}>
      <header className={`${theme === "dark" ? "bg-gray-800 text-slate-300" : "bg-gray-100 text-slate-800" } header flex flex-col items-center p-4 sticky top-0 z-20`}>
        <div className="tools w-full max-w-96 flex justify-between">
          <Button theme={theme} fontSize="2xl" onClick={getPrevChapter} text='<' />
          <Link to="/" className={`${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} hover:bg-gray-400 size-8 rounded flex items-center justify-center text-2xl`}>⌂</Link>
          <Button theme={theme} onClick={cycleWordLimit} text={wordLimit == 100 ? <>ထ</> : wordLimit }/>
          <Button theme={theme} onClick={toggleTheme} text={theme=="light"?<>&#9734;</>:<>&#9733;</>} />
          <Button theme={theme} onClick={changeLanguage} text={language} />
          <div className="font-size flex items-center">
            <Button theme={theme} onClick={() => enlargeFont(false)} text="−" />
            <span className="fontSizeDiv mx-2 text-lg">{fontSize}</span>
            <Button theme={theme} onClick={() => enlargeFont(true)} text="+" />
          </div>
          <Button theme={theme} fontSize="2xl" onClick={getNextChapter} text='>' />
        </div>
      </header>
      <main style={{ fontSize: `${fontSize}px` }}>
        <div className="text-center text-xl mb-2">{chapters[chapterid-1]?.id} {chapters[chapterid-1]?.text[language]} {chapters[chapterid-1]?.words} words</div>
        <img src={mustSayThis} className='mx-auto max-w-52 z-10 mb-4' alt='bismillah icon' style={{ filter: theme === "dark" && 'invert(80%)' }}/>
        {loading ? <Loading /> : groupedAyahs?.map((group, index) => (
          <Accordion key={index} titleAyah={group[0]} panelAyahs={group?.slice(1)} lang={language}/>
        ))}
      </main>
    </div>
  );
}

export default Chapter;
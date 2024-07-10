import React, { useRef } from'react';
import { useTheme, useBookmarks, useScrollToVerse } from '../hooks';
import { GlobalContext } from '../main';
import { Link } from 'react-router-dom';

function Surahs() {
  const { theme } = useTheme("dark");
  const [ sortType, setSortType ] = React.useState('id');
  const [ sortOrder, setSortOrder ] = React.useState(false);
  const { setSurahNum, chapters, setChapters, verseId, setVerseId, parentFunc } = React.useContext(GlobalContext);
  const [,,getParsedBookmarks] = useBookmarks();
  const { divRef } = useScrollToVerse(verseId, 0);
  const bookmarks = localStorage.getItem('bookmarks') || '';
  const ref = useRef(null);

  const sortChapters = (data, field, ascending) => {
    return [...data].sort((a, b) => (ascending ? a[field] - b[field] : b[field] - a[field]));
  };

  const handleSortBy = (type) => {
    setSortType(type);
    setSortOrder((prevOrder) => !prevOrder);
    setChapters(sortChapters(chapters, type, sortOrder));
  };

  const handleBookmark = (bookmark) => {
    setVerseId(bookmark.verseId);
    setSurahNum(bookmark.chapterId);
    localStorage.setItem("surah", bookmark.chapterId);
  };
  
  const childFunc = () => {
    parentFunc();
  }

  
  const handleClick = () => {
      ref.current?.scrollIntoView({behavior: 'smooth'});
  };

  function scrollToDiv() {
    console.log(verseId)
    document.getElementById(verseId).scrollIntoView({behavior: 'smooth'});
}

  return (
    <div className={`${ theme === "dark" ? "bg-gray-800 text-slate-300" : "bg-gray-100 text-slate-800"} grid grid-cols-1 gap-3 p-4 min-h-screen w-screen items-center justify-center`}>
      <div className='flex text-center cursor-pointer'>
        <span onClick={()=>handleSortBy('id')} className='border rounded-l w-full py-2'>Surah {sortType === 'id' && sortOrder ? '⇩' : '⇧'}</span>
        <span onClick={()=>handleSortBy('sajda')} className='border rounded-r w-full py-2'>Sajda {sortType === 'sajda' && sortOrder ? '۩' : '⇧'}</span>
        <span onClick={()=>handleSortBy('words')} className='border rounded-r w-full py-2'>Word {sortType === 'words' && sortOrder ? '⇩' : '⇧'}</span>
        <button onClick={scrollToDiv} selector="#114" className="border rounded-r w-full py-2">
          Jump
        </button>
      </div>
      <ul className={`${bookmarks.length == 0 && 'hidden'} border rounded p-1 flex justify-center`}>
        {getParsedBookmarks()
          .filter(bookmark => chapters.some(chapter => chapter.id === bookmark.chapterId))
          .map(bookmark => (
            <li key={bookmark.verseId} className='border rounded mx-1 p-1 cursor-pointer hover:bg-slate-600 transition duration-200 ease-in hover:scale-110'>
                <Link to={`/${bookmark.chapterId}`} onClick={() => handleBookmark(bookmark)}>
                    {`${bookmark.chapterId}:${bookmark.verseId}`}
                </Link>
            </li>
        ))}
      </ul>
      {chapters?.map(chapter => {
        return (<span id={chapter.id} key={chapter.id} onClick={()=>{setSurahNum(chapter.id);localStorage.setItem("surah", chapter.id)}} className="px-4 py-2 text-center border rounded">
          <Link to={`/${chapter.id}`}>
            {chapter.id} {chapter.transliteration} [{chapter.words} words] {chapter.sajda !== null && '۩'}
          </Link>
        </span>)
      })}
    </div>
  );
}

export default Surahs;

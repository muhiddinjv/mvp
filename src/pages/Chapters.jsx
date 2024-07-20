import React from'react';
import { useTheme, useBookmarks } from '../hooks';
import { GlobalContext } from '../main';
import { Link } from 'react-router-dom';
import downloadIconSlate from '../assets/dld-min-slate.svg';
import downloadIconDark from '../assets/dld-min.svg';

function Chapters() {
  const { theme } = useTheme("dark");
  const [ sortType, setSortType ] = React.useState('id');
  const [ sortOrder, setSortOrder ] = React.useState(false);
  const { setChapterId, chapters, setChapters } = React.useContext(GlobalContext);
  const [,,getParsedBookmarks] = useBookmarks();
  const bookmarks = localStorage.getItem('bookmarks') || '';

  const sortChapters = (data, field, ascending) => {
    return [...data].sort((a, b) => (ascending ? a[field] - b[field] : b[field] - a[field]));
  };

  const handleSortBy = (type) => {
    setSortType(type);
    setSortOrder((prevOrder) => !prevOrder);
    setChapters(sortChapters(chapters, type, sortOrder));
  };

  const handleBookmark = (bookmark) => {
    setChapterId(bookmark.chapterId);
    localStorage.setItem("chapterId", bookmark.chapterId);
    localStorage.setItem("verseId", `${bookmark.chapterId}_${bookmark.verseId}`);
  };

  const handleChapter = (chapter) => {
    setChapterId(chapter.id);
    localStorage.setItem("chapterId", chapter.id);
  }

  return (
    <div className={`${ theme === "dark" ? "bg-gray-800 text-slate-300" : "bg-gray-100 text-slate-800"} grid grid-cols-1 gap-2 p-3 min-h-screen items-center justify-center`}>
      <div>
        <div className='flex text-center cursor-pointer border-x border border-indigo-500 rounded-t'>
          <span onClick={()=>handleSortBy('id')} className='border-indigo-500 border-r w-full py-2'>Surah {sortType === 'id' && sortOrder ? '⇩' : '⇧'}</span>
          <span onClick={()=>handleSortBy('sajda')} className='w-full py-2'>Sajda {sortType === 'sajda' && sortOrder ? '۩' : '⇧'}</span>
          <span onClick={()=>handleSortBy('words')} className='border-indigo-500 border-l w-full py-2'>Word {sortType === 'words' && sortOrder ? '⇩' : '⇧'}</span>
        </div>
        <ul className={`${bookmarks.length == 0 && 'hidden'} border-x border-b border-indigo-500 rounded-b p-1 flex justify-center flex-wrap`}>
          {getParsedBookmarks()
            .filter(bookmark => chapters.some(chapter => chapter.id === bookmark.chapterId))
            .map(bookmark => (
              <li key={`${bookmark.verseId}${bookmark.chapterId}`} className='border border-indigo-500 rounded m-1 p-1 cursor-pointer transition duration-200 ease-in hover:scale-110'>
                  <Link to={`/${bookmark.chapterId}`} onClick={() => handleBookmark(bookmark)} state={{ fromBookmark: true }}>
                      {`${bookmark.chapterId}:${bookmark.verseId}`}
                  </Link>
              </li>
          ))}
        </ul>
      </div>
      {chapters?.map(chapter => {
        return (<span id={chapter.id} key={chapter.id} onClick={()=> handleChapter(chapter)} className="flex border border-indigo-500 rounded">
          <span className='flex items-center justify-center border-r border-indigo-500 text-lg w-full max-w-12'>{chapter.id}</span>
          <Link to={`/${chapter.id}`} className='flex-grow p-1 ml-2'>
            <div className='font-bold'>{chapter.transliteration}</div>
            <div className='text-sm'>
              {chapter.verses} verses | {chapter.words} words {chapter.sajda !== null && <span> ۩</span>}
            </div>
          </Link>
          <span onClick={() => alert(`download ${chapter.id}-${chapter.transliteration}'s audio`)} className='border-indigo-500 border-l p-2 flex cursor-pointer'>
            <img src={theme === "dark" ? downloadIconSlate : downloadIconDark} className='w-6'/>
          </span>
        </span>)
      })}
    </div>
  );
}

export default Chapters;

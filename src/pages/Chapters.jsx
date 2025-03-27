import React from 'react';
import { useTheme, useBookmarks } from '../hooks';
import { GlobalContext } from '../main';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faHome, faLightbulb, faBook, faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import ankiImage from '../assets/anki.png';

function Chapters() {
  const { theme } = useTheme("dark");
  const [ sortType, setSortType ] = React.useState('id');
  const [ sortOrder, setSortOrder ] = React.useState(false);
  const { setChapterId, chapters, setChapters } = React.useContext(GlobalContext);
  const [,, getParsedBookmarks] = useBookmarks();
  const bookmarks = localStorage.getItem('bookmarks') || '';

  const sortChapters = (data, field, ascending) => {
    return [...data].sort((a, b) => (ascending ? a[field] - b[field] : b[field] - a[field]));
  };

  const handleSortBy = (type) => {
    setSortType(type);
    setSortOrder(prevOrder => !prevOrder);
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
  };

  // Get the lowest unlocked surah from localStorage.
  // Default to 114 if not set.
  const lowestUnlocked = Number(localStorage.getItem("lowestUnlockedSurah")) || 114;


  return (
    <div className={`${theme === "dark" ? "bg-gray-800 text-slate-300" : "bg-gray-100 text-slate-800"} grid grid-cols-1 gap-2 p-3 min-h-screen items-center justify-center`}>
      <div>
        <div className='flex text-center cursor-pointer border-x border border-gray-500 rounded-t'>
          <Link to='/howto' className='border-r border-gray-500 w-full max-w-12 py-2'>
            <FontAwesomeIcon icon={faCircleQuestion} />
          </Link>
          <span onClick={() => handleSortBy('id')} className='border-r border-gray-500 w-full py-2'>Surah <FontAwesomeIcon icon={sortType === 'id' && sortOrder ? faArrowDown : faArrowUp} /></span>
          <span onClick={() => handleSortBy('sajda')} className='w-full py-2'>Sajda {sortType === 'sajda' && sortOrder ? '۩' : <FontAwesomeIcon icon={faArrowUp} />}</span>
          <span onClick={() => handleSortBy('words')} className='border-l border-gray-500 w-full py-2'>Word <FontAwesomeIcon icon={sortType === 'words' && sortOrder ? faArrowDown : faArrowUp} /></span>
          <Link to='/stories' className='border-l border-gray-500 w-full max-w-12 py-2'>
            <FontAwesomeIcon icon={faLightbulb} />
          </Link>
        </div>
        <ul className={`${bookmarks.length === 0 && 'hidden'} border-x border-b border-gray-500 rounded-b p-1 flex justify-center flex-wrap`}>
          {getParsedBookmarks()
            .filter(bookmark => chapters.some(chapter => chapter.id === bookmark.chapterId))
            .map(bookmark => (
              <li key={`${bookmark.chapterId}${bookmark.verseId}`} className='border border-gray-500 rounded m-1 px-2 py-1 cursor-pointer transition duration-200 ease-in hover:scale-110'>
                <Link to={`/${bookmark.chapterId}`} onClick={() => handleBookmark(bookmark)} state={{ fromBookmark: true }}>
                  {`${bookmark.chapterId}:${bookmark.verseId}`}
                </Link>
              </li>
          ))}
        </ul>
      </div>
      {chapters?.map(chapter => {
        const chapterNum = Number(chapter.id);
        // Only chapters with an id >= lowestUnlocked are unlocked.
        const isUnlocked = chapterNum >= lowestUnlocked;
        return (
          <span id={chapter.id} key={chapter.id} onClick={() => handleChapter(chapter)} className="flex border border-gray-500 rounded">
            <span className='flex items-center justify-center border-r border-gray-500 text-lg w-full max-w-12'>{chapter.id}</span>
            <Link to={`/${chapter.id}`} className='flex-grow p-1 ml-2'>
              <div className='font-bold'>{chapter.text.tr}</div>
              <div className='text-sm'>
                {chapter.verses} verses | {chapter.words} words {chapter.sajda !== null && <span> ۩</span>}
              </div>
            </Link>
            {isUnlocked ? (
              <Link
                to={`/anki/${chapter.id}`}
                className='w-full max-w-12 border-l border-gray-500 p-2 flex justify-center items-center cursor-pointer'
              >
                <FontAwesomeIcon icon={faBook} />
              </Link>
            ) : (
              <div className="w-full max-w-12 border-l border-gray-500 p-2 flex justify-center items-center opacity-50 cursor-not-allowed">
                <FontAwesomeIcon icon={faBook} />
              </div>
            )}
          </span>
        );
      })}
    </div>
  );
}

export default Chapters;
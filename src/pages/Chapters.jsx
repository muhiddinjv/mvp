import React, { useEffect } from 'react';
import { useTheme, useBookmarks } from '../hooks';
import { CardStorage, GlobalContext } from '../main';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faLightbulb, faBook, faCircleQuestion, faUpDownLeftRight } from '@fortawesome/free-solid-svg-icons';
import { State } from 'ts-fsrs';
import moment from 'moment';
import StreakBanner from '../components/StreakBanner';
import toast, { Toaster } from 'react-hot-toast';

function Chapters() {
  const { theme } = useTheme("dark");
  const [ sortType, setSortType ] = React.useState(() => localStorage.getItem('sortType') || 'id');
  const [sortOrder, setSortOrder] = React.useState(() => {
    const stored = localStorage.getItem('sortOrder');
    return stored !== null ? stored === 'true' : false;
  });
  const [lowestUnlocked, setLowestUnlocked] = React.useState(() =>
    Number(localStorage.getItem("lowestUnlockedSurah")) || 114
  );
  const { setChapterId, chapters, setChapters, cardCounts, setCardCounts, words } = React.useContext(GlobalContext);
  const [,, getParsedBookmarks] = useBookmarks();
  const bookmarks = localStorage.getItem('bookmarks') || '';

  const location = useLocation();

  useEffect(() => {
    if (location.state?.streakUpdated) {
      toast.success("Review completed!");
      const updatedUnlock = Number(localStorage.getItem("lowestUnlockedSurah")) || 114;
      setLowestUnlocked(updatedUnlock);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    if (chapters && chapters.length > 0) {
      const sorted = sortChapters(chapters, sortType, sortOrder);
      setChapters(sorted);
    }
  }, [sortType, sortOrder]);
  

  const sortChapters = (data, field, ascending) => {
    return [...data].sort((a, b) => (ascending ? a[field] - b[field] : b[field] - a[field]));
  };

  const handleSortBy = (type) => {
    const newOrder = type === sortType ? !sortOrder : false;
    setSortType(type);
    setSortOrder(newOrder);
    localStorage.setItem('sortType', type);
    localStorage.setItem('sortOrder', newOrder);
  
    const sorted = sortChapters(chapters, type, newOrder);
    setChapters(sorted);
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

  useEffect(() => {
    // Recalculate counts whenever the component mounts or when chapters change
    const newCardCounts = {};
    for (const chapter of chapters) {
      if (words[chapter.id]) { // Check if words for the chapter exist
        const storedCards = CardStorage.loadCards(words[chapter.id], chapter.id);
        const newCount = storedCards.filter(card => card.state === State.New).length;
        const learningCount = storedCards.filter(card => (card.state === State.Learning || card.state === State.Relearning) && moment(card.due).isSameOrBefore(moment())).length;
        const reviewCount = storedCards.filter(card => card.state === State.Review && moment(card.due).isSameOrBefore(moment())).length;

        newCardCounts[chapter.id] = { newCount, learningCount, reviewCount };
      } else {
        newCardCounts[chapter.id] = { newCount: 0, learningCount: 0, reviewCount: 0 }; // Default counts
      }
    }
    setCardCounts(newCardCounts);
  }, [chapters]); // Add words as a dependency

  return (
    <div className={`${theme === "dark" ? "bg-gray-800 text-slate-300" : "bg-gray-100 text-slate-800"} grid grid-cols-1 gap-2 p-3 min-h-screen items-center justify-center`}>
      <div>
      <StreakBanner />
      <Toaster position="top-center" />
      {/* <ReviewCalendar /> */}
        <div className='flex text-center cursor-pointer border-x border border-gray-500 rounded'>
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
        <ul className={`${bookmarks.length === 0 ? 'hidden' : undefined} border-x border-b border-gray-500 rounded-b p-1 flex justify-center flex-wrap`}>
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
        // Only chapters with an id >= lowestUnlocked are unlocked.
        const isUnlocked = Number(chapter.id) >= lowestUnlocked;
        const counts = cardCounts[chapter.id] || { newCount: 0, learningCount: 0, reviewCount: 0 };

        return (
          <span id={chapter.id} key={chapter.id} onClick={() => handleChapter(chapter)} className="flex border border-gray-500 rounded">
            <span className='flex items-center justify-center border-r border-gray-500 text-lg w-full max-w-12'>{chapter.id}</span>
            <Link to={`/${chapter.id}`} className='flex-grow p-1 ml-2'>
              <div className='font-bold'>{chapter.text.tr}</div>
              <div className='text-sm'>
                {chapter.verses} verses | {chapter.words} words {chapter.sajda !== null && <span> ۩</span>}
              </div>
            </Link>
            <Link to={`/dnd/${chapter.id}`} className='w-full relative max-w-12 border-l border-gray-500 p-2 flex justify-center items-center cursor-pointer'>
              <FontAwesomeIcon icon={faUpDownLeftRight} />
            </Link>
            {isUnlocked ? (
              <Link to={`/anki/${chapter.id}`} className='w-full relative max-w-12 border-l border-gray-500 p-2 flex justify-center items-center cursor-pointer'>
                <FontAwesomeIcon icon={faBook}/>
                {(counts.newCount + counts.learningCount + counts.reviewCount) > 0 && (
                  <span className="absolute top-0 right-0 bg-slate-300 text-gray-800 text-xs rounded-full px-1">
                    {counts.newCount + counts.learningCount + counts.reviewCount}
                  </span>
                )}
              </Link>
            ) : (
              <div className="w-full max-w-12 border-l border-gray-500 flex justify-center items-center opacity-50 cursor-not-allowed">
                <FontAwesomeIcon icon={faBook}/>
              </div>
            )}
          </span>
        );
      })}
    </div>
  );
}

export default Chapters;
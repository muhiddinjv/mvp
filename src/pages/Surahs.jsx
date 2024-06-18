import React from'react';
import { sajdaSurahs, useTheme } from '../hooks';
import { GlobalContext } from '../main';
import { Link } from 'react-router-dom';

function Surahs() {
  const { theme } = useTheme("dark");
  const [ chapters, setChapters ] = React.useState();
  const [ sortType, setSortType ] = React.useState('id');
  const [ sortOrder, setSortOrder ] = React.useState(false);
  const { setSurahNum } = React.useContext(GlobalContext);

  React.useEffect(() => {
    fetch('/json/chapters.json')
      .then(res => res.json())
      .then(data => setChapters(data))
      .catch(err => console.log(err));
  }, []);

  const sortChapters = (data, field, ascending) => {
    return [...data].sort((a, b) => (ascending ? a[field] - b[field] : b[field] - a[field]));
  };

  const handleSortBy = (type) => {
    setSortType(type);
    setSortOrder((prevOrder) => !prevOrder);
    setChapters(sortChapters(chapters, type, sortOrder));
  };

  return (
    <div className={`${ theme === "dark" ? "bg-gray-800 text-slate-300" : "bg-gray-100 text-slate-800"} grid grid-cols-1 gap-3 p-4 min-h-screen w-screen items-center justify-center`}>
        <div className='flex text-center cursor-pointer'>
          <span onClick={()=>handleSortBy('id')} className='border rounded-l w-full py-2'>Surah {sortType === 'id' && sortOrder ? '⇩' : '⇧'}</span>
          <span onClick={()=>handleSortBy('sajda')} className='border rounded-r w-full py-2'>Sajda {sortType === 'sajda' && sortOrder ? '⇩' : '۩'}</span>
          <span onClick={()=>handleSortBy('words')} className='border rounded-r w-full py-2'>Word {sortType === 'words' && sortOrder ? '⇩' : '⇧'}</span>
        </div>
        {chapters?.map(chapter => {
          return (<span key={chapter.id} onClick={()=>{setSurahNum(chapter.id);localStorage.setItem("surah", chapter.id)}} className="px-4 py-2 text-center border rounded">
            <Link to={`/${chapter.id}`}>{chapter.id} {chapter.transliteration} [{chapter.words} words] {chapter.sajda !== null && '۩'}</Link>
          </span>)
        })}
    </div>
  );
}

export default Surahs;

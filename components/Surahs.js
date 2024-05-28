function Surahs() {
  const { theme } = useTheme("dark");
  const [ chapters, setChapters ] = React.useState();
  const [sortOrder, setSortOrder] = React.useState(false);
  const { setSurahNum } = React.useContext(GlobalContext);

  React.useEffect(() => {
    fetch('/data/json/chapters.json')
      .then(res => res.json())
      .then(data => {
        setChapters(data);
      });
  }, []);

  const sortChapters = (data, field, ascending) => {
    return [...data].sort((a, b) => (ascending ? a[field] - b[field] : b[field] - a[field]));
  };

  const handleSortBy = (type) => {
    setSortOrder((prevOrder) => !prevOrder);
    setChapters(sortChapters(chapters, type, sortOrder));
  };

  return (
    <div className={`${ theme === "dark" ? "bg-gray-800 text-slate-300" : "bg-gray-100 text-slate-800"} grid grid-cols-1 gap-3 p-4 min-h-screen w-screen items-center justify-center`}>
        <div className='flex text-center rounded cursor-pointer'>
          <span onClick={()=>handleSortBy('id')} className='border w-full py-2'>Sort by surah</span>
          <span onClick={()=>handleSortBy('words')} className='border w-full py-2'>Sort by word</span>
        </div>
        {chapters?.map(chapter => {
          return (<span onClick={()=>setSurahNum(chapter.id)} className="px-4 py-2 text-center border rounded">
            <Link href={`/${chapter.id}`}>{chapter.id} {chapter.transliteration} [{chapter.words} words]</Link>
          </span>)
        })}
    </div>
  );
}

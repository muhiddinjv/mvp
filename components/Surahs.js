function Surahs() {
  const { theme } = useTheme("dark");
  const [ chapters, setChapters ] = React.useState();
  const { setSurahNum } = React.useContext(GlobalContext);

  React.useEffect(() => {
    fetch('/data/json/chapters.json')
      .then(res => res.json())
      .then(data => {
        setChapters(data);
      })
  }, [])  

  return (
    <div className={`${ theme === "dark" ? "bg-gray-800 text-slate-300" : "bg-gray-100 text-slate-800"} flex flex-col min-h-screen w-screen items-center justify-center p-2`}>
        {chapters?.map(chapter => {
          return (<span onClick={()=>setSurahNum(chapter.id)} className="mb-6">
            <Link href={`/${chapter.id}`}  className="border px-4 py-2 rounded w-20">Start {chapter.id}</Link>
          </span>)
        })}
    </div>
  );
}

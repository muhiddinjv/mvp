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
    <div className={`${ theme === "dark" ? "bg-gray-800 text-slate-300" : "bg-gray-100 text-slate-800"} grid grid-cols-3 gap-3 p-4 min-h-screen w-screen items-center justify-center`}>
        {chapters?.map(chapter => {
          return (<span onClick={()=>setSurahNum(chapter.id)} className="px-4 py-2 text-center border rounded">
            <Link href={`/${chapter.id}`}>Start {chapter.id}</Link>
          </span>)
        })}
    </div>
  );
}

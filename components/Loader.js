const Loader = () => {
  const { ayahs, loading } = useAyahs();
  const [ lang, setLang ] = React.useState("e");

  if (loading) {
    return <div>Loading...</div>;
  }

  const groupedAyahs = [];
  const ayahKeys = Object.keys(ayahs);
  for (let i = 0; i < ayahKeys.length; i += 5) {
    const group = ayahKeys.slice(i, i + 5).map(key => ayahs[key]);
    groupedAyahs.push(group);
  }
  function handleLanguage(){
    if (lang == "e") setLang("d");
    if (lang == "d") setLang("c")
    if (lang == "c") setLang("e")
  }

  return (
    <div className="full-surah">
      <Button fn={handleLanguage} text="language" />
      {groupedAyahs.map((group, index) => (
        <Accordion key={index} titleAyah={group[0]} panelAyahs={group.slice(1)} lang={lang} />
      ))}
    </div>
  );
};
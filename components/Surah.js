function addPFieldToObject(obj) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const childObj = obj[key];
      if (childObj.w && Array.isArray(childObj.w)) {
        childObj.w.forEach((word, index) => {
          const pageNumber = `036_${key.padStart(3, '0')}_${(index + 1).toString().padStart(3, '0')}`;
          word.p = pageNumber;
        });
      }
    }
  }
    // Convert the updated data to a JSON string
  const jsonStr = JSON.stringify(obj, null, 2);

  // Create a Blob with the JSON data
  const blob = new Blob([jsonStr], { type: 'application/json' });

  // Create a temporary URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create a link element to trigger the download
  const link = document.createElement('a');
  link.href = url;
  link.download = 'updatedData.json';

  // Append the link to the document and trigger the download
  document.body.appendChild(link);
  link.click();

  // Clean up by revoking the URL object
  URL.revokeObjectURL(url);
}

function Surah() {
  const { ayahs, loading } = useAyahs(36);
  const { theme, toggleTheme } = useTheme("dark");
  const { fontSize, enlargeFont } = useFontSize(16);
  const { language, changeLanguage } = useLanguage("e");
  const { wordLimit, setWordLimit } = React.useContext(GlobalContext);
  
  if (loading) {
    return <div>Loading...</div>;
  }

  let groupedAyahs = [];
  const ayahKeys = Object.keys(ayahs);
  for (let i = 0; i < ayahKeys.length; i += 5) {
    const group = ayahKeys.slice(i, i + 5).map(key => ayahs[key]);
    groupedAyahs.push(group);
  }

  const cycleWordLimit = () => {
    setWordLimit((prevLimit) => {
      let newLimit;
      if (prevLimit === 100) newLimit = 7;
      else if (prevLimit === 7) newLimit = 5;
      else if (prevLimit === 5) newLimit = 3;
      else if (prevLimit === 3) newLimit = 1;
      else newLimit = 100; // Reset to no limit
      localStorage.setItem('wordLimit', newLimit);
      return newLimit;
    });
  };

  return (
    <div
      className={`${
        theme === "dark"
          ? "bg-gray-800 text-white"
          : "bg-gray-100 text-black"
      } min-h-screen w-full`}
    >
      <header className="header flex flex-col items-center p-4">
        <div className="tools w-full max-w-56 flex justify-between">
          <Button theme={theme} fn={cycleWordLimit} text={wordLimit == 100 ? <>∞</> : wordLimit }/>
          <Button theme={theme} fn={toggleTheme} text={theme=="light"?<span>&#9734;</span>:<span>&#9728;</span>} />
          <Button theme={theme} fn={changeLanguage} text={language} />
          <div className="font-size flex items-center">
            <Button theme={theme} fn={() => enlargeFont(false)} text="−" />
            <div className="fontSizeDiv mx-2 text-lg">{fontSize}</div>
            <Button theme={theme} fn={() => enlargeFont(true)} text="+" />
          </div>
        </div>
        <div className="hidden">
          <span>Surah: Yasin | </span>
          <span>Verses: 84</span>
        </div>
      </header>
      <main style={{ fontSize: `${fontSize}px` }}>
        {groupedAyahs.map((group, index) => (
          <Accordion key={index} titleAyah={group[0]} panelAyahs={group.slice(1)} lang={language} theme={theme}/>
        ))}
      </main>
    </div>
  );
}


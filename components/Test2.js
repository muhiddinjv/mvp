async function Test2(sura) {
    console.log(sura)
  const createAccordion = () => {
    const accordionItems = [];

    for (let i = 0; i < verses.length; i += 6) {
      const buttonContent = `${i + 1}) ${verses[i].text}`;
      const panelContent = [];

      for (let j = i + 1; j < i + 5 && j < verses.length; j++) {
        panelContent.push(
          <div key={verses[j].id}>
            <p>{verses[j].text}</p>
            <p>{verses[j].translation}</p>
            <p>{verses[j].transliteration}</p>
          </div>
        );
      }

      accordionItems.push(
        <div key={verses[i].id}>
          <button>{buttonContent}</button>
          <div style={{ display: 'none' }}>
            {panelContent}
          </div>
        </div>
      );
    }

    return accordionItems;
  };

  return <div className="accordion">{createAccordion()}</div>;
}

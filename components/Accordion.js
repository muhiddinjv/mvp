function Accordion({ verses }) {
    const createAccordion = () => {
      const accordionItems = [];
      const panelItems = [];
  
      for (let i = 0; i < verses.length; i += 5) {
        const buttonContent = `${i + 1}) ${verses[i]}`;
  
        for (let j = i + 1; j <= i + 4 && j < verses.length; j++) {
          const panelContent = `${j + 1}) ${verses[j]}`;
          panelItems.push(<div key={j} className="accordion-item">{panelContent}</div>);
        }
  
        accordionItems.push(
          <div key={i}>
            <div className="accordion-btn">{buttonContent}</div>
            <div className="accordion-panel">{panelItems}</div>
          </div>
        );
      }
      console.log(111,accordionItems)
  
      return accordionItems;
    };
  
    return <div className="accordion">{createAccordion()}Accordion</div>;
  }
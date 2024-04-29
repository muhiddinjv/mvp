function Accordion({ verses }) {
  const [expanded, setExpanded] = React.useState(false);

  const createAccordion = () => {
    const accordionItems = [];

    for (let i = 0; i < verses.length; i++) {
      const buttonContent = `${i + 1}) ${verses[i]}`;
      const panelContent = `${i + 1}) ${verses[i]}`;

      accordionItems.push(
        <div key={i}>
          <div className="divide-y divide-slate-200 mx-5">
            <button className="flex items-center justify-between font-semibold py-2" onClick={() => setExpanded(i)}>
              <span>{buttonContent}</span>
              <svg className="fill-indigo-500 shrink-0 ml-8" width="16" height="16">
                <rect y="7" width="16" height="2" rx="1" className="transform origin-center transition duration-200 ease-out" />
                <rect y="7" width="16" height="2" rx="1" className={`transform origin-center ${expanded === i ? 'rotate-90' : ''} transition duration-200 ease-out`} />
              </svg>
            </button>
            <div className={`grid text-sm text-slate-600 overflow-hidden transition-all duration-300 ease-in-out ${expanded === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
              <p className="overflow-hidden pb-3">{panelContent}</p>
            </div>
          </div>
        </div>
      );
    }

    return accordionItems;
  };

  return <div className="accordion">{createAccordion()}</div>;
}
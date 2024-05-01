function Accordion({ titleAyah, panelAyahs, lang }) {
    const [expanded, setExpanded] = React.useState(false)
    return (
        <div className="divide-y mx-5">
            <button className="flex py-2 items-center" onClick={() => setExpanded(!expanded)}>
            <svg className="fill-indigo-500 shrink-0 ml-4" width="8" height="8">
                    <rect y="3" width="8" height="2" rx="1" className="transform origin-center transition duration-200 ease-out" />
                    <rect y="3" width="8" height="2" rx="1" className={`transform origin-center ${!expanded && 'rotate-90'} transition duration-200 ease-out`}  />
                </svg>
                {[titleAyah].map((ayah, index) => (
                    <Ayah key={index} ayahKey={ayah.id} ayah={ayah} lang={lang} />
                ))}

            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <p className="overflow-hidden">
                    {panelAyahs.map((ayah, index) => (
                        <Ayah key={index} ayahKey={ayah.id} ayah={ayah} lang={lang} />
                    ))}
                </p>
                
            </div>
        </div>
    );
}
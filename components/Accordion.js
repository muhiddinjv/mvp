function Accordion({ titleAyah, panelAyahs, lang, theme }) {
    const [expanded, setExpanded] = React.useState(false)

    return (
        <div className="divide-y mx-5">
            <div className="flex items-center ">
                <svg onClick={() => setExpanded(!expanded)} className="fill-indigo-500 shrink-0 cursor-pointer" width="10" height="10">
                    <rect y="4" width="10" height="2" rx="1" className="transform origin-center transition duration-200 ease-out" />
                    <rect y="4" width="10" height="2" rx="1" className={`transform origin-center ${!expanded && 'rotate-90'} transition duration-200 ease-out`}  />
                </svg>
                <span className="flex py-1 items-center" >
                    {[titleAyah].map((ayah, index) => <Ayah key={index} ayahKey={ayah.id} ayah={ayah} lang={lang}/>)}
                </span>
            </div>
            <div className={`grid transition-all duration-300 ease-in-out ${expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <p className="overflow-hidden ml-2">
                    {panelAyahs.map((ayah, index) => (
                        <Ayah key={index} ayahKey={ayah.id} ayah={ayah} lang={lang} theme={theme}/>
                    ))}
                </p>
            </div>
        </div>
    );
}
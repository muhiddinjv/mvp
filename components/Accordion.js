function Accordion({ titleAyah, panelAyahs, lang }) {
    const [expanded, setExpanded] = React.useState(false)

    return (
        <div className="mx-4">
            <div className="flex items-center ">
                <span className="text-indigo-500 cursor-pointer text-bold shrink-0" onClick={() => setExpanded(!expanded)}>{expanded ? <>&#65293;</> : <>&#65291;</>}</span>
                <span className="flex py-1 items-center ml-2" >
                    {[titleAyah].map((ayah, index) => <Ayah key={index} ayahKey={ayah.id} ayah={ayah} lang={lang}/>)}
                </span>
            </div>
            <div className={`grid transition-all duration-300 ease-in-out ${expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <p className={`overflow-hidden ml-[18px] ${expanded && 'border-b pb-2'}`}>
                    {panelAyahs.map((ayah, index) => (
                        <Ayah key={index} ayahKey={ayah.id} ayah={ayah} lang={lang}/>
                    ))}
                </p>
            </div>
        </div>
    );
}

//Muhiddin, [5/19/24 3:02 PM]
//➕➖
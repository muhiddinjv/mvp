import React from 'react';
import Ayah from './Ayah';

function Accordion({ titleAyah, panelAyahs, lang }) {
    const [expanded, setExpanded] = React.useState(false)

    return (
        <div className={`mx-4 flex ${expanded && 'border-y border-indigo-500 pb-1'}`}>
            <span className="text-indigo-500 cursor-pointer font-bold" onClick={() => setExpanded(!expanded)}>{expanded ? <>&#65293;</> : <>&#65291;</>}</span>
            <div>
                <span className="flex items-center ml-2" >
                    {[titleAyah].map((ayah, index) => <Ayah key={index} ayahKey={ayah.id} ayah={ayah} lang={lang}/>)}
                </span>
                <div className={`grid transition-all duration-300 ease-in-out ${expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden ml-2">
                        {panelAyahs.map((ayah, index) => (
                            <Ayah key={index} ayahKey={ayah.id} ayah={ayah} lang={lang}/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Accordion;
import React from 'react';
import Verse from './Verse';

function Accordion({ titleAyah, panelAyahs, lang }) {
    const [expanded, setExpanded] = React.useState(false);

    return (
        <div className={`mx-4 flex ${expanded && 'border-y border-indigo-500 pb-1'}`}>
            <span>
                <div className="text-indigo-500 text-xl cursor-pointer mt-2 border border-indigo-500 rounded-xl px-1" onClick={() => setExpanded(!expanded)}>{expanded ? <>&#65293;</> : <>&#65291;</>}</div>
            </span>
            <div>
                <span className="flex items-center ml-2" >
                    {[titleAyah].map((ayah, index) => <Verse key={index} ayah={ayah} lang={lang} setExpanded={setExpanded}/>)}
                </span>
                <div className={`grid transition-all duration-300 ease-in-out ${expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden ml-2">
                        {panelAyahs.map((ayah, index) => (
                            <Verse key={index} ayah={ayah} lang={lang} setExpanded={setExpanded}/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Accordion;
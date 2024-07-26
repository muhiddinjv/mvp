import React from 'react';
import Verse from './Verse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

function Accordion({ titleAyah, panelAyahs, lang }) {
    const [expanded, setExpanded] = React.useState(false);

    return (
        <div className={`mx-4 flex ${expanded && 'border-y pb-1'}`}>
            <span>
                <div className="flex items-center justify-center cursor-pointer mt-2 border border-gray-500 rounded size-7" onClick={() => setExpanded(!expanded)}>
                    <FontAwesomeIcon icon={expanded ? faMinus : faPlus} />
                </div>
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
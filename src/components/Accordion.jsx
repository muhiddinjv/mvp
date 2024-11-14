import React from 'react';
import Verse from './Verse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

function Accordion({ titleAyah, panelAyahs, lang }) {
    const [expanded, setExpanded] = React.useState(false);

    return (
        <div className={`mx-4 flex flex-row-reverse ${expanded && 'border-y pb-1'}`}>
            <span>
                <div className="flex items-center justify-center mt-2 mr-2 border border-gray-500 rounded cursor-pointer size-7" onClick={() => setExpanded(!expanded)}>
                    <FontAwesomeIcon icon={expanded ? faMinus : faPlus} />
                </div>
            </span>
            <div className="flex-grow">
                <span className="flex items-center justify-end mr-2" >
                    {[titleAyah].map((ayah, index) => <Verse key={index} ayah={ayah} lang={lang} setExpanded={setExpanded}/>)}
                </span>
                <div className={`grid transition-all duration-300 ease-in-out ${expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="mr-2 overflow-hidden">
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
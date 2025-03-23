import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import Verse from './Verse';

const Accordion = ({ ayahNumbers, versesData, selectedLanguage }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`mx-4 flex flex-row-reverse ${expanded ? 'border-y pb-1' : ''}`}>
      <div className={!expanded ? 'flex items-center justify-center mt-2 mr-2 text-lg border border-gray-500 rounded cursor-pointer size-7' : 'hidden'} onClick={() => setExpanded(!expanded)}>
        <FontAwesomeIcon icon={expanded ? faMinus : faPlus} />
      </div>
      <div className="flex-grow">
        {/* Render the first verse (usually the title verse) always visible */}
        {ayahNumbers.length > 0 && (
          <div className="flex items-center justify-end mr-2">
            <Verse ayahNumber={ayahNumbers[0]} ayah={versesData[ayahNumbers[0]]} selectedLanguage={selectedLanguage} />
          </div>
        )}
        {/* Render the rest of the verses within the collapsible panel */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${expanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
          {ayahNumbers.slice(1).map((ayahNum) => (
            <Verse key={ayahNum} ayahNumber={ayahNum} ayah={versesData[ayahNum]} selectedLanguage={selectedLanguage} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Accordion;

import React from 'react';
import { useParams } from 'react-router-dom';
import { useChapterData } from '../hooks';
import Verse from './Verse';

const Chapter = () => {
  const { chapterid } = useParams();
  const { selectedLanguage, setSelectedLanguage, ayahs, loading, languages } = useChapterData(chapterid);
  console.log({ayahs});

  if (loading) {
    return <p className="text-center text-gray-500">Loading translations...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg h-full">
      <h1 className="text-3xl font-bold text-center mb-4">Surah {chapterid}</h1>
      <div className="flex justify-center mb-4">
        <select
          className="p-2 border border-gray-300 rounded"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>
      {Object.entries(ayahs.data).map(([ayahNum, ayahData]) => (
        <Verse 
          key={ayahNum} 
          ayahNumber={ayahNum} 
          ayah={ayahData} 
          selectedLanguage={selectedLanguage} 
        />
      ))}
    </div>
  );
};

export default Chapter;

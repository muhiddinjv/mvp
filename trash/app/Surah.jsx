import React, { useState, useEffect } from "react";
import wordPos from "../../../public/json/temp/position.json";
import wordAr from "../../../public/json/temp/ar.json";
import languages from '../../public/json/temp/languages.json'
import { useParams } from "react-router-dom";

const SurahDisplay = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [translations, setTranslations] = useState({});
  const [loaded, setLoaded] = useState(false);
  const { chapterid } = useParams();

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const fetchedTranslations = {};
        
        for (const language of languages) {
          const res = await fetch(`/json/temp/${language}.json`);
          fetchedTranslations[language] = await res.json();
        }
        setTranslations(fetchedTranslations);
        setLoaded(true);
      } catch (error) {
        console.error("Error loading translations:", error);
      }
    };
  
    loadTranslations();
  }, []);

  if (!loaded) {
    return <p className="text-center text-gray-500">Loading translations...</p>;
  }

  const ayahs = {};
  Object.entries(wordPos).forEach(([key, { surah, ayah, position }]) => {
    if (surah !== Number(chapterid)) return;

    if (!ayahs[ayah]) {
      ayahs[ayah] = { arabic: [], translations: {} };
    }

    ayahs[ayah].arabic[position] = wordAr[key];

    Object.keys(translations).forEach((lang) => {
      if (!ayahs[ayah].translations[lang]) {
        ayahs[ayah].translations[lang] = [];
      }
      ayahs[ayah].translations[lang][position] = translations[lang][key];
    });
  });

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg h-full">
      <h1 className="text-3xl font-bold text-center mb-4">Surah {chapterid}</h1>

      <div className="flex justify-center mb-4">
        <select
          className="p-2 border border-gray-300 rounded"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          {Object.keys(translations).map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      {Object.entries(ayahs).map(([ayahNum, { arabic, translations }]) => (
        <div key={ayahNum} className="mb-6 text-center">
          {/* <p className="text-2xl font-arabic text-gray-800 mb-2">
            {arabic.join(" ")} ﴿{ayahNum}
          </p> */}
          <p className="text-lg text-gray-600 italic">
          {ayahNum} {translations[selectedLanguage]?.join(" ") || "Translation missing"}
          </p>
          <hr className="border-gray-300 my-4" />
        </div>
      ))}
    </div>
  );
};

export default SurahDisplay;

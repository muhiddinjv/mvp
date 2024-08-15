import React from "react";

const WordsTable = ({ data }) => {
  return (
    <div className="max-w-md mx-auto p-4 text-center overflow-auto">
      <h1 className="text-2xl font-bold mb-4">Vocabulary Table</h1>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 border border-gray-300">English</th>
            <th className="px-4 py-2 border border-gray-300">Read</th>
            <th className="px-4 py-2 border border-gray-300">Arabic</th>
            <th className="px-4 py-2 border border-gray-300">Emoji</th>
          </tr>
        </thead>
        <tbody>
          {data.map((word, index) => (
            <tr key={index}>
              <td className="px-4 py-2 border border-gray-300">{word.translation}</td>
              <td className="px-4 py-2 border border-gray-300">{word.transliteration}</td>
              <td className="px-4 py-2 border border-gray-300 text-4xl">{word.arabic}</td>
              <td className="px-4 py-2 border border-gray-300">{word.emoji}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WordsTable;

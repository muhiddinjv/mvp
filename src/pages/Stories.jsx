import React from 'react';

const Stories = () => {
  const theme = localStorage.getItem('theme');

  return (
    <div className={`${theme === "dark" ? "bg-gray-800 text-slate-300" : "bg-gray-100 text-slate-800" } min-h-screen w-full px-4 py-6`}>
        <div className=" p-4 rounded-lg border border-gray-500">
            Hello World
        </div>
    </div>
  );
};

export default Stories;
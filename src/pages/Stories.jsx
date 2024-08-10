import React from 'react';
import { Link } from 'react-router-dom';

const Stories = () => {
  const theme = localStorage.getItem('theme');

  return (
    <div className={`${theme === "dark" ? "bg-gray-800 text-slate-300" : "bg-gray-100 text-slate-800" } min-h-screen w-full px-4 py-6`}>
      <div className=" p-4 rounded-lg border border-gray-500">
        <div className='flex'>
          <Link to="/" className={`${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} hover:bg-gray-400 size-8 rounded flex items-center justify-center text-2xl mr-4`}>⌂</Link>
          <h2 className="text-2xl font-bold mb-2">Stories</h2>
        </div>
          Hello World
      </div>
    </div>
  );
};

export default Stories;
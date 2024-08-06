import { faArrowsRotate, faPlay } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as bookMarkOff } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';

const HowTo = () => {
  const theme = localStorage.getItem('theme');

  return (
    <div className={`${theme === "dark" ? "bg-gray-800 text-slate-300" : "bg-gray-100 text-slate-800" } min-h-screen w-full px-4 py-6`}>
      <div className=" p-4 rounded-lg border border-gray-500">
      <div className='flex'>
        <Link to="/" className={`${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} hover:bg-gray-400 size-8 rounded flex items-center justify-center text-2xl mr-4`}>⌂</Link>
        <h2 className="text-2xl font-bold mb-2">HOW TO MEMORIZE</h2>
      </div>
      <p className='mb-2'>Let's say you want to memorize, the ayah 64 from Surah 36 Ya-Sin. First, set the language to English because through experiments, I found that its easy to remember the Arabic words by looking at their English translation. By doing so, you can learn Arabic through English. Then...</p>
      <ol className="list-decimal list-inside mb-4">
        <li className='mb-4'>
          <strong>Repeat</strong> - Tap / click the repeat <FontAwesomeIcon icon={faArrowsRotate} /> button and it does it's magic like this:
          <ol className="list-decimal list-inside ml-6 mb-2">
            <li>it plays the 1st word 1 time, and then...</li>
            <li>it plays the 1st & 2nd words 2 times, and then...</li>
            <li>it plays the 1st, 2nd and 3rd words 3 times, and so on...</li>
          </ol>
          <p className='mb-2'>The number of repetitions increases depending the number of words because the more words there are in an ayah, the harder it is to memorize it.</p>
          <p>If you double-tap on a <span className='border'>word</span> and tap the repeat <FontAwesomeIcon icon={faArrowsRotate} /> button, it plays all the words upto this word only once and start repeating from this word onwards.</p>
        </li>
        <li className='mb-4'>
          <strong>Review</strong> - Once you have listened through all the words at least once, start reviewing:
          <ol className="list-decimal list-inside ml-6">
            <li>Repeat the Arabic translation of each English word / phrase in your head.</li>
            <li>If you can't remember, tap / click on the word / phrase to hear its Arabic translation.</li>
          </ol>
        </li>
        <li className='mb-4'>
          <strong>Refine</strong> - When you are able to recite all the words without looking at the ayah, tap the play <FontAwesomeIcon icon={faPlay} /> button and recite along with the audio to fine-tune your pronunciation. The audio keeps replaying until it reaches 10 reps but you can stop it at any time.
        </li>
        <li>
          <strong>Bookmark</strong> - You can bookmark <FontAwesomeIcon icon={bookMarkOff} /> the ayahs you are memorizing to revisit them later.
        </li>
      </ol>

      <h3 className="text-xl font-bold mb-2">HOW TO REVIEW</h3>

      <p className='mb-2'>You can review the surahs you've memorized in 3 ways by tapping <span className='border rounded p-1'>ထ</span> button to limit the number of words in every ayah to:</p>

      <ol className="list-decimal list-inside">
        <li><strong>Easy</strong> - 7 or 5 words.</li>
        <li><strong>Normal</strong> - 3 words.</li>
        <li><strong>Hard</strong> - 1 word while keeping all the accordions (+) closed.</li>
      </ol>
    </div>
    </div>
  );
};

export default HowTo;
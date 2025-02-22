import React, { useState, useEffect } from 'react';

const SpeechRecognition = () => {
  const [spokenTexts, setSpokenTexts] = useState([]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Only listen once per click
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    const handleResult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSpokenTexts(prevTexts => [...prevTexts, transcript]); // Add new speech to the list
    };

    const handleError = (event) => {
      console.error('Recognition error:', event.error);
    };

    recognition.onresult = handleResult;
    recognition.onerror = handleError;
    recognition.onspeechend = () => recognition.stop();

    const handleClick = () => {
      recognition.start(); // Start listening on click
    };

    document.body.addEventListener('click', handleClick);

    return () => {
      document.body.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="text-xl text-gray-800 mb-4">
        Click anywhere and say something...
      </div>
      <ul className="text-lg text-gray-700 space-y-2">
        {spokenTexts.map((text, index) => (
          <li key={index} className="p-2 bg-white shadow rounded">
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpeechRecognition;

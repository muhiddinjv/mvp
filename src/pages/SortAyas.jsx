import React, { useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';

import { GlobalContext } from '../main';
import { useAyahs, useFontSize, useTheme, useChunkNavigation } from '../hooks';
import { increaseSessionStreak, markDailyStreakCompleted, shuffleArray } from '../utils/streaks';
import { markSortCompleted } from '../components/SortLock';

import { BtnsHeader, Loading, SortableItem } from '../components';

const CHUNK_SIZE = 10;

const SortAyas = () => {
  const { suraid } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme('dark');
  const { fontSize, enlargeFont } = useFontSize(16);
  const { ayahs, loading } = useAyahs('ayahs', suraid);
  const { language, changeLanguage } = useContext(GlobalContext);

  const [items, setItems] = useState([]);
  const [correctOrder, setCorrectOrder] = useState([]);
  const [currentChunk, setCurrentChunk] = useState(0);
  const [checkResults, setCheckResults] = useState(null);
  const [isDragDisabled, setIsDragDisabled] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: { delay: 250, tolerance: 5 }
  }));

  const { totalChunks, getChunk } = useChunkNavigation(items, CHUNK_SIZE, currentChunk);
  const currentItems = useMemo(() => getChunk(), [getChunk]);
  const correctChunk = useMemo(() => correctOrder.slice(currentChunk * CHUNK_SIZE, (currentChunk + 1) * CHUNK_SIZE), [correctOrder, currentChunk]);

  useEffect(() => {
    if (!ayahs?.verses || !ayahs.verses.length) return;

    const verses = ayahs.verses;
    setCorrectOrder(verses);

    const saved = JSON.parse(localStorage.getItem('dnd_order') || 'null');
    if (saved && Array.isArray(saved) && saved.length === verses.length) {
      setItems(saved);
    } else {
      const shuffled = verses.reduce((acc, _, i) => {
        if (i % CHUNK_SIZE === 0) {
          const chunk = verses.slice(i, i + CHUNK_SIZE);
          acc.push(...shuffleArray(chunk));
        }
        return acc;
      }, []);
      setItems(shuffled);
      localStorage.setItem('dnd_order', JSON.stringify(shuffled));
    }
  }, [ayahs]);

  const handleDragEnd = useCallback(({ active, over }) => {
    if (!over || active.id === over.id || isDragDisabled) return;

    const oldIndex = currentItems.findIndex(i => i.id === active.id);
    const newIndex = currentItems.findIndex(i => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(currentItems, oldIndex, newIndex);
    const newItems = [...items];
    reordered.forEach((item, i) => newItems[currentChunk * CHUNK_SIZE + i] = item);

    setItems(newItems);
    setCheckResults(null);
    localStorage.setItem('dnd_order', JSON.stringify(newItems));
  }, [currentItems, items, currentChunk, isDragDisabled]);

  const handleCheck = useCallback(() => {
    const results = currentItems.map((item, idx) => item.id === correctChunk[idx]?.id);
    setCheckResults(results);

    const isAllCorrect = results.every(Boolean);
    if (isAllCorrect) {
      if (currentChunk < totalChunks - 1) {
        setCurrentChunk(c => c + 1);
        setCheckResults(null);
      } else {
        setIsDragDisabled(true);
        new Audio('/aud/sound/treasure.mp3').play();
        increaseSessionStreak();
        markDailyStreakCompleted();
        markSortCompleted(suraid); // Mark this surah as completed for sorting
        setTimeout(() => navigate('/', { state: { streakUpdated: true } }), 2000);
      }
    }
  }, [currentItems, correctChunk, currentChunk, totalChunks, navigate]);

  const handleReset = useCallback(() => {
    const shuffled = shuffleArray(correctChunk);
    const newItems = [...items];
    shuffled.forEach((item, i) => newItems[currentChunk * CHUNK_SIZE + i] = item);
    setItems(newItems);
    setCheckResults(null);
    localStorage.setItem('dnd_order', JSON.stringify(newItems));
  }, [correctChunk, currentChunk, items]);

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-800 text-slate-300' : 'bg-gray-100 text-black'} p-4 flex flex-col items-center min-h-screen relative`}>
      <BtnsHeader
        theme={theme}
        changeLanguage={changeLanguage}
        language={language}
        fontSize={fontSize}
        enlargeFont={enlargeFont}
      />

      <h1 className="m-4 text-xl font-bold">
        {suraid} {ayahs[language] || 'None'}
      </h1>

      <div className="flex gap-4 items-center mb-4">
        <button
          onClick={() => setCurrentChunk(c => c - 1)}
          disabled={currentChunk === 0}
          className="px-4 py-2 font-semibold text-white bg-blue-600 rounded shadow hover:bg-blue-700 disabled:bg-gray-400"
        >
          Prev
        </button>
        <span className="text-lg font-semibold">
          Part {currentChunk + 1} of {totalChunks}
        </span>
        <button
          onClick={() => setCurrentChunk(c => c + 1)}
          disabled={
            currentChunk >= totalChunks - 1 ||
            !checkResults?.every(r => r)
          }
          className="px-4 py-2 font-semibold text-white bg-blue-600 rounded shadow hover:bg-blue-700 disabled:bg-gray-400"
        >
          Next
        </button>
      </div>

      <div className="flex overflow-auto flex-1 justify-center pb-32 w-full">
        {loading ? (
          <Loading />
        ) : (
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
            <SortableContext items={currentItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col items-center">
                {currentItems.map((ayah, i) => (
                  <SortableItem
                    key={ayah.id}
                    id={ayah.id}
                    fontSize={fontSize}
                    text={ayah[language] || 'translation not found'}
                    isCorrect={checkResults?.[i] ?? null}
                    disabled={isDragDisabled}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <div className="flex fixed bottom-0 left-0 gap-4 justify-center py-2 w-full bg-gray-800">
        <button
          onClick={handleCheck}
          className="px-6 py-2 font-semibold text-white bg-green-600 rounded shadow hover:bg-green-700"
          disabled={isDragDisabled}
        >
          Check
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 font-semibold text-white bg-red-600 rounded shadow hover:bg-red-700"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default SortAyas;

import React, { useContext, useEffect, useState } from 'react';
import { useAyahs, useFontSize, useTheme } from '../hooks';
import { useParams, useNavigate } from 'react-router-dom';
import { BtnsHeader, Loading } from '../components';
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GlobalContext } from '../main';
import { increaseSessionStreak, markDailyStreakCompleted } from '../utils/streaks';

const SortableItem = ({ id, text, isCorrect, disabled, fontSize }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'default' : 'grab',
    touchAction: disabled ? 'auto' : 'none',
    fontSize
  };

  return (
    <div
      ref={setNodeRef}
      {...(disabled ? {} : { ...attributes, ...listeners })}
      style={style}
      className={`w-full max-w-sm p-3 m-2 rounded shadow text-center text-lg border-2
        ${
          isCorrect === true
            ? 'border-green-500'
            : isCorrect === false
            ? 'border-red-500'
            : 'border-gray-300'
        }
        bg-white dark:bg-gray-700 dark:text-white`}
    >
      {text}
    </div>
  );
};

const SortAyas = () => {
  const { suraid } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme('dark');
  const { fontSize, enlargeFont } = useFontSize(16);
  const { ayahs, loading } = useAyahs('ayahs',suraid);
  const { language, changeLanguage } = useContext(GlobalContext);

  const [correctOrder, setCorrectOrder] = useState([]);
  const [items, setItems] = useState([]);
  const [checkResults, setCheckResults] = useState(null);
  const [isDragDisabled, setIsDragDisabled] = useState(false);  

  useEffect(() => {
    if (!ayahs?.verses || !ayahs.verses.length) return;

    setCorrectOrder(ayahs.verses);

    const saved = JSON.parse(localStorage.getItem('dnd_order') || 'null');
    if (saved && Array.isArray(saved) && saved.length === ayahs.verses.length) {
      setItems(saved);
    } else {
      const shuffled = [...ayahs.verses]
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(obj => obj.value);

      setItems(shuffled);
      localStorage.setItem('dnd_order', JSON.stringify(shuffled));
    }
  }, [ayahs]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 250, // ms before drag starts
        tolerance: 5, // pixels movement before drag starts
      },
    })
  );

  const handleDragEnd = (event) => {
    if (isDragDisabled) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex(item => item.id === active.id);
    const newIndex = items.findIndex(item => item.id === over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);

    setItems(newItems);
    setCheckResults(null);
    localStorage.setItem('dnd_order', JSON.stringify(newItems));
  };

  const handleCheck = () => {
    const results = items.map((item, index) => item.id === correctOrder[index]?.id);
    setCheckResults(results);

    const isAllCorrect = results.every(r => r);
    localStorage.setItem('dnd_done', isAllCorrect ? 'true' : 'false');

    if (isAllCorrect) {
      setIsDragDisabled(true);
      const audio = new Audio('/aud/sound/treasure.mp3');
      audio.play();
      increaseSessionStreak();
      markDailyStreakCompleted();
      setTimeout(() => navigate('/',{ state: { streakUpdated: true }}), 2000);
    }
  };

  const handleReset = () => {
    const shuffled = [...correctOrder]
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(obj => obj.value);

    setItems(shuffled);
    setCheckResults(null);
    setIsDragDisabled(false);
    localStorage.setItem('dnd_order', JSON.stringify(shuffled));
    localStorage.setItem('dnd_done', 'false');
  };

  return (
    <div
      className={`${
        theme === 'dark' ? 'bg-gray-800 text-slate-300' : 'bg-gray-100 text-black'
      } p-4 flex flex-col items-center min-h-screen relative`}
    >
      <BtnsHeader
        theme={theme}
        changeLanguage={changeLanguage}
        language={language}
        fontSize={fontSize}
        enlargeFont={enlargeFont}
      />
  
      <h1 className="text-xl font-bold m-4">
        Sort the Verses for {ayahs[language] || 'None'}
      </h1>
  
      <div className="w-full flex-1 overflow-auto pb-32 flex justify-center">
        {loading ? (
          <Loading />
        ) : (
          <DndContext 
            collisionDetection={closestCenter} 
            onDragEnd={handleDragEnd}
            sensors={sensors}
          >
            <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col items-center">
                {items.map((ayah, index) => (
                  <SortableItem
                    key={ayah.id}
                    id={ayah.id}
                    fontSize={fontSize}
                    text={ayah[language] || 'translation not found'}
                    isCorrect={checkResults ? checkResults[index] : null}
                    disabled={isDragDisabled}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
  
      <div className="fixed bottom-0 left-0 w-full bg-gray-800 py-2 flex justify-center gap-4">
        <button
          onClick={handleCheck}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded shadow"
          disabled={isDragDisabled}
        >
          Check
        </button>
        <button
          onClick={handleReset}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded shadow"
        >
          Reset
        </button>
      </div>
    </div>
  );
  
};

export default SortAyas;

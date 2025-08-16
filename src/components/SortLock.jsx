import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUpDownLeftRight } from '@fortawesome/free-solid-svg-icons';

const STORAGE_KEYS = {
  COMPLETED_SURAHS: 'completed_sort_surahs',
  LOCK_DATE: 'sort_lock_date'
};

const getTodayStr = () => moment().format('YYYY-MM-DD');

const shouldResetLocks = () => {
  const lastLockDate = localStorage.getItem(STORAGE_KEYS.LOCK_DATE);
  const today = getTodayStr();
  
  if (!lastLockDate || lastLockDate !== today) {
    localStorage.setItem(STORAGE_KEYS.LOCK_DATE, today);
    return true;
  }
  return false;
};

const getCompletedSortSurahs = () => {
  if (shouldResetLocks()) {
    localStorage.removeItem(STORAGE_KEYS.COMPLETED_SURAHS);
    return new Set();
  }
  
  const completed = localStorage.getItem(STORAGE_KEYS.COMPLETED_SURAHS);
  if (!completed) return new Set();
  
  try {
    const parsed = JSON.parse(completed);
    return new Set(parsed);
  } catch (error) {
    console.error('Error parsing completed sort surahs:', error);
    return new Set();
  }
};

export const markSortCompleted = (surahId) => {
  const completed = getCompletedSortSurahs();
  completed.add(String(surahId));
  
  localStorage.setItem(STORAGE_KEYS.COMPLETED_SURAHS, JSON.stringify([...completed]));
};

export const isSortLocked = (surahId) => {
  const completed = getCompletedSortSurahs();
  return completed.has(String(surahId));
};

export const clearCompletedSortSurahs = () => {
  localStorage.removeItem(STORAGE_KEYS.COMPLETED_SURAHS);
  localStorage.removeItem(STORAGE_KEYS.LOCK_DATE);
};

export const SortLockIcon = ({ surahId }) => {
  const isLocked = isSortLocked(surahId);
  
  if (isLocked) {
    return (
      <div 
        className="w-full relative max-w-12 border-l border-gray-500 p-2 flex flex-col justify-center items-center opacity-50 cursor-not-allowed"
        title="Sort completed today. Unlocks at midnight."
      >
        <FontAwesomeIcon icon={faUpDownLeftRight}/>
      </div>
    );
  }
  
  return (
    <Link 
      to={`/dnd/${surahId}`}
      className="w-full relative max-w-12 border-l border-gray-500 p-2 flex justify-center items-center cursor-pointer hover:bg-gray-600 transition-colors"
      title="Sort verses"
    >
      <FontAwesomeIcon icon={faUpDownLeftRight}/>
    </Link>
  );
}; 
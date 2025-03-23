// src/db.js
import Dexie from 'dexie';

const dexiedb = new Dexie('FlashcardApp');
dexiedb.version(1).stores({
  decks: '++id, name',
  cards: '++id, front, back, interval, repetition, easeFactor, nextReviewDate, deckId',
  progress: '++id, reviewedCards, streak',
  settings: '++id, key, value',
});

export default dexiedb;

// src/db.js
import Dexie from 'dexie';

const db = new Dexie('FlashcardApp');
db.version(1).stores({
  decks: '++id, name',
  cards: '++id, front, back, interval, repetition, easeFactor, nextReviewDate, deckId',
  progress: '++id, reviewedCards, streak',
  settings: '++id, key, value',
});

export default db;

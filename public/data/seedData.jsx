import dexiedb from './dexiedb';

const seedData = async () => {
  // Check if the decks already exist
  const existingDeck1 = await dexiedb.decks.where('name').equals('Greetings').first();
  const existingDeck2 = await dexiedb.decks.where('name').equals('Common Phrases').first();

  // If decks already exist, return early to prevent duplicates
  if (existingDeck1 && existingDeck2) {
    console.log('Decks already exist. Skipping seeding.');
    return;
  }

  // Add Deck 1 if it doesn't exist
  let deckId1;
  if (!existingDeck1) {
    deckId1 = await dexiedb.decks.add({ name: 'Greetings' });

    const deck1Cards = [
      { front: 'مرحبا', back: 'Hello', deckId: deckId1, interval: 0, repetition: 0, easeFactor: 2.5, nextReviewDate: null },
      { front: 'وداعا', back: 'Goodbye', deckId: deckId1, interval: 0, repetition: 0, easeFactor: 2.5, nextReviewDate: null },
      { front: 'شكرا', back: 'Thank you', deckId: deckId1, interval: 0, repetition: 0, easeFactor: 2.5, nextReviewDate: null },
      { front: 'نعم', back: 'Yes', deckId: deckId1, interval: 0, repetition: 0, easeFactor: 2.5, nextReviewDate: null },
      { front: 'لا', back: 'No', deckId: deckId1, interval: 0, repetition: 0, easeFactor: 2.5, nextReviewDate: null },
      { front: 'من فضلك', back: 'Please', deckId: deckId1, interval: 0, repetition: 0, easeFactor: 2.5, nextReviewDate: null },
      { front: 'صباح الخير', back: 'Good morning', deckId: deckId1, interval: 0, repetition: 0, easeFactor: 2.5, nextReviewDate: null },
      { front: 'مساء الخير', back: 'Good evening', deckId: deckId1, interval: 0, repetition: 0, easeFactor: 2.5, nextReviewDate: null },
      { front: 'تصبح على خير', back: 'Good night', deckId: deckId1, interval: 0, repetition: 0, easeFactor: 2.5, nextReviewDate: null },
      { front: 'كيف حالك؟', back: 'How are you?', deckId: deckId1, interval: 0, repetition: 0, easeFactor: 2.5, nextReviewDate: null }
    ];
    
    await dexiedb.cards.bulkAdd(deck1Cards);
  }

  // Add Deck 2 if it doesn't exist
  let deckId2;
  if (!existingDeck2) {
    deckId2 = await dexiedb.decks.add({ name: 'Common Phrases' });

    const deck2Cards = [
      { front: 'ما اسمك؟', back: 'What is your name?', deckId: deckId2, interval: 0, repetition: 0, easeFactor: 2.5, nextReviewDate: null },
      { front: 'أين أنت؟', back: 'Where are you?', deckId: deckId2, interval: 0, repetition: 0, easeFactor: 2.5, nextReviewDate: null },
      { front: 'كم عمرك؟', back: 'How old are you?', deckId: deckId2, interval: 0, repetition: 0, easeFactor: 2.5, nextReviewDate: null },
      { front: 'من أين أنت؟', back: 'Where are you from?', deckId: deckId2, interval: 0, repetition: 0, easeFactor: 2.5, nextReviewDate: null },
      { front: 'ما هو الوقت؟', back: 'What time is it?', deckId: deckId2, interval: 0, repetition: 0, easeFactor: 2.5, nextReviewDate: null },
      { front: 'هل يمكنك مساعدتي؟', back: 'Can you help me?', deckId: deckId2, interval: 0, repetition: 0, easeFactor: 2.5, nextReviewDate: null },
      { front: 'أين الحمام؟', back: 'Where is the bathroom?', deckId: deckId2, interval: 0, repetition: 0, easeFactor: 2.5, nextReviewDate: null },
      { front: 'كم الثمن؟', back: 'How much does it cost?', deckId: deckId2, interval: 0, repetition: 0, easeFactor: 2.5, nextReviewDate: null },
      { front: 'هل تتحدث الإنجليزية؟', back: 'Do you speak English?', deckId: deckId2, interval: 0, repetition: 0, easeFactor: 2.5, nextReviewDate: null },
      { front: 'أنا جائع', back: 'I am hungry', deckId: deckId2, interval: 0, repetition: 0, easeFactor: 2.5, nextReviewDate: null }
    ];

    await dexiedb.cards.bulkAdd(deck2Cards);
  }

  console.log('Sample decks and cards added');
};

export default seedData;

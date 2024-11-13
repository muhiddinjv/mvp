import React, { useEffect, useState } from "react";
import Card from "./Card";
import db from "../../db";

// src/spacedRepetition.js
function calculateNextReview(card, difficulty) {
  let { interval, repetition, easeFactor } = card;

  if (difficulty === "again") {
    repetition = 0;
    interval = 1;
  } else if (difficulty === "hard") {
    easeFactor = Math.max(1.3, easeFactor - 0.15);
    interval = interval * 1.2;
  } else if (difficulty === "good") {
    repetition += 1;
    interval = interval * easeFactor;
  } else if (difficulty === "easy") {
    repetition += 1;
    easeFactor += 0.15;
    interval = interval * easeFactor * 1.3;
  }

  return {
    ...card,
    interval: Math.round(interval),
    repetition,
    easeFactor,
    nextReviewDate: new Date(Date.now() + interval * 24 * 60 * 60 * 1000),
  };
}

function Review({ deck, setDecks }) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cardQueue, setCardQueue] = useState(deck.cards);

  useEffect(() => {
    setCardQueue(deck.cards);
  }, [deck]);

  // If deck or deck.cards is undefined, return early to avoid errors
  if (!deck || !deck.cards || deck.cards.length === 0) {
    return <div>No cards available for review.</div>;
  }

  const handleReview = async (difficulty) => {
    const currentCard = cardQueue[currentCardIndex];
    const updatedCard = calculateNextReview(currentCard, difficulty);

    // Update the card in the database
    await db.cards.put(updatedCard);

    // Update the deck and card queue
    let updatedQueue = [...cardQueue];

    updatedQueue[currentCardIndex] = updatedCard;
    setCurrentCardIndex(currentCardIndex + 1);

    // Update the deck state
    const updatedDeck = {
      ...deck,
      cards: updatedQueue,
    };
    setDecks((decks) => decks.map((d) => (d.id === deck.id ? updatedDeck : d)));
  };

  if (currentCardIndex >= cardQueue.length) {
    return <div>Review Complete!</div>;
  }

  const currentCard = cardQueue[currentCardIndex];

  return (
    <div className="flex flex-col items-center">
      <Card front={currentCard.front} back={currentCard.back} />
      <div className="mt-4 space-x-3">
        <button className="px-4 py-2 text-white rounded bg-slate-500" onClick={() => handleReview("again")}>Again</button>
        <button className="px-4 py-2 text-white bg-red-500 rounded" onClick={() => handleReview("hard")}>Hard</button>
        <button className="px-4 py-2 text-white bg-yellow-500 rounded" onClick={() => handleReview("good")}>Good</button>
        <button className="px-4 py-2 text-white bg-green-500 rounded" onClick={() => handleReview("easy")}>Easy</button>
      </div>
    </div>
  );
}

export default Review;


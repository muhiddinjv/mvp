import React, { useState, useEffect } from "react";
import Review from "./Review";
import seedData from "../../db/seedData";
import db from "../../db";
import Streaks from "./Streaks";
import SpeechRecognition from "./SpeechRecognition";

function Main() {
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);

  useEffect(() => {
    fetchDecks();
  }, []);

  const fetchDecks = async () => {
    await seedData();
    // Fetch all decks
    const allDecks = await db.decks.toArray();

    // Fetch cards for each deck and attach them
    const decksWithCards = await Promise.all(
      allDecks.map(async (deck) => {
        const cards = await db.cards.where("deckId").equals(deck.id).toArray();
        return { ...deck, cards };
      })
    );

    setDecks(decksWithCards);

    // Automatically select the first deck for review
    if (decksWithCards.length > 0) {
      setSelectedDeck(decksWithCards[0]);
    }
  };

  return (
    <div className="text-center dark:text-gray-100 p-4">
      {selectedDeck ? (
        <>
          <Streaks />
          <Review deck={selectedDeck} setDecks={setDecks} />
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default Main;

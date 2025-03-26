import React, { useState, useEffect } from "react";
import { Rating, State, generatorParameters, fsrs } from "ts-fsrs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { useParams, Link } from "react-router-dom";
import Speech from "react-text-to-speech";
import moment from "moment";

import { useAyahs, useLanguage, useTheme } from "../hooks";
import Button from "../components/Button";
import { voiceText, uiLang } from "../data";
import Loading from "../components/Loading";

// ---------- Card Storage and Scheduler ----------
const CardStorage = {
  loadCards: (words, chapterId) => {
    const storedCards = localStorage.getItem(`cards_${chapterId}`);
    if (storedCards) {
      return JSON.parse(storedCards);
    }
    return words.map(card => ({
      ...card,
      due: moment().valueOf(),
      difficulty: 0,
      elapsed_days: 0,
      lapses: 0,
      last_review: null,
      reps: 0,
      scheduled_days: 0,
      stability: 0,
      state: State.New
    }));
  },
  saveCards: (cards, chapterId) => {
    localStorage.setItem(`cards_${chapterId}`, JSON.stringify(cards));
  },
};

const Scheduler = {
  f: fsrs(generatorParameters({ initial_stability: 0.5 })),
  scheduleCard: (card, rating) => {
    const reviewDate = moment();
    const schedulingResults = Scheduler.f.repeat(card, reviewDate.toDate());
    const { difficulty, due, elapsed_days, reps, scheduled_days, stability, state } = schedulingResults[rating].card;
    return {
      ...card,
      due,
      difficulty,
      elapsed_days,
      lapses: rating === Rating.Again ? card.lapses + 1 : card.lapses,
      last_review: reviewDate.valueOf(),
      reps: reps + 1,
      scheduled_days,
      stability,
      state,
    };
  },
  getNextReviewInterval: (card, rating) => {
    const reviewDate = moment();
    const schedulingResults = Scheduler.f.repeat(card, reviewDate.toDate());
    const result = schedulingResults[rating];
    const diffMs = moment(result.card.due).diff(reviewDate);
    return Scheduler.formatInterval(diffMs);
  },
  formatInterval: (ms) => {
    const duration = moment.duration(ms);
    if (duration.asYears() >= 1) return `${Math.floor(duration.asYears())}y`;
    if (duration.asMonths() >= 1) return `${Math.floor(duration.asMonths())}mo`;
    if (duration.asWeeks() >= 1) return `${Math.floor(duration.asWeeks())}w`;
    if (duration.asDays() >= 1) return `${Math.floor(duration.asDays())}d`;
    if (duration.asHours() >= 1) return `${Math.floor(duration.asHours())}h`;
    if (duration.asMinutes() >= 1) return `${Math.floor(duration.asMinutes())}m`;
    return `${Math.floor(duration.asSeconds())}s`;
  },
};

const Skeleton = () => {
  return (
    <div className="w-11/12 mt-4 rounded-lg loading-skeleton aspect-square"/>
  );
};

// ---------- getUniqueWords Function ----------
const getUniqueWords = (surahData, learnedWords = new Set()) => {
  let words = [];
  let idCounter = 1;
  
  Object.entries(surahData).forEach(([ayahKey, ayah]) => {
    if (ayah.w && Array.isArray(ayah.w)) {
      ayah.w.forEach((word) => {
        if (word.ar && !learnedWords.has(word.ar)) {
          learnedWords.add(word.ar);
          words.push({
            id: idCounter++,
            text: {
              ar: word.ar,
              en: word.en || "",
              tr: word.tr || "",
              ru: word.ru || "",
              aud: word.p || ""
            },
            image: "/img/book.png",
          });
        }
      });
    } else {
      console.warn(`Skipping Ayah ${ayahKey}: no words found.`);
    }
  });
  
  return words;
};

// ---------- StatusBar and StatusBadge Components ----------
const StatusBar = ({ cards }) => {
  const { ankiLanguage, changeAnkiLanguage } = useLanguage();
  const { newWord, learning, review } = uiLang.words;
  const now = moment();
  const newCount = cards?.filter(card => card.state === State.New).length || 0;
  const learningCount = cards?.filter(card => (card.state === State.Learning || card.state === State.Relearning) && moment(card.due).isSameOrBefore(now)).length || 0;
  const reviewCount = cards?.filter(card => card.state === State.Review && moment(card.due).isSameOrBefore(now)).length || 0;
  return (
    <div className="flex justify-between gap-2 mb-2">
      <Link to="/" className="text-2xl">
        <FontAwesomeIcon icon={faHome} />
      </Link>
      <StatusBadge label={newWord[ankiLanguage]} count={newCount} color="blue" title="New cards to learn today" />
      <StatusBadge label={learning[ankiLanguage]} count={learningCount} color="red" title="Cards currently being learned" />
      <StatusBadge label={review[ankiLanguage]} count={reviewCount} color="green" title="Learned cards due for review" />
      <Button onClick={changeAnkiLanguage} text={ankiLanguage} />
    </div>
  );
};

const StatusBadge = ({ label, count, color, title }) => {
  return (
    <span className={`bg-${color}-500 text-white py-1 px-3 rounded-full`} title={title}>
      {label}: {count}
    </span>
  );
};

const GradeButton = ({ bgColor, rating, children, handleClick, interval, tip }) => {
  return (
    <button
      onClick={() => handleClick(rating)}
      className={`${bgColor} text-white py-2 px-4 rounded`}
      title={tip}
      aria-label={tip}
    >
      {interval} {children}
    </button>
  );
};

const GradeButtons = ({ handleGrade, intervals }) => {
  const { again, hard, good, easy } = uiLang.words;
  const { ankiLanguage } = useLanguage();
  return (
    <div className="flex justify-center w-full gap-2">
      <GradeButton bgColor="bg-red-500" rating={Rating.Again} handleClick={handleGrade} interval={intervals[Rating.Again]} tip="Your answer was completely incorrect.">
        {again[ankiLanguage]}
      </GradeButton>
      <GradeButton bgColor="bg-yellow-500" rating={Rating.Hard} handleClick={handleGrade} interval={intervals[Rating.Hard]} tip="Your answer was partially correct, and/or you hesitated a lot.">
        {hard[ankiLanguage]}
      </GradeButton>
      <GradeButton bgColor="bg-green-500" rating={Rating.Good} handleClick={handleGrade} interval={intervals[Rating.Good]} tip="You answered correctly with a little bit of hesitation.">
        {good[ankiLanguage]}
      </GradeButton>
      <GradeButton bgColor="bg-blue-500" rating={Rating.Easy} handleClick={handleGrade} interval={intervals[Rating.Easy]} tip="You answered correctly with no hesitation.">
        {easy[ankiLanguage]}
      </GradeButton>
    </div>
  );
};

const ReviewComplete = ({ nextReviewDate }) => {
  const { ankiLanguage } = useLanguage();
  return (
    <div className="my-6">
      <div className="text-2xl font-semibold text-center text-green-600">
        {uiLang.words.complete[ankiLanguage]}
      </div>
      <div className="pt-2 text-center">
        {uiLang.words.next[ankiLanguage]}:{" "}
        {nextReviewDate 
          ? moment(nextReviewDate).format("HH:mm:ss, MMM Do YYYY")
          : "No upcoming reviews"}
      </div>
    </div>
  );
};

const CardReview = ({ currentCard, showAnswer, setShowAnswer, handleGrade, intervals }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { ankiLanguage } = useLanguage();
  
  return (
    <div className="flex flex-col justify-between w-full h-full p-4">
      <div>
        <div className="flex items-center justify-center text-xl font-semibold">
          <Speech
            text={currentCard.text.ar}
            voiceURI={voiceText.ar.voiceURI}
            lang={voiceText.ar.lang}
            rate={1.0}
            stopBtn={false}
          />
          <span className="ml-2 text-4xl font-semibold">{currentCard.text.ar}</span>
        </div>
        {showAnswer && (
          <div className="flex flex-col items-center">
            {!imageLoaded && !imageError && <Skeleton />}
            {currentCard.image && !imageError && (
              <img 
                src={currentCard.image}
                alt={currentCard.text[ankiLanguage]}
                className={`bg-gray-200 mt-4 w-96 aspect-square rounded-lg ${!imageLoaded ? "hidden" : ""}`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            )}
            {imageError && (
              <div className="mt-4 text-center text-red-500">Image failed to load</div>
            )}
            <div className="mt-4 text-lg text-center">{currentCard.text[ankiLanguage]}</div>
          </div>
        )}
      </div>
      <div className="flex justify-center mt-4">
        {!showAnswer ? (
          <button onClick={() => setShowAnswer(true)} className="px-4 py-2 text-white bg-blue-500 rounded">
            {uiLang.words.answer[ankiLanguage]}
          </button>
        ) : (
          <GradeButtons handleGrade={handleGrade} intervals={intervals} />
        )}
      </div>
    </div>
  );
};

const AnkiPage = () => {
  const { suraid } = useParams(); // The surah ID from the URL (e.g., "114")
  const { ayahs } = useAyahs(suraid);
  const { theme } = useTheme("dark");
  const [words, setWords] = useState([]);
  const [cards, setCards] = useState([]);
  const [nextReviewDate, setNextReviewDate] = useState(null);
  const [reviewComplete, setReviewComplete] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);
  const [loading, setLoading] = useState(true);

  // Retrieve learned words from localStorage or initialize an empty set.
  const getLearnedWords = () => {
    const stored = localStorage.getItem("learnedWords");
    return stored ? new Set(JSON.parse(stored)) : new Set();
  };
  const saveLearnedWords = (learnedSet) => {
    localStorage.setItem("learnedWords", JSON.stringify(Array.from(learnedSet)));
  };

  // Generate unique words for the current surah using the learnedWords set.
  useEffect(() => {
    if (ayahs && Object.keys(ayahs).length > 0) {
      const learnedWords = getLearnedWords();
      const generatedWords = getUniqueWords(ayahs, learnedWords);
      setWords(generatedWords);
    }
  }, [ayahs]);

  // Load or create cards once words are ready.
  useEffect(() => {
    if (words.length > 0) {
      const storedCards = CardStorage.loadCards(words, suraid);
      setCards(storedCards);
      setLoading(false);
    }
  }, [words, suraid]);

  // Save cards and check review status, storing due date as Unix epoch timestamp.
  console.log(loading);
  useEffect(() => {
    if (!loading) {
      CardStorage.saveCards(cards, suraid);
  
      // 1) Sort all cards by earliest due
      const sortedByDue = [...cards].sort((a, b) => moment(a.due).diff(moment(b.due)));
      const earliestDue = sortedByDue[0]?.due || null;
      const now = moment();
  
      // 2) Cards that are currently/past due
      const dueCards = sortedByDue.filter(
        (card) => card.state === State.New || moment(card.due).isSameOrBefore(now)
      );
  
      // If we have no currently due cards => nextReview = earliestDue
      if (dueCards.length === 0) {
        // Surah is complete *for now*
        setReviewComplete(true);
        setCurrentCard(null);
        setNextReviewDate(earliestDue); // Could be in the future or null if no cards exist
  
        // Unlock the next surah, etc...
        const current = Number(suraid);
        const prevUnlocked = Number(localStorage.getItem("lowestUnlockedSurah")) || 114;
        const nextUnlock = current - 1;
        if (nextUnlock < prevUnlocked) {
          localStorage.setItem("lowestUnlockedSurah", nextUnlock);
        }
  
        // Save learned words
        const learned = getLearnedWords();
        words.forEach(word => learned.add(word.text.ar));
        saveLearnedWords(learned);
  
      } else {
        // We still have cards to review
        setReviewComplete(false);
        setNextReviewDate(null);
        setCurrentCard(dueCards[0]);
      }
    }
  }, [cards, loading, suraid, words]);
  

  const handleGrade = (rating) => {
    if (!currentCard) return;
    const updatedCard = Scheduler.scheduleCard(currentCard, rating);
    const updatedCards = cards.map(card =>
      card.id === updatedCard.id ? updatedCard : card
    );
    setCards(updatedCards);
    setShowAnswer(false);
  };

  // Compute grade intervals for the current card.
  const intervals = currentCard ? {
    [Rating.Again]: Scheduler.getNextReviewInterval(currentCard, Rating.Again),
    [Rating.Hard]: Scheduler.getNextReviewInterval(currentCard, Rating.Hard),
    [Rating.Good]: Scheduler.getNextReviewInterval(currentCard, Rating.Good),
    [Rating.Easy]: Scheduler.getNextReviewInterval(currentCard, Rating.Easy),
  } : {};

  return (
    <div className={`${theme === "dark" ? "bg-gray-800 text-slate-300" : "bg-gray-100 text-slate-800"} flex flex-col items-center h-full py-4`}>
      <StatusBar cards={cards} />
      {reviewComplete ? (
        <ReviewComplete nextReviewDate={nextReviewDate} />
      ) : currentCard ? (
        <CardReview
          currentCard={currentCard}
          showAnswer={showAnswer}
          setShowAnswer={setShowAnswer}
          handleGrade={handleGrade}
          intervals={intervals}
        />
      ) : (
        <Loading/>
      )}
    </div>
  );
};

export default AnkiPage;
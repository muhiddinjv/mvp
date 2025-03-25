import { useState, useEffect } from "react";
import { Rating, State, generatorParameters, fsrs } from "ts-fsrs";
import { faHome } from '@fortawesome/free-solid-svg-icons';
import Speech from "react-text-to-speech";
import moment from "moment";

import { voiceText, uiLang } from "../data";
import { useAyahs, useLanguage, useTheme } from "../hooks";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../components/Button";

const CardStorage = {
  loadCards: (words, chapterId) => {
    const storedCards = localStorage.getItem(`cards_${chapterId}`);
    if (storedCards) {
      const parsedCards = JSON.parse(storedCards);
      console.log("Loaded cards from local storage:", parsedCards);
      return parsedCards;
    }
    console.log("No stored cards found, generating new cards.");
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
    console.log("Saving cards to local storage:", cards);
    localStorage.setItem(`cards_${chapterId}`, JSON.stringify(cards));
  },
};

const Scheduler = {
  f: fsrs(generatorParameters({ initial_stability: 0.5 })),

  scheduleCard: (card, rating) => {
    const reviewDate = moment();
    const schedulingResults = Scheduler.f.repeat(card, reviewDate.toDate());
    const {difficulty, due, elapsed_days, reps, scheduled_days, stability, state} = schedulingResults[rating].card;

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

function Skeleton() {
  return (
    <div className="w-11/12 mt-4 rounded-lg loading-skeleton aspect-square"/>
  );
}

function getUniqueWords(surahData) {
  let words = [];
  let idCounter = 1;
  let uniqueWords = new Set();

  Object.entries(surahData).forEach(([ayahKey, ayah]) => {
    if (ayah.w && Array.isArray(ayah.w)) {
      ayah.w.forEach((word) => {
        if (word.ar && !uniqueWords.has(word.ar)) {
          uniqueWords.add(word.ar);
          words.push({
            id: idCounter++,
            text: {
              ar: word.ar,
              en: word.en || "",
              tr: word.tr || "",
              ru: word.ru || "",
            },
            image: "/img/book.png",
          });
        }
      });
    }
  });

  return words;
}

const StatusBar = ({ cards }) => {
  const { ankiLanguage, changeAnkiLanguage } = useLanguage();

  const { newWord, learning, review } = uiLang.words;

  const now = moment();

  // New: Cards never studied (state === 0)
  const newCount = cards?.filter(card => 
    card.state === State.New
  ).length;

  // Learning: Cards in learning/relearning state AND due today
  const learningCount = cards?.filter(card => 
    (card.state === State.Learning || card.state === State.Relearning) &&
    moment(card.due).isSameOrBefore(now)
  ).length;

  // Review: Graduated cards that are due today
  const reviewCount = cards?.filter(card => 
    card.state === State.Review &&
    moment(card.due).isSameOrBefore(now)
  ).length;

  return (
    <div className="flex justify-between gap-2 mb-2">
      <Link to="/" className="size-8 rounded flex items-center justify-center text-2xl">
        <FontAwesomeIcon icon={faHome} />
      </Link>
      <StatusBadge label={newWord[ankiLanguage]} count={newCount} color="blue" title="New cards to learn today"/>
      <StatusBadge label={learning[ankiLanguage]} count={learningCount} color="red" title="Cards currently being learned"/>
      <StatusBadge label={review[ankiLanguage]} count={reviewCount} color="green" title="Learned cards due for review"/>
      <Button 
        onClick={changeAnkiLanguage} 
        text={ankiLanguage} 
      />
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

const GradeButton = ({
  bgColor,
  rating,
  children,
  handleClick,
  interval,
  tip,
}) => {
  const buttonClass = `${bgColor} text-white py-2 px-4 rounded`;
  
  return (
    <button
      onClick={() => handleClick(rating)}
      className={buttonClass}
      title={tip}
      aria-label={tip}
    >
     {interval} {children} 
    </button>
  );
};

const ReviewComplete = ({ nextReviewDate }) => {
  const { language } = useLanguage();

  return (
    <div className="my-6">
      <div className="text-2xl font-semibold text-center text-green-600">
        {uiLang.words.complete[language]}
      </div>
      <div className="pt-2 text-center">
        {uiLang.words.next[language]}: {nextReviewDate ? moment(nextReviewDate).format('HH:mm:ss, MMM Do YYYY') : 'No upcoming reviews'}
      </div>
    </div>
  )
};

const CardReview = ({
  currentCard,
  showAnswer,
  setShowAnswer,
  handleGrade,
  intervals,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { ankiLanguage, changeLanguage } = useLanguage();

  return (
    <div className="flex flex-col justify-between w-full h-full p-4">
      <div>
        <div className="flex items-center justify-center text-xl font-semibold">
          <Speech
            text={currentCard.text['ar']}
            voiceURI={voiceText['ar'].voiceURI}
            lang={voiceText['ar'].lang}
            rate={1.0}
            stopBtn={false}
          /> {/* CARD FRONT */}
          <span className="ml-2 text-4xl font-semibold">{currentCard.text['ar']}</span>
        </div>
        {showAnswer && (
          <div className="flex flex-col items-center">
            {!imageLoaded && !imageError && <Skeleton />}

            {currentCard.image && !imageError && (
              <img 
                src={currentCard.image}
                alt={currentCard.text[ankiLanguage]}
                className={`bg-gray-200 mt-4 text-center text-gray-700 w-96 aspect-square rounded-lg ${!imageLoaded && "hidden"}`}
                onLoad={()=>setImageLoaded(true)}
                onError={()=>setImageError(true)}
              />
            )}

            {imageError && (
              <div className="mt-4 text-center text-red-500">Image failed to load</div>
            )}

            <div className="mt-4 text-lg text-center">
              {currentCard.text[ankiLanguage]}
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-center mt-4">
        {!showAnswer ? (
          <button
            onClick={() => setShowAnswer(true)}
            className="px-4 py-2 text-white bg-blue-500 rounded"
          >
            {uiLang.words.answer[ankiLanguage]}
          </button>
        ) : (
          <GradeButtons handleGrade={handleGrade} intervals={intervals} />
        )}
      </div>
    </div>
  );
};

const GradeButtons = ({ handleGrade, intervals }) => {
  const { again, hard, good, easy } = uiLang.words;
  const { ankiLanguage } = useLanguage();

  return (
    <div className="flex justify-center w-full gap-2">
      <GradeButton
        bgColor="bg-red-500"
        rating={Rating.Again}
        handleClick={handleGrade}
        interval={intervals[Rating.Again]}
        tip="Your answer was completely incorrect."
      >
        {again[ankiLanguage]}
      </GradeButton>
      <GradeButton
        bgColor="bg-yellow-500"
        rating={Rating.Hard}
        handleClick={handleGrade}
        interval={intervals[Rating.Hard]}
        tip="Your answer was partially correct, and/or you hesitated a lot."
      >
        {hard[ankiLanguage]}
      </GradeButton>
      <GradeButton
        bgColor="bg-green-500"
        rating={Rating.Good}
        handleClick={handleGrade}
        interval={intervals[Rating.Good]}
        tip="You answered correctly with a little bit of hesitation."
      >
        {good[ankiLanguage]}
      </GradeButton>
      <GradeButton
        bgColor="bg-blue-500"
        rating={Rating.Easy}
        handleClick={handleGrade}
        interval={intervals[Rating.Easy]}
        tip="You answered correctly with no hesitation."
      >
        {easy[ankiLanguage]}
      </GradeButton>
    </div>
  )
};

const AnkiPage = () => {
  const [reviewComplete, setReviewComplete] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [words, setWords] = useState([]);
  const [cards, setCards] = useState([]);

  const { suraid } = useParams();
  const { ayahs } = useAyahs(suraid);
  const { theme } = useTheme("dark");

  useEffect(() => {
    if (ayahs && Object.keys(ayahs).length > 0) {
      const generatedWords = getUniqueWords(ayahs);
      setWords(generatedWords);
    }
  }, [ayahs]);

  const getDueCards = (cards) => {
    const now = moment();
    return cards
      ?.filter((card) => card.state === State.New || moment(card.due).isSameOrBefore(now))
      ?.sort((a, b) => moment(a.due).diff(moment(b.due)));
  };

  const getAllCardsSortedByDueDate = (cards) => {
    return cards?.sort((a, b) => moment(a.due).diff(moment(b.due)));
  };

  useEffect(() => {
    if (words.length > 0) {
      const storedCards = CardStorage.loadCards(words, suraid);
      setCards(storedCards);
      setLoading(false);
    }
  }, [words, suraid]);

  useEffect(() => {
    if (!loading) {
      CardStorage.saveCards(cards, suraid);
      const dueCards = getDueCards(cards);
      if (dueCards?.length === 0) {
        setReviewComplete(true);
        setCurrentCard(null);
      } else {
        setReviewComplete(false);
        setCurrentCard(dueCards[0]);
      }
    }
  }, [cards, loading, suraid]);

  const handleGrade = (rating) => {
    if (!currentCard) return;

    const updatedCard = Scheduler.scheduleCard(currentCard, rating);
    const updatedCards = cards.map((card) =>
      card.id === updatedCard.id ? updatedCard : card
    );

    setCards(updatedCards);
    setShowAnswer(false);
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  const allCardsSorted = getAllCardsSortedByDueDate(cards);
  const nextReviewDate = allCardsSorted?.length > 0 ? moment(allCardsSorted[0].due).valueOf() : null;

  const intervals = currentCard
    ? {
        [Rating.Again]: Scheduler.getNextReviewInterval(currentCard, Rating.Again),
        [Rating.Hard]: Scheduler.getNextReviewInterval(currentCard, Rating.Hard),
        [Rating.Good]: Scheduler.getNextReviewInterval(currentCard, Rating.Good),
        [Rating.Easy]: Scheduler.getNextReviewInterval(currentCard, Rating.Easy),
      }
    : {};

  return (
    <div className={`${theme === "dark" ? "bg-gray-800 text-slate-300" : "bg-gray-100 text-slate-800"} flex flex-col items-center h-full py-4`}>
      <StatusBar cards={cards} />
      {reviewComplete && cards.length > 0 ? (
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
        <div className="text-center">Loading...</div>
      )}
    </div>
  );
};

export default AnkiPage;
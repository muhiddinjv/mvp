import { useState, useEffect, useContext } from "react";
import { Rating, State, generatorParameters, fsrs } from "ts-fsrs";
import { faHome } from '@fortawesome/free-solid-svg-icons';
import Speech from "react-text-to-speech";
import moment from "moment";

import { voiceText, uiLang } from "../data";
import { useLanguage, useTheme } from "../hooks";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../components/Button";
import { Loading } from "../components";
import { CardStorage, GlobalContext } from "../main";

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

const ReviewComplete = ({ earliestDue }) => {
  const { language } = useLanguage();

  return (
    <div className="my-6">
      <div className="text-2xl font-semibold text-center text-green-600">
        {uiLang.words.complete[language]}
      </div>
      <div className="pt-2 text-center">
        {uiLang.words.next[language]}: {earliestDue ? moment(earliestDue).format('HH:mm:ss, MMM Do YYYY') : 'No upcoming reviews'}
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
  const { ankiLanguage } = useLanguage();

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

            {currentCard.img && !imageError && (
              <img 
                src={currentCard.img}
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
  const { chapterId, words } = useContext(GlobalContext);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewComplete, setReviewComplete] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const { suraid } = useParams();
  const { theme } = useTheme("dark");

  useEffect(() => {
    if (words[chapterId]) {
      const storedCards = CardStorage.loadCards(words[chapterId], chapterId);
      setCards(storedCards);
      setLoading(false);
    }
  }, [words, chapterId]);

  useEffect(() => {
    if (!loading) {
      CardStorage.saveCards(cards, chapterId);
      const dueCards = getDueCards(cards);
      if (dueCards?.length === 0) {
        setReviewComplete(true);
        setCurrentCard(null);
      } else {
        setReviewComplete(false);
        setCurrentCard(dueCards[0]);
      }
    }
  }, [cards, loading, chapterId]);

  const getDueCards = (cards) => {
    const now = moment();
    return cards
      ?.filter((card) => card.state === State.New || moment(card.due).isSameOrBefore(now))
      ?.sort((a, b) => moment(a.due).diff(moment(b.due)));
  };

  const handleGrade = (rating) => {
    if (!currentCard) return;

    const updatedCard = Scheduler.scheduleCard(currentCard, rating);
    const updatedCards = cards.map((card) =>
      card.id === updatedCard.id ? updatedCard : card
    );

    setCards(updatedCards);
    setCurrentCard(updatedCard);
    setShowAnswer(false);

    CardStorage.saveCards(updatedCards, chapterId);
  };

  const sortedByDue = cards?.sort((a, b) => moment(a.due).diff(moment(b.due)));
  const earliestDue = sortedByDue?.length > 0 ? moment(sortedByDue[0].due).valueOf() : null;

  const intervals = currentCard
    ? {
        [Rating.Again]: Scheduler.getNextReviewInterval(currentCard, Rating.Again),
        [Rating.Hard]: Scheduler.getNextReviewInterval(currentCard, Rating.Hard),
        [Rating.Good]: Scheduler.getNextReviewInterval(currentCard, Rating.Good),
        [Rating.Easy]: Scheduler.getNextReviewInterval(currentCard, Rating.Easy),
      }
    : {};

  useEffect(() => {
    if (reviewComplete && suraid) {
      const currentSura = Number(suraid);
      const lowestUnlocked = Number(localStorage.getItem("lowestUnlockedSurah")) || 114;
      // Only update if the current chapter is the locked one and not the very first chapter.
      if (currentSura === lowestUnlocked && currentSura > 1) {
        localStorage.setItem("lowestUnlockedSurah", currentSura - 1);
      }
    }
  }, [reviewComplete, suraid]);

  return (
    <div className={`${theme === "dark" ? "bg-gray-800 text-slate-300" : "bg-gray-100 text-slate-800"} flex flex-col items-center h-full py-4`}>
      <StatusBar cards={cards} />
      {reviewComplete && cards.length > 0 ? (
        <ReviewComplete earliestDue={earliestDue} />
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
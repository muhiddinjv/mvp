import { useState, useEffect } from 'react';

const Streaks = ({ onStreakUpdate }) => {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const lastReviewDate = localStorage.getItem('lastReviewDate');
    const today = new Date().toLocaleDateString();

    if (lastReviewDate === today) {
      return;
    }

    if (lastReviewDate && new Date(today) - new Date(lastReviewDate) === 1) {
      setStreak(streak + 1);
      onStreakUpdate(streak + 1);
    } else {
      setStreak(1);
    }

    localStorage.setItem('lastReviewDate', today);
  }, []);

  return (
    <div className="m-4 text-gray-100">
      <h2 className="text-xl">Streak: {streak} days</h2>
    </div>
  );
};

export default Streaks;

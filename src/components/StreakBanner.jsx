// components/StreakBanner.jsx

import { useEffect, useState } from "react";
import { getDailyStreak, getSessionStreak } from "../utils/streaks";

export default function StreakBanner() {
  const [daily, setDaily] = useState(0);
  const [session, setSession] = useState(0);

  useEffect(() => {
    setDaily(getDailyStreak());
    setSession(getSessionStreak());
  }, []);

  return (
    <div className="flex justify-between items-center px-4 py-2 mb-2 border border-gray-500 rounded">
      <div className="flex items-center space-x-2">
        <span className="text-yellow-400 text-xl">🔥</span>
        <span>Streak: <strong>{daily}</strong> days</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-green-400 text-xl">⚡</span>
        <span>Session: <strong>{session}</strong></span>
      </div>
    </div>
  );
}

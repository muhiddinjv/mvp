export function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

// 🔁 Session Streak Logic
export function getSessionStreak() {
  const today = getTodayStr();
  const saved = JSON.parse(localStorage.getItem("session_meta")) || {
    date: today,
    count: 0,
  };

  if (saved.date !== today) {
    saved.count = 0;
    saved.date = today;
    localStorage.setItem("session_meta", JSON.stringify(saved));
  }

  return saved.count;
}

export function increaseSessionStreak() {
  const today = getTodayStr();
  const saved = JSON.parse(localStorage.getItem("session_meta")) || {
    date: today,
    count: 0,
  };

  if (saved.date !== today) {
    saved.count = 0;
    saved.date = today;
  }

  saved.count += 1;
  localStorage.setItem("session_meta", JSON.stringify(saved));
}

// 🔥 Daily Streak Logic
export function getDailyStreak() {
  const saved = JSON.parse(localStorage.getItem("daily_streak")) || {
    count: 0,
    lastDate: null,
  };
  return saved.count;
}

export function markDailyStreakCompleted() {
  const today = getTodayStr();
  const saved = JSON.parse(localStorage.getItem("daily_streak")) || {
    count: 0,
    lastDate: null,
  };

  if (saved.lastDate === today) return; // already counted today

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yestStr = yesterday.toISOString().slice(0, 10);

  const newCount = saved.lastDate === yestStr ? saved.count + 1 : 1;

  localStorage.setItem(
    "daily_streak",
    JSON.stringify({
      count: newCount,
      lastDate: today,
    })
  );

  // 💾 Save in review history
  const history = JSON.parse(localStorage.getItem("review_history") || "{}");
  history[today] = (history[today] || 0) + 1;
  localStorage.setItem("review_history", JSON.stringify(history));
}

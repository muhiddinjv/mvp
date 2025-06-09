export function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

function getYesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

// 🔁 Session Streak Logic (resets only if you skip a day)
export function getSessionStreak() {
  const today = getTodayStr();
  const yesterday = getYesterdayStr();

  const saved = JSON.parse(localStorage.getItem("session_meta")) || {
    date: null,
    count: 0,
  };

  // Reset only if last session was not yesterday or today
  if (saved.date !== today && saved.date !== yesterday) {
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

  const yesterday = getYesterdayStr();

  const newCount = saved.lastDate === yesterday ? saved.count + 1 : 1;

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

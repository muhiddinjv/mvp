import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { useEffect, useState } from 'react';

export default function ReviewCalendar() {
  const [values, setValues] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("quranim_review_history") || "{}");
    const parsed = Object.entries(saved).map(([date, count]) => ({ date, count }));
    setValues(parsed);
  }, []);

  return (
    <div className="my-6 p-4 bg-slate-900 rounded-xl text-white shadow">
      <h2 className="text-lg font-semibold mb-2">Your Review Activity</h2>
      <CalendarHeatmap
        startDate={new Date(new Date().setMonth(new Date().getMonth() - 3))}
        endDate={new Date()}
        values={values}
        classForValue={(val) => {
          if (!val || val.count === 0) return "color-empty";
          if (val.count === 1) return "color-scale-1";
          if (val.count === 2) return "color-scale-2";
          return "color-scale-3";
        }}
        tooltipDataAttrs={val => ({
          'data-tip': `${val.date}: ${val.count} review${val.count > 1 ? 's' : ''}`
        })}
        showWeekdayLabels
      />
    </div>
  );
}

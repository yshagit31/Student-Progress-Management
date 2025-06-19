import React from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, subDays } from 'date-fns';

function HeatMap({ data, days = 90, className = '' }) {
  const endDate = new Date();
  const startDate = subDays(endDate, days - 1);
  
  const weeks = [];
  let currentWeekStart = startOfWeek(startDate);
  
  while (currentWeekStart <= endDate) {
    const weekEnd = endOfWeek(currentWeekStart);
    const weekDays = eachDayOfInterval({
      start: currentWeekStart,
      end: weekEnd > endDate ? endDate : weekEnd
    });
    weeks.push(weekDays);
    currentWeekStart = new Date(currentWeekStart);
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
  }

  const getIntensity = (count) => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (count <= 2) return 'bg-green-200 dark:bg-green-900';
    if (count <= 4) return 'bg-green-300 dark:bg-green-700';
    if (count <= 6) return 'bg-green-400 dark:bg-green-600';
    return 'bg-green-500 dark:bg-green-500';
  };

  const maxSubmissions = Math.max(...Object.values(data));

  return (
    <div className={`p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Submission Activity (Last {days} days)
        </h4>
        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
          <span>Less</span>
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800"></div>
            <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900"></div>
            <div className="w-3 h-3 rounded-sm bg-green-300 dark:bg-green-700"></div>
            <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-600"></div>
            <div className="w-3 h-3 rounded-sm bg-green-500 dark:bg-green-500"></div>
          </div>
          <span>More</span>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-xs">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-gray-500 dark:text-gray-400 p-1">
            {day}
          </div>
        ))}
      </div>
      
      <div className="mt-2 space-y-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {[0, 1, 2, 3, 4, 5, 6].map(dayIndex => {
              const day = week[dayIndex];
              if (!day) {
                return <div key={dayIndex} className="w-3 h-3"></div>;
              }
              
              const dateStr = format(day, 'yyyy-MM-dd');
              const count = data[dateStr] || 0;
              
              return (
                <div
                  key={dayIndex}
                  className={`w-3 h-3 rounded-sm ${getIntensity(count)} 
                            hover:ring-2 hover:ring-blue-500 hover:ring-opacity-50 cursor-pointer`}
                  title={`${format(day, 'MMM dd, yyyy')}: ${count} submissions`}
                />
              );
            })}
          </div>
        ))}
      </div>

      {maxSubmissions > 0 && (
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Peak activity: {maxSubmissions} submissions in a day
          </p>
        </div>
      )}
    </div>
  );
}

export default HeatMap;
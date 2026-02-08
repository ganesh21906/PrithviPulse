import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export const MiniCalendarWidget: React.FC = () => {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  }, [currentDate]);

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  // Highlight upcoming task dates (mock)
  const taskDates = [8, 15, 22];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-4 shadow-blue border border-blue-100 card-hover">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <Calendar size={16} className="text-blue-600" />
          Upcoming
        </h3>
        <div className="flex gap-1">
          <button
            onClick={handlePrevMonth}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            <ChevronLeft size={16} className="text-gray-600" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            <ChevronRight size={16} className="text-gray-600" />
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-600 font-semibold mb-3">{monthName}</p>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
          <div key={day} className="text-center text-[10px] font-bold text-gray-500 py-1">
            {day}
          </div>
        ))}

        {monthDays.map((day, idx) => {
          const isTaskDate = day && taskDates.includes(day);
          const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();

          return (
            <div
              key={idx}
              className={`text-center py-1.5 text-xs rounded font-semibold transition-colors ${
                !day
                  ? 'text-gray-200'
                  : isToday
                  ? 'bg-blue-600 text-white'
                  : isTaskDate
                  ? 'bg-green-100 text-green-700 ring-1 ring-green-300'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Task List */}
      <div className="space-y-2 pt-3 border-t border-blue-200">
        <div className="flex items-start gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-gray-800">Fertilizer</p>
            <p className="text-gray-600">in 5 days</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-gray-800">Pruning</p>
            <p className="text-gray-600">in 12 days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

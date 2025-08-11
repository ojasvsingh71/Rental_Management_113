import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { useStore } from '../../hooks/useStore';
import clsx from 'clsx';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'booking' | 'delivery' | 'return';
  productId: string;
}

export function AvailabilityCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { products } = useStore();

  // Mock events - in real app, these would come from bookings
  const events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Camera Kit - Sarah Johnson',
      date: new Date(2024, 2, 15),
      type: 'booking',
      productId: '1',
    },
    {
      id: '2',
      title: 'DJ Controller - Mike Chen',
      date: new Date(2024, 2, 18),
      type: 'delivery',
      productId: '2',
    },
    {
      id: '3',
      title: 'Lighting Kit Return',
      date: new Date(2024, 2, 22),
      type: 'return',
      productId: '3',
    },
  ];

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const getEventColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'booking':
        return 'bg-blue-100 text-blue-800';
      case 'delivery':
        return 'bg-emerald-100 text-emerald-800';
      case 'return':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600 mt-1">Manage bookings and availability</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Plus className="h-4 w-4" />
          <span>New Booking</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-6">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const dayEvents = getEventsForDate(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={day.toString()}
                  onClick={() => setSelectedDate(day)}
                  className={clsx(
                    'min-h-24 p-2 border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors',
                    isSelected && 'bg-blue-50 border-blue-200',
                    !isSameMonth(day, currentDate) && 'text-gray-400'
                  )}
                >
                  <div className={clsx(
                    'text-sm font-medium mb-1',
                    isToday && 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center',
                    isSelected && !isToday && 'text-blue-600'
                  )}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className={clsx(
                          'px-2 py-1 rounded text-xs font-medium truncate',
                          getEventColor(event.type)
                        )}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500 px-2">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-blue-100 border border-blue-200"></div>
            <span className="text-sm text-gray-600">Bookings</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-emerald-100 border border-emerald-200"></div>
            <span className="text-sm text-gray-600">Deliveries</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-amber-100 border border-amber-200"></div>
            <span className="text-sm text-gray-600">Returns</span>
          </div>
        </div>
      </div>
    </div>
  );
}
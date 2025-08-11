import React from 'react';
import { Calendar, TrendingUp } from 'lucide-react';

export function AvailabilityChart() {
  // Mock data for the chart
  const weekData = [
    { day: 'Mon', available: 85, booked: 15 },
    { day: 'Tue', available: 72, booked: 28 },
    { day: 'Wed', available: 90, booked: 10 },
    { day: 'Thu', available: 65, booked: 35 },
    { day: 'Fri', available: 45, booked: 55 },
    { day: 'Sat', available: 30, booked: 70 },
    { day: 'Sun', available: 80, booked: 20 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Weekly Availability</h3>
        <div className="flex items-center space-x-2 text-emerald-600">
          <TrendingUp className="h-4 w-4" />
          <span className="text-sm font-medium">+5.2%</span>
        </div>
      </div>

      <div className="space-y-4">
        {weekData.map((day) => (
          <div key={day.day} className="flex items-center space-x-4">
            <div className="w-12 text-sm font-medium text-gray-600">{day.day}</div>
            <div className="flex-1 flex rounded-full overflow-hidden bg-gray-200 h-3">
              <div 
                className="bg-emerald-500 transition-all duration-300" 
                style={{ width: `${day.available}%` }}
              />
              <div 
                className="bg-blue-500 transition-all duration-300" 
                style={{ width: `${day.booked}%` }}
              />
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-gray-600">{day.available}% available</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-gray-600">{day.booked}% booked</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>This week's performance</span>
          </div>
          <div className="font-medium text-gray-900">68% average utilization</div>
        </div>
      </div>
    </div>
  );
}
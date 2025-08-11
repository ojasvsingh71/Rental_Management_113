import React, { useEffect, useState } from "react";
import CalendarView from "../../components/customer/CalendarView";
import { CalendarEvent } from "../../types/customer";

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/event", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setEvents(data.events || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load calendar events");
        setLoading(false);
      });
  }, []);

  const handleEventClick = (event: CalendarEvent) => {
    console.log("Event clicked:", event);
    // Handle event click (e.g., show event details modal)
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Calendar Events</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : events.length === 0 ? (
        <div>No events found.</div>
      ) : (
        <CalendarView events={events} onEventClick={handleEventClick} />
      )}
    </div>
  );
};

export default Calendar;

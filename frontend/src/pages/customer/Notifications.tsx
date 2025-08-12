import React from "react";
import { Bell, CheckCircle, XCircle, Info } from "lucide-react";

const notifications = [
  { id: 1, type: "success", message: "Your order #1234 was delivered!", date: "2025-08-10" },
  { id: 2, type: "error", message: "Payment failed for order #1235.", date: "2025-08-11" },
  { id: 3, type: "info", message: "New products added to your favorite category.", date: "2025-08-12" },
];

const getIcon = (type: string) => {
  switch(type) {
    case "success": return <CheckCircle className="text-green-500" />;
    case "error": return <XCircle className="text-red-500" />;
    default: return <Info className="text-blue-500" />;
  }
};

const Notifications: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3">
        <Bell className="text-blue-600" size={28} />
        Notifications
      </h2>
      <ul className="space-y-5">
        {notifications.map((n) => (
          <li
            key={n.id}
            className="flex items-center gap-4 bg-white p-5 rounded-xl shadow hover:shadow-lg transition-shadow"
            aria-live="polite"
          >
            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-50">
              {getIcon(n.type)}
            </div>
            <div>
              <p className="font-medium text-gray-900">{n.message}</p>
              <time className="text-sm text-gray-500" dateTime={n.date}>
                {new Date(n.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Mail,
  Smartphone,
  Calendar
} from 'lucide-react';
import { useRental, Order } from '../context/RentalContext';

interface Notification {
  id: string;
  type: 'reminder' | 'overdue' | 'confirmation' | 'warning';
  title: string;
  message: string;
  timestamp: string;
  orderId?: string;
  read: boolean;
}

export function NotificationSystem() {
  const { orders } = useRental();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    emailEnabled: true,
    smsEnabled: false,
    reminderDays: 3,
    overdueEnabled: true
  });

  useEffect(() => {
    generateNotifications();
  }, [orders, notificationSettings.reminderDays]);

  const generateNotifications = () => {
    const now = new Date();
    const newNotifications: Notification[] = [];

    orders.forEach(order => {
      // Return reminders
      if (order.returnScheduled && order.status === 'delivered') {
        const returnDate = new Date(order.returnScheduled);
        const daysUntilReturn = Math.ceil((returnDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilReturn <= notificationSettings.reminderDays && daysUntilReturn > 0) {
          newNotifications.push({
            id: `reminder-${order.id}`,
            type: 'reminder',
            title: 'Return Reminder',
            message: `Order #${order.id} is due for return in ${daysUntilReturn} day(s)`,
            timestamp: now.toISOString(),
            orderId: order.id,
            read: false
          });
        }

        // Overdue notifications
        if (daysUntilReturn < 0 && notificationSettings.overdueEnabled) {
          const daysOverdue = Math.abs(daysUntilReturn);
          newNotifications.push({
            id: `overdue-${order.id}`,
            type: 'overdue',
            title: 'Overdue Return',
            message: `Order #${order.id} is ${daysOverdue} day(s) overdue. Late fees may apply.`,
            timestamp: now.toISOString(),
            orderId: order.id,
            read: false
          });
        }
      }

      // Pickup reminders
      if (order.pickupScheduled && order.status === 'confirmed') {
        const pickupDate = new Date(order.pickupScheduled);
        const daysUntilPickup = Math.ceil((pickupDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilPickup <= 1 && daysUntilPickup >= 0) {
          newNotifications.push({
            id: `pickup-${order.id}`,
            type: 'reminder',
            title: 'Pickup Reminder',
            message: `Order #${order.id} is scheduled for pickup ${daysUntilPickup === 0 ? 'today' : 'tomorrow'}`,
            timestamp: now.toISOString(),
            orderId: order.id,
            read: false
          });
        }
      }
    });

    setNotifications(prev => {
      const existingIds = prev.map(n => n.id);
      const uniqueNew = newNotifications.filter(n => !existingIds.includes(n.id));
      return [...prev, ...uniqueNew].slice(0, 50); // Limit to 50 notifications
    });
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'overdue':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'confirmation':
        return <CheckCircle className="h-5 w-5 text-emerald-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'reminder':
        return 'bg-blue-50 border-blue-200';
      case 'overdue':
        return 'bg-red-50 border-red-200';
      case 'confirmation':
        return 'bg-emerald-50 border-emerald-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      {/* Notification Bell Button */}
      <button
        onClick={() => setShowPanel(true)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {showPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Notifications ({unreadCount} new)
                </h2>
                <button
                  onClick={() => setShowPanel(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800 mt-2"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-96">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className={`text-sm font-medium ${
                              !notification.read ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h4>
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="text-gray-400 hover:text-gray-600 ml-2"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(notification.timestamp).toLocaleString()}
                          </p>
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="p-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Notification Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-600 mr-2" />
                    <span className="text-sm text-gray-700">Email Notifications</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.emailEnabled}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      emailEnabled: e.target.checked
                    })}
                    className="rounded border-gray-300"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Smartphone className="h-4 w-4 text-gray-600 mr-2" />
                    <span className="text-sm text-gray-700">SMS Notifications</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.smsEnabled}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      smsEnabled: e.target.checked
                    })}
                    className="rounded border-gray-300"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-600 mr-2" />
                    <span className="text-sm text-gray-700">Reminder Days</span>
                  </div>
                  <select
                    value={notificationSettings.reminderDays}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      reminderDays: parseInt(e.target.value)
                    })}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value={1}>1 day</option>
                    <option value={3}>3 days</option>
                    <option value={7}>7 days</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
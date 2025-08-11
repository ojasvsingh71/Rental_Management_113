import React, { useState } from 'react';
import { Bell, Mail, MessageSquare, Smartphone, Save } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import clsx from 'clsx';

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    returnReminder: {
      enabled: true,
      leadTimeDays: 3,
      channels: ['email', 'portal'],
      customerEnabled: true,
      staffEnabled: true,
    },
    overdueAlert: {
      enabled: true,
      leadTimeDays: 1,
      channels: ['email', 'sms'],
      customerEnabled: true,
      staffEnabled: true,
    },
    paymentDue: {
      enabled: true,
      leadTimeDays: 2,
      channels: ['email', 'portal'],
      customerEnabled: true,
      staffEnabled: false,
    },
    deliveryUpdate: {
      enabled: true,
      leadTimeDays: 0,
      channels: ['email', 'sms', 'push'],
      customerEnabled: true,
      staffEnabled: true,
    },
  });

  const [penaltyRules, setPenaltyRules] = useState([
    {
      id: '1',
      name: 'Late Return Fee',
      type: 'late_return',
      calculation: 'daily',
      amount: 25,
      gracePeriodHours: 2,
      maxAmount: 200,
      isActive: true,
    },
    {
      id: '2',
      name: 'Damage Fee',
      type: 'damage',
      calculation: 'percentage',
      amount: 50,
      gracePeriodHours: 0,
      isActive: true,
    },
  ]);

  const handleSettingChange = (category: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const handleChannelToggle = (category: string, channel: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        channels: prev[category].channels.includes(channel)
          ? prev[category].channels.filter(c => c !== channel)
          : [...prev[category].channels, channel],
      },
    }));
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4" />;
      case 'push':
        return <Smartphone className="h-4 w-4" />;
      case 'portal':
        return <Bell className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notification Settings</h1>
          <p className="text-gray-600 mt-1">Configure automated reminders and alerts</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Notification Types */}
      <div className="space-y-6">
        {Object.entries(settings).map(([key, setting]) => (
          <div key={key} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {key === 'returnReminder' && 'Notify customers and staff before rental return dates'}
                  {key === 'overdueAlert' && 'Alert when items are overdue for return'}
                  {key === 'paymentDue' && 'Remind customers about upcoming payment due dates'}
                  {key === 'deliveryUpdate' && 'Send updates about delivery status changes'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={setting.enabled}
                  onChange={(e) => handleSettingChange(key, 'enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {setting.enabled && (
              <div className="space-y-4">
                {/* Lead Time */}
                {key !== 'deliveryUpdate' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lead Time (days before event)
                    </label>
                    <select
                      value={setting.leadTimeDays}
                      onChange={(e) => handleSettingChange(key, 'leadTimeDays', parseInt(e.target.value))}
                      className="w-32 rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value={1}>1 day</option>
                      <option value={2}>2 days</option>
                      <option value={3}>3 days</option>
                      <option value={5}>5 days</option>
                      <option value={7}>7 days</option>
                    </select>
                  </div>
                )}

                {/* Channels */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notification Channels
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['email', 'sms', 'push', 'portal'].map((channel) => (
                      <button
                        key={channel}
                        onClick={() => handleChannelToggle(key, channel)}
                        className={clsx(
                          'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                          setting.channels.includes(channel)
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                        )}
                      >
                        {getChannelIcon(channel)}
                        <span className="capitalize">{channel}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recipients */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipients
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={setting.customerEnabled}
                        onChange={(e) => handleSettingChange(key, 'customerEnabled', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Customers</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={setting.staffEnabled}
                        onChange={(e) => handleSettingChange(key, 'staffEnabled', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Staff</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Penalty Rules */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Penalty Rules</h3>
        <div className="space-y-4">
          {penaltyRules.map((rule) => (
            <div key={rule.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{rule.name}</h4>
                <p className="text-sm text-gray-600">
                  {rule.calculation === 'daily' && `$${rule.amount} per day`}
                  {rule.calculation === 'percentage' && `${rule.amount}% of rental value`}
                  {rule.calculation === 'fixed' && `$${rule.amount} flat fee`}
                  {rule.gracePeriodHours > 0 && ` (${rule.gracePeriodHours}h grace period)`}
                  {rule.maxAmount && ` (max $${rule.maxAmount})`}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rule.isActive}
                    onChange={(e) => {
                      setPenaltyRules(prev => prev.map(r => 
                        r.id === rule.id ? { ...r, isActive: e.target.checked } : r
                      ));
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
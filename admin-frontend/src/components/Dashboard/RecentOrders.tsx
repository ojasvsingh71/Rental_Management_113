import React from 'react';
import { useStore } from '../../hooks/useStore';
import { Calendar, User, DollarSign } from 'lucide-react';
import clsx from 'clsx';

export function RecentOrders() {
  const { orders, setCurrentView } = useStore();

  // Mock recent orders since we don't have real data yet
  const recentOrders = [
    {
      id: '1',
      customerName: 'Sarah Johnson',
      product: 'Professional Camera Kit',
      amount: 270,
      status: 'confirmed' as const,
      date: 'Mar 15, 2024',
    },
    {
      id: '2',
      customerName: 'Mike Chen',
      product: 'DJ Controller Pro',
      amount: 450,
      status: 'in-progress' as const,
      date: 'Mar 14, 2024',
    },
    {
      id: '3',
      customerName: 'Emily Rodriguez',
      product: 'Professional Lighting Kit',
      amount: 200,
      status: 'pending' as const,
      date: 'Mar 13, 2024',
    },
    {
      id: '4',
      customerName: 'David Wilson',
      product: 'Professional Camera Kit',
      amount: 135,
      status: 'completed' as const,
      date: 'Mar 12, 2024',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
        <button 
          onClick={() => setCurrentView('orders')}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          View all
        </button>
      </div>

      <div className="space-y-4">
        {recentOrders.map((order) => (
          <div key={order.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-emerald-600 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{order.customerName}</p>
                <p className="text-sm text-gray-600">{order.product}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{order.date}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="font-semibold text-gray-900">${order.amount}</span>
                </div>
                <span className={clsx(
                  'inline-block px-2 py-1 rounded-full text-xs font-medium mt-1',
                  getStatusColor(order.status)
                )}>
                  {order.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
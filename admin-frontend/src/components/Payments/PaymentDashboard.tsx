import React, { useState } from 'react';
import { useStore } from '../../hooks/useStore';
import { CreditCard, DollarSign, AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';

export function PaymentDashboard() {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  // Mock payment data
  const mockPayments = [
    {
      id: '1',
      orderId: '1',
      amount: 270,
      currency: 'USD',
      type: 'full' as const,
      status: 'completed' as const,
      method: 'Stripe',
      transactionId: 'pi_1234567890',
      paidAt: new Date('2024-03-10T14:30:00'),
      customer: 'Sarah Johnson',
    },
    {
      id: '2',
      orderId: '2',
      amount: 225,
      currency: 'USD',
      type: 'deposit' as const,
      status: 'completed' as const,
      method: 'PayPal',
      transactionId: 'pp_9876543210',
      paidAt: new Date('2024-03-12T09:15:00'),
      customer: 'Mike Chen',
    },
    {
      id: '3',
      orderId: '2',
      amount: 225,
      currency: 'USD',
      type: 'balance' as const,
      status: 'pending' as const,
      method: 'Stripe',
      dueDate: new Date('2024-03-21T23:59:59'),
      customer: 'Mike Chen',
    },
    {
      id: '4',
      orderId: '4',
      amount: 50,
      currency: 'USD',
      type: 'penalty' as const,
      status: 'pending' as const,
      method: 'Stripe',
      dueDate: new Date('2024-03-16T23:59:59'),
      customer: 'David Wilson',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full':
        return 'bg-emerald-100 text-emerald-800';
      case 'deposit':
        return 'bg-blue-100 text-blue-800';
      case 'balance':
        return 'bg-amber-100 text-amber-800';
      case 'penalty':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalRevenue = mockPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = mockPayments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600 mt-1">Manage payments and financial transactions</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <DollarSign className="h-4 w-4" />
            <span>Process Payment</span>
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <CreditCard className="h-4 w-4" />
            <span>Payment Settings</span>
          </button>
        </div>
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">${totalRevenue}</p>
              <p className="text-sm text-emerald-600 mt-2">+12.5% from last month</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50">
              <DollarSign className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Payments</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">${pendingAmount}</p>
              <p className="text-sm text-amber-600 mt-2">2 overdue</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-50">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">98.5%</p>
              <p className="text-sm text-emerald-600 mt-2">+2.1% improvement</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Failed Payments</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">3</p>
              <p className="text-sm text-red-600 mt-2">Requires attention</p>
            </div>
            <div className="p-3 rounded-lg bg-red-50">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Stripe</p>
                <p className="text-sm text-gray-600">Credit/Debit Cards</p>
              </div>
            </div>
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">PayPal</p>
                <p className="text-sm text-gray-600">Digital Wallet</p>
              </div>
            </div>
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Razorpay</p>
                <p className="text-sm text-gray-600">Multiple Options</p>
              </div>
            </div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">#{payment.id}</div>
                      <div className="text-sm text-gray-500">Order #{payment.orderId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{payment.customer}</div>
                    <div className="text-sm text-gray-500">{payment.method}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${payment.amount} {payment.currency}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={clsx(
                      'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                      getTypeColor(payment.type)
                    )}>
                      {payment.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={clsx(
                      'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                      getStatusColor(payment.status)
                    )}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.paidAt 
                      ? format(payment.paidAt, 'MMM d, yyyy')
                      : payment.dueDate 
                        ? `Due ${format(payment.dueDate, 'MMM d')}`
                        : 'N/A'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {payment.status === 'pending' && (
                        <button className="text-emerald-600 hover:text-emerald-900 text-sm">
                          Process
                        </button>
                      )}
                      <button className="text-blue-600 hover:text-blue-900 text-sm">
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
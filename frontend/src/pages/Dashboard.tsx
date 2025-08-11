import React from 'react';
import { Plus, FileText, BarChart3, Settings } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { adminAPI, rentalsAPI } from '../services/api';
import StatCard from '../components/dashboard/StatCard';
import QuickAction from '../components/dashboard/QuickAction';
import OrdersTable from '../components/dashboard/OrdersTable';
import { StatCard as StatCardType } from '../types';

const Dashboard: React.FC = () => {
  const { data: dashboardData, loading: dashboardLoading } = useApi(() => adminAPI.getDashboard());
  const { data: rentals, loading: rentalsLoading } = useApi(() => rentalsAPI.getAll());

  // Transform dashboard data to stats format
  const stats: StatCardType[] = dashboardData ? [
    {
      title: 'Active Rentals',
      value: dashboardData.totalRentals?.toString() || '0',
      change: '+12%',
      icon: Plus,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      trend: 'up' as const
    },
    {
      title: 'Monthly Revenue',
      value: `$${dashboardData.totalRevenue?.toLocaleString() || '0'}`,
      change: '+8%',
      icon: FileText,
      color: 'text-green-600',
      bg: 'bg-green-50',
      trend: 'up' as const
    },
    {
      title: 'Total Users',
      value: dashboardData.totalUsers?.toString() || '0',
      change: '+24%',
      icon: BarChart3,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      trend: 'up' as const
    },
    {
      title: 'Total Products',
      value: dashboardData.totalProducts?.toString() || '0',
      change: '+5%',
      icon: Settings,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      trend: 'up' as const
    }
  ] : [];

  const quickActions = [
    {
      icon: Plus,
      title: 'Add Product',
      description: 'Create new rental item',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-900'
    },
    {
      icon: FileText,
      title: 'New Order',
      description: 'Manual order creation',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100',
      iconColor: 'text-green-600',
      textColor: 'text-green-900'
    },
    {
      icon: BarChart3,
      title: 'View Reports',
      description: 'Analytics dashboard',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100',
      iconColor: 'text-purple-600',
      textColor: 'text-purple-900'
    },
    {
      icon: Settings,
      title: 'Settings',
      description: 'System configuration',
      bgColor: 'bg-orange-50',
      hoverColor: 'hover:bg-orange-100',
      iconColor: 'text-orange-600',
      textColor: 'text-orange-900'
    }
  ];

  if (dashboardLoading || rentalsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <QuickAction key={index} {...action} />
        ))}
      </div>

      {/* Orders Table with Pagination */}
      <OrdersTable orders={rentals || []} />
    </div>
  );
};

export default Dashboard;
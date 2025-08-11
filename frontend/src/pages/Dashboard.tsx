import React, { useState, useEffect } from 'react';
import { Plus, FileText, BarChart3, Settings, Users, Package, DollarSign, Leaf, AlertCircle, Star, TrendingUp, TrendingDown } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { adminAPI, rentalsAPI, productsAPI, customersAPI } from '../services/api';
import StatCard from '../components/dashboard/StatCard';
import QuickAction from '../components/dashboard/QuickAction';
import OrdersTable from '../components/dashboard/OrdersTable';
import { StatCard as StatCardType } from '../types';

const Dashboard: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  
  const { data: dashboardData, loading: dashboardLoading, error: dashboardError } = useApi(
    () => adminAPI.getDashboard(),
    { immediate: true }
  );
  
  const { data: rentalsData, loading: rentalsLoading } = useApi(
    () => rentalsAPI.getAll(),
    { immediate: true }
  );

  const { data: productsData } = useApi(
    () => productsAPI.getAll({ take: 5 }),
    { immediate: true }
  );

  const { data: customersData } = useApi(
    () => customersAPI.getAll(),
    { immediate: true }
  );

  // Transform dashboard data to stats format
  const stats: StatCardType[] = dashboardData ? [
    {
      title: 'Active Rentals',
      value: dashboardData.totalRentals?.toString() || '0',
      change: '+12%',
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      trend: 'up' as const
    },
    {
      title: 'Monthly Revenue',
      value: `$${dashboardData.totalRevenue?.toLocaleString() || '0'}`,
      change: '+8%',
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50',
      trend: 'up' as const
    },
    {
      title: 'Total Users',
      value: dashboardData.totalUsers?.toString() || '0',
      change: '+24%',
      icon: Users,
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
    },
    {
      title: 'CO₂ Saved',
      value: '2.4 Tons',
      change: '+18%',
      icon: Leaf,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      trend: 'up' as const
    },
    {
      title: 'Avg Rating',
      value: '4.8',
      change: '+0.2',
      icon: Star,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
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
      textColor: 'text-blue-900',
      onClick: () => console.log('Add product clicked')
    },
    {
      icon: FileText,
      title: 'New Order',
      description: 'Manual order creation',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100',
      iconColor: 'text-green-600',
      textColor: 'text-green-900',
      onClick: () => console.log('New order clicked')
    },
    {
      icon: BarChart3,
      title: 'View Reports',
      description: 'Analytics dashboard',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100',
      iconColor: 'text-purple-600',
      textColor: 'text-purple-900',
      onClick: () => console.log('View reports clicked')
    },
    {
      icon: Settings,
      title: 'Settings',
      description: 'System configuration',
      bgColor: 'bg-orange-50',
      hoverColor: 'hover:bg-orange-100',
      iconColor: 'text-orange-600',
      textColor: 'text-orange-900',
      onClick: () => console.log('Settings clicked')
    }
  ];

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (dashboardLoading || rentalsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your rental business.</p>
          </div>
          <button
            onClick={handleRefresh}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Refresh
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <div className="w-8 h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <div>
              <h3 className="text-lg font-semibold text-red-900">Error Loading Dashboard</h3>
              <p className="text-red-700">Failed to load dashboard data. Please try again.</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your rental business.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
          <button
            onClick={handleRefresh}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <QuickAction key={index} {...action} />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OrdersTable orders={rentalsData || []} />
        </div>
        
        <div className="space-y-6">
          {/* Recent Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Products</h3>
            <div className="space-y-3">
              {productsData?.slice(0, 5).map((product: any) => (
                <div key={product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.category}</div>
                  </div>
                  <div className="text-sm font-medium text-green-600">
                    ${product.basePrice}
                  </div>
                </div>
              )) || (
                <div className="text-center text-gray-500 py-4">
                  No products available
                </div>
              )}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">API Status</span>
                <span className="flex items-center gap-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Database</span>
                <span className="flex items-center gap-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">AI Services</span>
                <span className="flex items-center gap-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Last Backup</span>
                <span className="text-gray-500 text-sm">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
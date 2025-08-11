import React from 'react';
import { useStore } from '../../hooks/useStore';
import { StatsCard } from './StatsCard';
import { RecentOrders } from './RecentOrders';
import { AvailabilityChart } from './AvailabilityChart';
import {
  ShoppingCart,
  Package,
  DollarSign,
  TrendingUp,
  Truck,
  Clock,
} from 'lucide-react';

export function Dashboard() {
  const { stats } = useStore();

  if (!stats) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your rentals.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          change={12.5}
          icon={ShoppingCart}
          color="blue"
        />
        <StatsCard
          title="Active Rentals"
          value={stats.activeRentals}
          icon={Clock}
          color="yellow"
        />
        <StatsCard
          title="Monthly Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          change={stats.monthlyGrowth}
          icon={DollarSign}
          color="green"
        />
        <StatsCard
          title="Available Products"
          value={stats.availableProducts}
          icon={Package}
          color="purple"
        />
        <StatsCard
          title="Pending Deliveries"
          value={stats.pendingDeliveries}
          icon={Truck}
          color="red"
        />
        <StatsCard
          title="Growth Rate"
          value={`${stats.monthlyGrowth}%`}
          change={2.1}
          icon={TrendingUp}
          color="green"
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AvailabilityChart />
        <RecentOrders />
      </div>
    </div>
  );
}
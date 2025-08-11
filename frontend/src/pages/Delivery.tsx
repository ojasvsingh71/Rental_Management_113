import React, { useState } from "react";
import { Plus, Clock, MapPin, Star, Phone, Truck, Package, CheckCircle, AlertCircle } from "lucide-react";
import { useApi } from "../hooks/useApi";
import { pickupAPI, returnAPI } from "../services/api";
import Pagination from "../components/common/Pagination";
import { usePagination } from "../hooks/usePagination";

interface DeliveryItem {
  id: string;
  rentalId: string;
  scheduled: string;
  actualPickup?: string;
  actualReturn?: string;
  completed: boolean;
  staffId?: string;
  staff?: {
    id: string;
    name: string;
  };
  rental: {
    id: string;
    orderReference?: string;
    customer: {
      id: string;
      name: string;
      email: string;
      phone?: string;
    };
    product: {
      id: string;
      name: string;
    };
  };
}

const Delivery: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedDriver, setSelectedDriver] = useState("all");

  const { data: pickupsData, loading: pickupsLoading, refetch: refetchPickups } = useApi(
    () => pickupAPI.getAll(),
    { immediate: true }
  );

  const { data: returnsData, loading: returnsLoading, refetch: refetchReturns } = useApi(
    () => returnAPI.getAll(),
    { immediate: true }
  );

  const pickups = pickupsData || [];
  const returns = returnsData || [];

  // Combine pickups and returns into a unified delivery schedule
  const allDeliveries = [
    ...pickups.map((pickup: DeliveryItem) => ({
      ...pickup,
      type: 'Pickup' as const,
      status: pickup.completed ? 'Completed' : 'Scheduled',
      address: 'Customer Location', // This would come from customer data
      time: new Date(pickup.scheduled).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date(pickup.scheduled).toLocaleDateString(),
      driver: pickup.staff?.name || 'Unassigned',
    })),
    ...returns.map((returnItem: DeliveryItem) => ({
      ...returnItem,
      type: 'Return' as const,
      status: returnItem.completed ? 'Completed' : 'Scheduled',
      address: 'Warehouse Location', // This would come from return location data
      time: new Date(returnItem.scheduled).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date(returnItem.scheduled).toLocaleDateString(),
      driver: returnItem.staff?.name || 'Unassigned',
    }))
  ].sort((a, b) => new Date(a.scheduled).getTime() - new Date(b.scheduled).getTime());

  const filteredDeliveries = allDeliveries.filter(delivery => {
    const matchesTab = activeTab === "all" || delivery.status.toLowerCase() === activeTab.toLowerCase();
    const matchesDriver = selectedDriver === "all" || delivery.driver === selectedDriver;
    return matchesTab && matchesDriver;
  });

  const pagination = usePagination({ data: filteredDeliveries, itemsPerPage: 10 });

  const drivers = ["Mike Wilson", "Lisa Chen", "Tom Rodriguez"];
  const uniqueDrivers = [...new Set(allDeliveries.map(d => d.driver).filter(d => d !== 'Unassigned'))];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pickup':
        return 'bg-blue-100 text-blue-800';
      case 'return':
        return 'bg-green-100 text-green-800';
      case 'delivery':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTodayStats = () => {
    const today = new Date().toDateString();
    const todayDeliveries = allDeliveries.filter(d => new Date(d.scheduled).toDateString() === today);
    
    return {
      total: todayDeliveries.length,
      completed: todayDeliveries.filter(d => d.status === 'Completed').length,
      inProgress: todayDeliveries.filter(d => d.status === 'In Progress').length,
      pending: todayDeliveries.filter(d => d.status === 'Scheduled').length,
    };
  };

  const todayStats = getTodayStats();

  if (pickupsLoading || returnsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Delivery Management</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border-b pb-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Delivery Management</h1>
          <p className="text-gray-600">Manage pickups, deliveries, and returns</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Schedule Delivery
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select 
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Deliveries</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="in progress">In Progress</option>
          </select>
          <select 
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Drivers</option>
            {uniqueDrivers.map(driver => (
              <option key={driver} value={driver}>{driver}</option>
            ))}
            <option value="Unassigned">Unassigned</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Delivery Schedule */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Delivery Schedule
              </h2>
              <p className="text-gray-600 mt-1">
                {filteredDeliveries.length} deliveries found
              </p>
            </div>
            
            {filteredDeliveries.length === 0 ? (
              <div className="p-12 text-center">
                <Truck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Deliveries Found</h3>
                <p className="text-gray-600">No deliveries match your current filters.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {pagination.currentData.map((delivery: any) => (
                  <div key={`${delivery.type}-${delivery.id}`} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          delivery.status === "Completed" ? "bg-green-500" :
                          delivery.status === "In Progress" ? "bg-blue-500" :
                          "bg-yellow-500"
                        }`}></div>
                        <span className="font-medium text-gray-900">
                          {delivery.rental.orderReference || delivery.rentalId}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(delivery.type)}`}>
                          {delivery.type}
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(delivery.status)}`}>
                        {delivery.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {delivery.rental.customer.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {delivery.rental.product.name}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <MapPin className="h-4 w-4" />
                          {delivery.address}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          {delivery.date} at {delivery.time}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Driver: <span className="font-medium">{delivery.driver}</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          Track
                        </button>
                        <button className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          Contact
                        </button>
                        {delivery.status !== 'Completed' && (
                          <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                            Update
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {filteredDeliveries.length > 0 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
                startIndex={pagination.startIndex}
                endIndex={pagination.endIndex}
                onPageChange={pagination.goToPage}
                canGoNext={pagination.canGoNext}
                canGoPrev={pagination.canGoPrev}
              />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Driver Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Driver Performance
            </h3>
            <div className="space-y-4">
              {drivers.map((driver, index) => {
                const driverDeliveries = allDeliveries.filter(d => d.driver === driver);
                const completedToday = driverDeliveries.filter(d => 
                  d.status === 'Completed' && 
                  new Date(d.scheduled).toDateString() === new Date().toDateString()
                ).length;
                
                return (
                  <div key={driver} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{driver}</div>
                      <div className="text-sm text-gray-500">
                        {completedToday} deliveries today
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">
                        {(4.7 + index * 0.1).toFixed(1)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Today's Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Today's Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Total Deliveries
                </span>
                <span className="font-medium">{todayStats.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Completed
                </span>
                <span className="font-medium text-green-600">{todayStats.completed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-blue-600" />
                  In Progress
                </span>
                <span className="font-medium text-blue-600">{todayStats.inProgress}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  Pending
                </span>
                <span className="font-medium text-yellow-600">{todayStats.pending}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full bg-blue-50 text-blue-700 py-3 px-4 rounded-lg hover:bg-blue-100 transition-colors text-left">
                Schedule New Pickup
              </button>
              <button className="w-full bg-green-50 text-green-700 py-3 px-4 rounded-lg hover:bg-green-100 transition-colors text-left">
                Schedule Return
              </button>
              <button className="w-full bg-purple-50 text-purple-700 py-3 px-4 rounded-lg hover:bg-purple-100 transition-colors text-left">
                Assign Driver
              </button>
              <button className="w-full bg-orange-50 text-orange-700 py-3 px-4 rounded-lg hover:bg-orange-100 transition-colors text-left">
                View Routes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Delivery;
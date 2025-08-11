import React, { useState } from "react";
import { Plus, Calendar, Clock, MapPin, Leaf, Truck, AlertCircle, Star, Eye, Download } from "lucide-react";
import { useApi } from "../../hooks/useApi";
import { rentalsAPI } from "../../services/api";
import Pagination from "../../components/common/Pagination";
import { usePagination } from "../../hooks/usePagination";

interface Rental {
  id: string;
  orderReference?: string;
  customerId: string;
  productId: string;
  startDate: string;
  endDate: string;
  status: 'QUOTATION' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    name: string;
    email: string;
  };
  product?: {
    id: string;
    name: string;
  };
}

const Rentals: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const { data: rentalsData, loading, error, refetch } = useApi(
    () => rentalsAPI.getMy(),
    { immediate: true }
  );

  const rentals = rentalsData || [];

  const filteredRentals = rentals.filter((rental: Rental) => {
    if (activeFilter === "all") return true;
    return rental.status.toLowerCase() === activeFilter.toLowerCase();
  });

  const pagination = usePagination({ data: filteredRentals, itemsPerPage: 5 });

  const getStatusCount = (status: string) => {
    if (status === "all") return rentals.length;
    return rentals.filter((r: Rental) => r.status.toLowerCase() === status.toLowerCase()).length;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'QUOTATION':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = Date.now();
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    return Math.round(((now - start) / (end - start)) * 100);
  };

  const getDaysLeft = (endDate: string) => {
    const end = new Date(endDate).getTime();
    const now = Date.now();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const handleExtend = (rentalId: string) => {
    console.log("Extend rental:", rentalId);
    // Implement extend functionality
  };

  const handleTrack = (rentalId: string) => {
    console.log("Track rental:", rentalId);
    // Implement tracking functionality
  };

  const handleRate = (rentalId: string, rating: number) => {
    console.log("Rate rental:", rentalId, rating);
    // Implement rating functionality
  };

  const handleUploadScan = (rentalId: string) => {
    console.log("Upload scan for rental:", rentalId);
    // Implement scan upload functionality
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">My Rentals</h1>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Rentals</h3>
            <p className="text-red-700 mb-4">Failed to load your rentals. Please try again.</p>
            <button
              onClick={refetch}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
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
          <h1 className="text-2xl font-bold text-gray-900">My Rentals</h1>
          <p className="text-gray-600">Track and manage your rental orders</p>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Rental
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            activeFilter === "all"
              ? "bg-blue-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          All Rentals ({getStatusCount("all")})
        </button>
        <button
          onClick={() => setActiveFilter("active")}
          className={`px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            activeFilter === "active"
              ? "bg-blue-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Active ({getStatusCount("active")})
        </button>
        <button
          onClick={() => setActiveFilter("confirmed")}
          className={`px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            activeFilter === "confirmed"
              ? "bg-blue-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Confirmed ({getStatusCount("confirmed")})
        </button>
        <button
          onClick={() => setActiveFilter("completed")}
          className={`px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            activeFilter === "completed"
              ? "bg-blue-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Completed ({getStatusCount("completed")})
        </button>
        <button
          onClick={() => setActiveFilter("quotation")}
          className={`px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            activeFilter === "quotation"
              ? "bg-blue-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Quotations ({getStatusCount("quotation")})
        </button>
      </div>

      {/* Rentals List */}
      <div className="space-y-4">
        {pagination.currentData.map((rental: Rental) => {
          const progress = calculateProgress(rental.startDate, rental.endDate);
          const daysLeft = getDaysLeft(rental.endDate);
          
          return (
            <div key={rental.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-2xl">📦</div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className="text-lg font-semibold text-gray-900">
                          {rental.orderReference || rental.id}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(rental.status)}`}>
                          {rental.status}
                        </span>
                        {rental.status === 'ACTIVE' && (
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">{progress}%</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">
                          ${Math.floor(Math.random() * 500 + 100)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {Math.ceil((new Date(rental.endDate).getTime() - new Date(rental.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      {rental.product?.name || 'Product Name'}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Start: {formatDate(rental.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">End: {formatDate(rental.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Downtown Warehouse</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Leaf className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600 font-medium">CO₂: 2.3kg saved</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-600 font-medium">
                          {rental.status === 'ACTIVE' ? `Return in ${daysLeft} days` :
                           rental.status === 'CONFIRMED' ? 'Pickup scheduled' :
                           rental.status === 'COMPLETED' ? 'Completed' :
                           rental.status === 'QUOTATION' ? 'Awaiting approval' :
                           'Status update'}
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleTrack(rental.id)}
                          className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </button>
                        {rental.status === 'ACTIVE' && (
                          <>
                            <button 
                              onClick={() => handleExtend(rental.id)}
                              className="bg-green-50 text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
                            >
                              Extend Rental
                            </button>
                            <button 
                              onClick={() => handleUploadScan(rental.id)}
                              className="bg-purple-50 text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors"
                            >
                              Upload Scan
                            </button>
                          </>
                        )}
                        {rental.status === 'COMPLETED' && (
                          <button 
                            onClick={() => handleRate(rental.id, 5)}
                            className="bg-yellow-50 text-yellow-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-100 transition-colors flex items-center gap-2"
                          >
                            <Star className="h-4 w-4" />
                            Rate
                          </button>
                        )}
                        {rental.status === 'QUOTATION' && (
                          <button className="bg-green-50 text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors">
                            Accept Quote
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {rental.status === 'ACTIVE' && (
                <div className="bg-blue-50 px-6 py-3 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-blue-800">Tracking ID: TRK-{rental.id.slice(-6)}</span>
                    </div>
                    <button className="text-blue-600 text-sm hover:text-blue-800 flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      Download Contract
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredRentals.length === 0 && !loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No {activeFilter !== 'all' ? activeFilter : ''} rentals found
          </h3>
          <p className="text-gray-600 mb-6">
            {activeFilter === 'all' 
              ? "You haven't made any rentals yet. Start browsing our products!" 
              : `No ${activeFilter} rentals at the moment.`}
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Browse Products
          </button>
        </div>
      )}

      {/* Pagination */}
      {filteredRentals.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
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
        </div>
      )}
    </div>
  );
};

export default Rentals;
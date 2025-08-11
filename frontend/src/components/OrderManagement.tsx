import React, { useState } from 'react';
import { 
  Eye, 
  Edit, 
  Truck, 
  Package, 
  CheckCircle, 
  Clock, 
  DollarSign,
  Calendar,
  User,
  Phone,
  Mail
} from 'lucide-react';
import { useRental, Order } from '../context/RentalContext';

export function OrderManagement() {
  const { orders, updateOrder } = useRental();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'quotation':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'pickup':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800';
      case 'returned':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'quotation':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pickup':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <Package className="h-4 w-4" />;
      case 'returned':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    updateOrder(orderId, { status: newStatus as any });
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus as any });
    }
  };

  const calculateLateFee = (order: Order) => {
    if (!order.returnScheduled || order.status === 'returned') return 0;
    const returnDate = new Date(order.returnScheduled);
    const currentDate = new Date();
    if (currentDate > returnDate) {
      const daysLate = Math.ceil((currentDate.getTime() - returnDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysLate * 100; // ₹100 per day late fee
    }
    return 0;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600">Track and manage all rental orders</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Orders</option>
            <option value="quotation">Quotations</option>
            <option value="confirmed">Confirmed</option>
            <option value="pickup">Pickup Scheduled</option>
            <option value="delivered">Delivered</option>
            <option value="returned">Returned</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Orders ({filteredOrders.length})</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredOrders.map((order) => {
                const lateFee = calculateLateFee(order);
                return (
                  <div
                    key={order.id}
                    className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedOrder?.id === order.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <h3 className="text-lg font-semibold text-gray-900">#{order.id}</h3>
                        {lateFee > 0 && (
                          <span className="ml-2 bg-red-100 text-red-800 px-2 py-1 text-xs font-medium rounded-full">
                            Late ₹{lateFee}
                          </span>
                        )}
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Customer</p>
                        <p className="font-medium text-gray-900">{order.customerName}</p>
                        <p className="text-sm text-gray-600">{order.customerEmail}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Amount</p>
                        <p className="font-medium text-gray-900">₹{order.totalAmount}</p>
                        <p className="text-sm text-gray-600">Paid: ₹{order.paidAmount}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        {order.startDate} to {order.endDate}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Details Sidebar */}
        <div className="lg:col-span-1">
          {selectedOrder ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-20">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Order #{selectedOrder.id}</h2>
                  <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    <span className="ml-1 capitalize">{selectedOrder.status}</span>
                  </span>
                </div>

                {/* Status Update Buttons */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedOrder.status === 'quotation' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedOrder.id, 'confirmed')}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Confirm Order
                    </button>
                  )}
                  {selectedOrder.status === 'confirmed' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedOrder.id, 'pickup')}
                      className="bg-purple-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-purple-700 transition-colors"
                    >
                      Schedule Pickup
                    </button>
                  )}
                  {selectedOrder.status === 'pickup' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedOrder.id, 'delivered')}
                      className="bg-emerald-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-emerald-700 transition-colors"
                    >
                      Mark Delivered
                    </button>
                  )}
                  {selectedOrder.status === 'delivered' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedOrder.id, 'returned')}
                      className="bg-gray-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-gray-700 transition-colors"
                    >
                      Mark Returned
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Customer Information */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Customer Information
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>Name:</strong> {selectedOrder.customerName}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Email:</strong> {selectedOrder.customerEmail}
                    </p>
                  </div>
                </div>

                {/* Rental Details */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Rental Period
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>Start:</strong> {selectedOrder.startDate}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>End:</strong> {selectedOrder.endDate}
                    </p>
                    {selectedOrder.pickupScheduled && (
                      <p className="text-sm text-gray-600">
                        <strong>Pickup:</strong> {new Date(selectedOrder.pickupScheduled).toLocaleString()}
                      </p>
                    )}
                    {selectedOrder.returnScheduled && (
                      <p className="text-sm text-gray-600">
                        <strong>Return:</strong> {new Date(selectedOrder.returnScheduled).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Products */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    Products
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.products.map((product, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <p className="font-medium text-gray-900">{product.productName}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {product.quantity} × ₹{product.rate}/{product.durationType}
                        </p>
                        <p className="text-sm text-gray-600">
                          Duration: {product.duration} {product.durationType}(s)
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          Subtotal: ₹{product.quantity * product.rate * product.duration}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Payment Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">₹{selectedOrder.totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Paid:</span>
                      <span className="font-medium text-emerald-600">₹{selectedOrder.paidAmount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Remaining:</span>
                      <span className="font-medium text-orange-600">₹{selectedOrder.totalAmount - selectedOrder.paidAmount}</span>
                    </div>
                    {calculateLateFee(selectedOrder) > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Late Fee:</span>
                        <span className="font-medium text-red-600">₹{calculateLateFee(selectedOrder)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Order Selected</h3>
              <p className="text-gray-600">Select an order from the list to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
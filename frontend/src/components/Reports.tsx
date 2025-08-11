import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  Package, 
  Users, 
  DollarSign,
  Calendar,
  FileText,
  Filter
} from 'lucide-react';
import { useRental } from '../context/RentalContext';

export function Reports() {
  const { products, orders } = useRental();
  const [dateRange, setDateRange] = useState('30');
  const [reportType, setReportType] = useState('overview');

  const generateReportData = () => {
    const now = new Date();
    const daysBack = parseInt(dateRange);
    const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    
    const filteredOrders = orders.filter(order => 
      new Date(order.createdAt) >= startDate
    );

    // Most rented products
    const productRentals = new Map();
    filteredOrders.forEach(order => {
      order.products.forEach(product => {
        const current = productRentals.get(product.productId) || { 
          name: product.productName, 
          count: 0, 
          revenue: 0 
        };
        current.count += product.quantity;
        current.revenue += product.quantity * product.rate * product.duration;
        productRentals.set(product.productId, current);
      });
    });

    const mostRentedProducts = Array.from(productRentals.entries())
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Revenue analysis
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const paidRevenue = filteredOrders.reduce((sum, order) => sum + order.paidAmount, 0);
    const pendingRevenue = totalRevenue - paidRevenue;

    // Customer analysis
    const customerStats = new Map();
    filteredOrders.forEach(order => {
      const current = customerStats.get(order.customerId) || {
        name: order.customerName,
        orders: 0,
        revenue: 0
      };
      current.orders++;
      current.revenue += order.totalAmount;
      customerStats.set(order.customerId, current);
    });

    const topCustomers = Array.from(customerStats.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Status distribution
    const statusStats = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      mostRentedProducts,
      totalRevenue,
      paidRevenue,
      pendingRevenue,
      topCustomers,
      statusStats,
      totalOrders: filteredOrders.length,
      averageOrderValue: filteredOrders.length ? totalRevenue / filteredOrders.length : 0
    };
  };

  const reportData = generateReportData();

  const exportReport = (format: 'pdf' | 'csv' | 'xlsx') => {
    // In a real application, you would implement actual export functionality
    // For now, we'll simulate the download
    const data = JSON.stringify(reportData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rental-report-${new Date().toISOString().split('T')[0]}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive insights into your rental business</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
          </select>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => exportReport('pdf')}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              PDF
            </button>
            <button
              onClick={() => exportReport('csv')}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              CSV
            </button>
            <button
              onClick={() => exportReport('xlsx')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              XLSX
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{reportData.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-emerald-600">Paid: ₹{reportData.paidRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.totalOrders}</p>
              <p className="text-sm text-blue-600">
                Avg: ₹{reportData.averageOrderValue.toFixed(0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Package className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Products Rented</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.mostRentedProducts.length}</p>
              <p className="text-sm text-purple-600">Active products</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{reportData.pendingRevenue.toLocaleString()}</p>
              <p className="text-sm text-orange-600">Outstanding</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Most Rented Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Package className="h-5 w-5 mr-2 text-purple-600" />
              Most Rented Products
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {reportData.mostRentedProducts.slice(0, 8).map((product, index) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      #{index + 1}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.count} rentals</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₹{product.revenue.toLocaleString()}</p>
                    <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(product.count / reportData.mostRentedProducts[0]?.count || 1) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Users className="h-5 w-5 mr-2 text-emerald-600" />
              Top Customers
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {reportData.topCustomers.slice(0, 8).map((customer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">{customer.name}</p>
                      <p className="text-sm text-gray-600">{customer.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₹{customer.revenue.toLocaleString()}</p>
                    <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-emerald-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(customer.revenue / reportData.topCustomers[0]?.revenue || 1) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Order Status Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
            Order Status Distribution
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {Object.entries(reportData.statusStats).map(([status, count]) => {
              const percentage = (count / Object.values(reportData.statusStats).reduce((a, b) => a + b, 0)) * 100;
              const colors = {
                quotation: 'bg-yellow-500',
                confirmed: 'bg-blue-500',
                pickup: 'bg-purple-500',
                delivered: 'bg-emerald-500',
                returned: 'bg-gray-500'
              };
              
              return (
                <div key={status} className="text-center">
                  <div className="mb-3">
                    <div className={`w-16 h-16 ${colors[status as keyof typeof colors] || 'bg-gray-500'} rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto`}>
                      {count}
                    </div>
                  </div>
                  <p className="font-medium text-gray-900 capitalize">{status}</p>
                  <p className="text-sm text-gray-600">{percentage.toFixed(1)}%</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Analytics Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-gray-600" />
            Detailed Analytics
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metric
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Total Orders
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {reportData.totalOrders}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Last {dateRange} days
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Total Revenue
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{reportData.totalRevenue.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Last {dateRange} days
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Paid Amount
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{reportData.paidRevenue.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Last {dateRange} days
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Average Order Value
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{reportData.averageOrderValue.toFixed(0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Last {dateRange} days
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Collection Rate
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {((reportData.paidRevenue / reportData.totalRevenue) * 100).toFixed(1)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Last {dateRange} days
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
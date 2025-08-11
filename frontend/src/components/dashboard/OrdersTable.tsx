import React from 'react';
import { Eye, Edit, Phone } from 'lucide-react';
import { Rental } from '../../types';
import Pagination from '../common/Pagination';
import { usePagination } from '../../hooks/usePagination';

interface OrdersTableProps {
  orders: Rental[];
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders }) => {
  const pagination = usePagination<Rental>({ 
    data: orders, 
    itemsPerPage: 10 
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
          <div className="flex items-center gap-3">
            <button className="text-sm text-gray-600 hover:text-gray-800">Filter</button>
            <button className="text-green-600 hover:text-green-700 text-sm font-medium">View all</button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rental Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pagination.currentData.map((rental) => (
              <tr key={rental.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{rental.orderReference || rental.id}</div>
                    <div className="text-sm text-gray-500">Created: {formatDate(rental.createdAt)}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{rental.customer?.name || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{rental.customer?.email || 'N/A'}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{rental.product?.name || 'N/A'}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${
                    rental.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    rental.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                    rental.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
                    rental.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {rental.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm text-gray-900">Start: {formatDate(rental.startDate)}</div>
                    <div className="text-sm text-gray-500">End: {formatDate(rental.endDate)}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-800">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
  );
};

export default OrdersTable;
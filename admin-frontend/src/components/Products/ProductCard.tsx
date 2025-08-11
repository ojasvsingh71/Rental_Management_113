import React from 'react';
import { Product } from '../../types';
import { useStore } from '../../hooks/useStore';
import { Eye, Edit, QrCode, DollarSign, Package } from 'lucide-react';
import clsx from 'clsx';

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
}

export function ProductCard({ product, viewMode }: ProductCardProps) {
  const { setSelectedProduct, setCurrentView } = useStore();

  const handleViewDetails = () => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
  };

  const handleEdit = () => {
    setSelectedProduct(product);
    setCurrentView('product-form');
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-6">
          <img
            src={product.image}
            alt={product.name}
            className="h-20 w-20 rounded-lg object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                <p className="text-gray-600 mt-1">{product.description}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {product.category}
                  </span>
                  <span className={clsx(
                    'inline-block px-2 py-1 rounded-full text-xs font-medium',
                    product.isAvailable 
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-800'
                  )}>
                    {product.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">${product.dailyRate}</div>
                <div className="text-sm text-gray-600">per day</div>
                <div className="flex items-center space-x-2 mt-3">
                  <button
                    onClick={handleViewDetails}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleEdit}
                    className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                    <QrCode className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="h-48 w-full object-cover"
        />
        <div className="absolute top-4 right-4 flex space-x-2">
          <span className={clsx(
            'inline-block px-2 py-1 rounded-full text-xs font-medium',
            product.isAvailable 
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-red-100 text-red-800'
          )}>
            {product.isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {product.category}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <span className="text-2xl font-bold text-gray-900">${product.dailyRate}</span>
            <span className="text-sm text-gray-600">/ day</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            onClick={handleViewDetails}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            <Eye className="h-4 w-4" />
            <span>View Details</span>
          </button>
          
          <div className="flex space-x-2">
            <button
              onClick={handleEdit}
              className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
              <QrCode className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
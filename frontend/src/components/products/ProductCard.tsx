import React from "react";
import { Star, Trash2, Edit, Eye, Package, Calendar, DollarSign } from "lucide-react";

interface Product {
  id: number;
  name: string;
  category: string;
  image: string;
  price: {
    hour: number;
    day: number;
    week: number;
    month: number;
  };
  stock: number;
  available: number;
  rented: number;
  ecoScore: number;
  rating: number;
  totalRentals: number;
  revenue: string;
  condition: 'Excellent' | 'Good' | 'Fair';
  lastMaintenance: string;
}

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onViewDetails,
  onDelete,
}) => {
  if (!product) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-xl">
        Product data unavailable
      </div>
    );
  }

  const availabilityPercentage = product.stock > 0 ? (product.available / product.stock) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Eco: {product.ecoScore}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              product.condition === "Excellent"
                ? "bg-green-100 text-green-800"
                : product.condition === "Good"
                ? "bg-blue-100 text-blue-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {product.condition}
          </span>
        </div>
        <div className="absolute top-3 left-3">
          <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
            ID: {product.id}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {product.category}
          </span>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2">{product.name}</h3>

        {/* Availability Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Availability</span>
            <span className="font-medium">{product.available}/{product.stock}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                availabilityPercentage > 50 ? 'bg-green-500' : 
                availabilityPercentage > 20 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${availabilityPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Package className="h-4 w-4 text-blue-600" />
              <span className="text-xs text-blue-600 font-medium">Stock</span>
            </div>
            <div className="text-lg font-bold text-blue-900">{product.stock}</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-xs text-green-600 font-medium">Revenue</span>
            </div>
            <div className="text-lg font-bold text-green-900">{product.revenue}</div>
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 mb-2">Pricing Structure:</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Day:</span>
              <span className="font-medium">${product.price.day}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Week:</span>
              <span className="font-medium">${product.price.week}</span>
            </div>
          </div>
        </div>

        {/* Last Maintenance */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Last Maintenance:</span>
          </div>
          <span className="font-medium text-gray-900">{product.lastMaintenance}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit?.(product)}
            className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={() => onViewDetails?.(product)}
            className="flex-1 bg-green-50 text-green-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Details
          </button>
          {onDelete && (
            <button
              onClick={() => onDelete(product)}
              className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition-colors"
              title="Delete Product"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
import React, { useState, useMemo } from "react";
import { Search, Filter, Star, Heart, Eye, Share2, MapPin, Leaf } from "lucide-react";
import { useApi } from "../../hooks/useApi";
import { productsAPI } from "../../services/api";
import Pagination from "../../components/common/Pagination";
import { usePagination } from "../../hooks/usePagination";

interface Product {
  id: string;
  name: string;
  description?: string;
  category?: string;
  isRentable: boolean;
  unitType: string;
  basePrice: number;
  stock?: number;
  createdAt: string;
  updatedAt: string;
}

const Browse: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [wishlistedItems, setWishlistedItems] = useState<Set<string>>(new Set());

  const { data: productsData, loading, error, refetch } = useApi(
    () => productsAPI.getAll(),
    { immediate: true }
  );

  const products = productsData || [];

  const categories = [
    { id: "all", name: "All Categories", count: products.length, icon: "🏪" },
    { id: "Power Tools", name: "Power Tools", count: products.filter((p: Product) => p.category === "Power Tools").length, icon: "🔧" },
    { id: "Camping Equipment", name: "Camping", count: products.filter((p: Product) => p.category === "Camping Equipment").length, icon: "⛺" },
    { id: "Electronics", name: "Electronics", count: products.filter((p: Product) => p.category === "Electronics").length, icon: "📱" },
    { id: "Furniture", name: "Furniture", count: products.filter((p: Product) => p.category === "Furniture").length, icon: "🪑" },
    { id: "Sports Equipment", name: "Sports", count: products.filter((p: Product) => p.category === "Sports Equipment").length, icon: "⚽" },
    { id: "Party Supplies", name: "Party", count: products.filter((p: Product) => p.category === "Party Supplies").length, icon: "🎉" },
  ];

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product: Product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.category?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;

      let matchesPrice = true;
      if (priceRange !== "all") {
        const [min, max] = priceRange
          .split("-")
          .map((p) => (p === "100+" ? 1000 : parseInt(p)));
        matchesPrice =
          product.basePrice >= min && (max ? product.basePrice <= max : true);
      }

      return matchesSearch && matchesCategory && matchesPrice && product.isRentable;
    });

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a: Product, b: Product) => a.basePrice - b.basePrice);
        break;
      case "price-high":
        filtered.sort((a: Product, b: Product) => b.basePrice - a.basePrice);
        break;
      case "name":
        filtered.sort((a: Product, b: Product) => a.name.localeCompare(b.name));
        break;
      default:
        // Keep original order for "popular"
        break;
    }

    return filtered;
  }, [searchTerm, selectedCategory, priceRange, sortBy, products]);

  const pagination = usePagination({ data: filteredProducts, itemsPerPage: 12 });

  const handleProductSelect = (product: Product) => {
    console.log("Selected product:", product.id);
    // Handle product selection (e.g., open rental modal)
  };

  const handleWishlistToggle = (productId: string) => {
    setWishlistedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const transformProductForDisplay = (product: Product) => ({
    ...product,
    image: `https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400`,
    price: {
      hour: Math.round(product.basePrice / 24),
      day: product.basePrice,
      week: Math.round(product.basePrice * 6),
      month: Math.round(product.basePrice * 25),
    },
    originalPrice: Math.round(product.basePrice * 1.2),
    ecoScore: 85,
    rating: 4.5,
    reviews: Math.floor(Math.random() * 100) + 10,
    available: product.isRentable && (product.stock || 0) > 0,
    co2Saved: `${(Math.random() * 5 + 1).toFixed(1)} kg`,
    features: ["Feature A", "Feature B", "Feature C"],
    location: "Downtown Warehouse",
    distance: `${(Math.random() * 5 + 0.5).toFixed(1)} km`,
    deliveryTime: "Same day",
    savings: `$${Math.floor(Math.random() * 500 + 100)} vs buying`,
    popularity: Math.floor(Math.random() * 100),
    isWishlisted: wishlistedItems.has(product.id),
    discount: Math.random() > 0.7 ? Math.floor(Math.random() * 20 + 5) : 0,
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
              <div className="w-full h-48 bg-gray-200"></div>
              <div className="p-6 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
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
            <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Products</h3>
            <p className="text-red-700 mb-4">Failed to load products. Please try again.</p>
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
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, brands, or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.count})
                </option>
              ))}
            </select>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Prices</option>
              <option value="0-50">$0 - $50/day</option>
              <option value="50-100">$50 - $100/day</option>
              <option value="100+">$100+/day</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {categories.slice(1).map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`bg-white rounded-lg p-4 text-center hover:shadow-md transition-all cursor-pointer border-2 ${
              selectedCategory === category.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200"
            }`}
          >
            <div className="text-2xl mb-2">{category.icon}</div>
            <span className="text-sm font-medium text-gray-700">
              {category.name}
            </span>
            <div className="text-xs text-gray-500 mt-1">
              {category.count} items
            </div>
          </button>
        ))}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {filteredProducts.length} Products Found
        </h2>
        <div className="text-sm text-gray-600">
          Showing results for "{searchTerm || "all products"}"
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
          <p className="text-gray-600">
            {searchTerm || selectedCategory !== "all" 
              ? "Try adjusting your search or filters." 
              : "No products are currently available."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pagination.currentData.map((product: Product) => {
              const displayProduct = transformProductForDisplay(product);
              return (
                <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  <div className="relative">
                    <img 
                      src={displayProduct.image} 
                      alt={displayProduct.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Eco: {displayProduct.ecoScore}
                      </span>
                      {displayProduct.discount > 0 && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          -{displayProduct.discount}%
                        </span>
                      )}
                      {!displayProduct.available && (
                        <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs">
                          Unavailable
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={() => handleWishlistToggle(product.id)}
                      className="absolute top-3 left-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                    >
                      <Heart className={`h-4 w-4 ${displayProduct.isWishlisted ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                    </button>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          <span>{displayProduct.distance} away</span>
                          <span>•</span>
                          <span>{displayProduct.deliveryTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">{displayProduct.category}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{displayProduct.rating}</span>
                        <span className="text-sm text-gray-500">({displayProduct.reviews})</span>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2">{displayProduct.name}</h3>
                    
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl font-bold text-gray-900">${displayProduct.price.day}</span>
                        <span className="text-gray-500">/day</span>
                        {displayProduct.discount > 0 && (
                          <span className="text-sm text-gray-400 line-through">
                            ${Math.round(displayProduct.price.day / (1 - displayProduct.discount/100))}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        ${displayProduct.price.week}/week • ${displayProduct.price.month}/month
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1 text-green-600">
                          <Leaf className="h-4 w-4" />
                          <span className="text-sm font-medium">Save {displayProduct.co2Saved} CO₂</span>
                        </div>
                        <div className="text-sm text-blue-600 font-medium">
                          {displayProduct.savings}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        📍 {displayProduct.location}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-xs text-gray-500 mb-1">Key Features:</div>
                      <div className="flex flex-wrap gap-1">
                        {displayProduct.features.slice(0, 2).map((feature, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {feature}
                          </span>
                        ))}
                        {displayProduct.features.length > 2 && (
                          <span className="text-xs text-gray-500">+{displayProduct.features.length - 2} more</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleProductSelect(product)}
                        className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                          displayProduct.available
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                        disabled={!displayProduct.available}
                      >
                        {displayProduct.available ? 'Rent Now' : 'Notify When Available'}
                      </button>
                      <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {filteredProducts.length > 0 && (
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
        </>
      )}
    </div>
  );
};

export default Browse;
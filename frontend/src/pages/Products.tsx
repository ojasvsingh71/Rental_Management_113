import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, Edit, Trash2, Eye, Package, AlertCircle } from "lucide-react";
import { useApi, useMutation } from "../hooks/useApi";
import { productsAPI } from "../services/api";
import ProductCard from "../components/products/ProductCard";
import ProductFilters from "../components/products/ProductFilters";
import Pagination from "../components/common/Pagination";
import { usePagination } from "../hooks/usePagination";

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
  rentalDurations?: Array<{
    id: string;
    duration: string;
    price: number;
  }>;
  availability?: Array<{
    id: string;
    startDate: string;
    endDate: string;
    isBooked: boolean;
  }>;
}

const Products: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category: "",
    unitType: "piece",
    basePrice: 0,
    stock: 1,
    isRentable: true,
  });

  const { 
    data: productsData, 
    loading, 
    error, 
    refetch 
  } = useApi(() => productsAPI.getAll(), { immediate: true });

  const { mutate: createProduct, loading: creating } = useMutation(productsAPI.create);
  const { mutate: updateProduct, loading: updating } = useMutation(
    (data: { id: string; product: any }) => productsAPI.update(data.id, data.product)
  );
  const { mutate: deleteProduct, loading: deleting } = useMutation(productsAPI.delete);

  const products = productsData || [];

  // Filter products based on search and category
  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const pagination = usePagination({ data: filteredProducts, itemsPerPage: 12 });

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProduct(newProduct);
      setShowAddModal(false);
      setNewProduct({
        name: "",
        description: "",
        category: "",
        unitType: "piece",
        basePrice: 0,
        stock: 1,
        isRentable: true,
      });
      refetch();
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    try {
      await updateProduct({ 
        id: editingProduct.id, 
        product: newProduct 
      });
      setEditingProduct(null);
      setNewProduct({
        name: "",
        description: "",
        category: "",
        unitType: "piece",
        basePrice: 0,
        stock: 1,
        isRentable: true,
      });
      refetch();
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        await deleteProduct(product.id);
        refetch();
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description || "",
      category: product.category || "",
      unitType: product.unitType,
      basePrice: product.basePrice,
      stock: product.stock || 1,
      isRentable: product.isRentable,
    });
  };

  const transformProductForCard = (product: Product) => ({
    id: parseInt(product.id),
    name: product.name,
    category: product.category || "Uncategorized",
    image: `https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400`,
    price: {
      hour: Math.round(product.basePrice / 24),
      day: product.basePrice,
      week: Math.round(product.basePrice * 6),
      month: Math.round(product.basePrice * 25),
    },
    stock: product.stock || 1,
    available: product.stock || 1,
    rented: 0,
    ecoScore: 85,
    rating: 4.5,
    totalRentals: 0,
    revenue: "$0",
    condition: "Excellent" as const,
    lastMaintenance: "N/A",
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600">Manage your rental inventory</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <div>
              <h3 className="text-lg font-semibold text-red-900">Error Loading Products</h3>
              <p className="text-red-700">Failed to load products. Please try again.</p>
            </div>
          </div>
          <button
            onClick={refetch}
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600">Manage your rental inventory</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onAddProduct={() => setShowAddModal(true)}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{products.length}</div>
              <div className="text-gray-600">Total Products</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {products.filter((p: Product) => p.isRentable).length}
              </div>
              <div className="text-gray-600">Available</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">0</div>
              <div className="text-gray-600">Rented</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {products.filter((p: Product) => !p.isRentable).length}
              </div>
              <div className="text-gray-600">Unavailable</div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedCategory 
              ? "No products match your current filters." 
              : "Get started by adding your first product."}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Add Product
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pagination.currentData.map((product: Product) => (
              <ProductCard
                key={product.id}
                product={transformProductForCard(product)}
                onEdit={() => openEditModal(product)}
                onViewDetails={(p) => console.log("View details:", p)}
                onDelete={() => handleDeleteProduct(product)}
              />
            ))}
          </div>

          {/* Pagination */}
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
        </>
      )}

      {/* Add/Edit Product Modal */}
      {(showAddModal || editingProduct) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>
            </div>

            <form onSubmit={editingProduct ? handleEditProduct : handleAddProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  <option value="Power Tools">Power Tools</option>
                  <option value="Camping Equipment">Camping Equipment</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Sports Equipment">Sports Equipment</option>
                  <option value="Party Supplies">Party Supplies</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit Type *
                  </label>
                  <select
                    required
                    value={newProduct.unitType}
                    onChange={(e) => setNewProduct({ ...newProduct, unitType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="piece">Piece</option>
                    <option value="set">Set</option>
                    <option value="kit">Kit</option>
                    <option value="unit">Unit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Base Price ($/day) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={newProduct.basePrice}
                    onChange={(e) => setNewProduct({ ...newProduct, basePrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="1"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isRentable"
                  checked={newProduct.isRentable}
                  onChange={(e) => setNewProduct({ ...newProduct, isRentable: e.target.checked })}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="isRentable" className="ml-2 block text-sm text-gray-900">
                  Available for rent
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="submit"
                  disabled={creating || updating}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creating || updating ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProduct(null);
                    setNewProduct({
                      name: "",
                      description: "",
                      category: "",
                      unitType: "piece",
                      basePrice: 0,
                      stock: 1,
                      isRentable: true,
                    });
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
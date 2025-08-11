import React, { useState, useMemo } from 'react';
import { useApi, useMutation } from '../hooks/useApi';
import { productsAPI } from '../services/api';
import ProductCard from '../components/products/ProductCard';
import ProductFilters from '../components/products/ProductFilters';
import Pagination from '../components/common/Pagination';
import { usePagination } from '../hooks/usePagination';
import { Product as ProductType } from '../types';

const Products: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const { data: products, loading, refetch } = useApi(() => productsAPI.getAll());
  const { mutate: deleteProduct } = useMutation((id: string) => productsAPI.delete(id));

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    return products.filter((product: any) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const pagination = usePagination<ProductType>({ 
    data: filteredProducts, 
    itemsPerPage: 12 
  });

  const handleEdit = (product: ProductType) => {
    console.log('Edit product:', product.id);
    // TODO: Open edit modal
  };

  const handleViewDetails = (product: ProductType) => {
    console.log('View product details:', product.id);
    // TODO: Open details modal
  };

  const handleAddProduct = () => {
    console.log('Add new product');
    // TODO: Open add product modal
  };

  const handleDelete = async (product: ProductType) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(product.id.toString());
        refetch();
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-64 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onAddProduct={handleAddProduct}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Products ({pagination.totalItems} found)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {pagination.currentData.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEdit}
              onViewDetails={handleViewDetails}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {pagination.currentData.length === 0 && (
          <div className="text-center py-8 md:py-12">
            <div className="text-gray-500">No products found matching your criteria</div>
          </div>
        )}
      </div>

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
    </div>
  );
};

export default Products;
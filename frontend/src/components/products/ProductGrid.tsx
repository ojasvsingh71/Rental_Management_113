import React from "react";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: any[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  if (!products || products.length === 0) {
    return <div>No products found.</div>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {products.map((product, idx) => (
        <ProductCard key={product.id || idx} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;

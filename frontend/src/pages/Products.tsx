import React, { useEffect, useState } from "react";
import ProductGrid from "../components/products/ProductGrid";

const Products: React.FC = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    day: "",
  });

  useEffect(() => {
    fetch("/api/product")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load products");
        setLoading(false);
      });
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      if (!res.ok) throw new Error("Failed to add product");
      const data = await res.json();
      setProducts((prev) => [...prev, data.product]);
      setShowAdd(false);
      setNewProduct({ name: "", price: "", day: "" });
    } catch {
      setError("Failed to add product");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Products</h2>
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {showAdd ? "Cancel" : "Add Product"}
        </button>
      </div>
      {showAdd && (
        <form onSubmit={handleAddProduct} className="mb-4 flex gap-2">
          <input
            required
            placeholder="Name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            className="border p-2 rounded"
          />
          <input
            required
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            className="border p-2 rounded"
          />
          <input
            required
            placeholder="Day"
            value={newProduct.day}
            onChange={(e) =>
              setNewProduct({ ...newProduct, day: e.target.value })
            }
            className="border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </form>
      )}
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
};

export default Products;

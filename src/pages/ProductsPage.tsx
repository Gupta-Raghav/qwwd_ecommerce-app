import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';
import { productApi } from '../api/productApi';

export const ProductsPage: React.FC = () => {
  const { products, loading, error } = useProducts();
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('name');

  React.useEffect(() => {
    async function fetchCategories() {
      const categoriesData = await productApi.listCategories();
      setCategories(categoriesData);
    }
    fetchCategories();
  }, []);

  if (loading) return <div className="text-center py-10">Loading products...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error loading products: {error.message}</div>;

  // Filter by category if selected
  const filteredProducts = selectedCategory 
    ? products.filter(product => product.categoryId === selectedCategory)
    : products;

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return a.name.localeCompare(b.name); // Default sort by name
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar filters */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h2 className="font-semibold text-lg mb-3">Categories</h2>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left ${!selectedCategory ? 'font-medium text-blue-600' : ''}`}
                >
                  All Categories
                </button>
              </li>
              {categories.map(category => (
                <li key={category.id}>
                  <button 
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left ${selectedCategory === category.id ? 'font-medium text-blue-600' : ''}`}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Product grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">{sortedProducts.length} products</p>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-md px-2 py-1"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
          
          {sortedProducts.length === 0 ? (
            <p className="text-center py-10">No products found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map(product => (
                <Link to={`/products/${product.id}`} key={product.id}>
                  <ProductCard product={product} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';

export const HomePage: React.FC = () => {
  const { products, loading, error } = useProducts();
  
  if (loading) return <div className="text-center py-10">Loading products...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error loading products: {error.message}</div>;

  // Get featured products (just take first 4 for now)
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-8 mb-12">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">Welcome to ShopWave</h1>
          <p className="text-xl mb-6">Discover amazing products at unbeatable prices.</p>
          <Link 
            to="/products" 
            className="inline-block bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link to="/products" className="text-blue-600 hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <Link to={`/products/${product.id}`} key={product.id}>
              <ProductCard product={product} />
            </Link>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-blue-100 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
          <p>On orders over $50</p>
        </div>
        <div className="bg-blue-100 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
          <p>30-day return policy</p>
        </div>
        <div className="bg-blue-100 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
          <p>Your data is protected</p>
        </div>
      </section>
    </div>
  );
};

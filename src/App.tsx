import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { generateClient } from '@aws-amplify/api';
import { type Schema } from '../amplify/data/resource';

// Pages
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutSuccessPage } from './pages/CheckoutSuccessPage';

// Components
import { Header } from './components/Header';

// Context
import { CartProvider } from './context/CartContext';

const client = generateClient<Schema>();

// Mock data for seeding
const mockCategories = [
  { name: "Electronics" },
  { name: "Clothing" },
  { name: "Home & Kitchen" },
  { name: "Books" }
];

const mockProducts = [
  {
    name: "Wireless Headphones",
    description: "Premium noise-cancelling wireless headphones with 30-hour battery life.",
    price: 199.99,
    inventory: 45,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    categoryId: "" // Will be set after categories are created
  },
  {
    name: "Smart Watch",
    description: "Track your fitness, receive notifications, and more with this stylish smart watch.",
    price: 249.99,
    inventory: 32,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    categoryId: "" // Will be set after categories are created
  },
  {
    name: "Cotton T-Shirt",
    description: "Comfortable 100% cotton t-shirt available in multiple colors.",
    price: 19.99,
    inventory: 100,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    categoryId: "" // Will be set after categories are created
  },
  {
    name: "Coffee Maker",
    description: "Programmable coffee maker with 12-cup capacity and built-in grinder.",
    price: 89.99,
    inventory: 15,
    imageUrl: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6",
    categoryId: "" // Will be set after categories are created
  },
  {
    name: "Bestselling Novel",
    description: "The latest bestselling fiction novel that everyone is talking about.",
    price: 14.99,
    inventory: 200,
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
    categoryId: "" // Will be set after categories are created
  },
  {
    name: "Bluetooth Speaker",
    description: "Portable waterproof Bluetooth speaker with 24-hour battery life.",
    price: 79.99,
    inventory: 50,
    imageUrl: "https://images.unsplash.com/photo-1558537348-c0f8e733989d",
    categoryId: "" // Will be set after categories are created
  }
];

function App() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedingComplete, setSeedingComplete] = useState(false);
  const [seedingError, setSeedingError] = useState<Error | null>(null);

  useEffect(() => {
    const seedDatabase = async () => {
      // Check if we've already seeded the database in this session
      const hasSeeded = sessionStorage.getItem('dbSeeded');
      if (hasSeeded === 'true') {
        console.log('Database already seeded in this session');
        return;
      }

      setIsSeeding(true);
      setSeedingError(null);

      try {
        // First check if we already have data to avoid duplicates
        const { data: existingCategories, errors: listCatErrors } = await client.models.Category.list({
          limit: 1
        });

        if (listCatErrors) {
          throw new Error(`Error checking existing categories: ${listCatErrors[0].message}`);
        }

        // If we already have data, don't seed
        if (existingCategories.length > 0) {
          console.log('Database already has data, skipping seed');
          sessionStorage.setItem('dbSeeded', 'true');
          setIsSeeding(false);
          setSeedingComplete(true);
          return;
        }

        console.log('Seeding database with mock data...');

        // Create categories first
        const categoryIds: Record<string, string> = {};
        for (const category of mockCategories) {
          const { data: newCategory, errors: createCatErrors } = await client.models.Category.create({
            name: category.name
          });

          if (createCatErrors) {
            throw new Error(`Error creating category: ${createCatErrors[0].message}`);
          }

          categoryIds[category.name] = newCategory.id;
        }

        // Assign categories to products
        mockProducts[0].categoryId = categoryIds["Electronics"]; // Headphones
        mockProducts[1].categoryId = categoryIds["Electronics"]; // Smart Watch
        mockProducts[2].categoryId = categoryIds["Clothing"]; // T-Shirt
        mockProducts[3].categoryId = categoryIds["Home & Kitchen"]; // Coffee Maker
        mockProducts[4].categoryId = categoryIds["Books"]; // Novel
        mockProducts[5].categoryId = categoryIds["Electronics"]; // Speaker

        // Create products
        for (const product of mockProducts) {
          const { errors: createProdErrors } = await client.models.Product.create(product);

          if (createProdErrors) {
            throw new Error(`Error creating product: ${createProdErrors[0].message}`);
          }
        }

        console.log(`Successfully seeded database with ${mockCategories.length} categories and ${mockProducts.length} products`);
        sessionStorage.setItem('dbSeeded', 'true');
        setSeedingComplete(true);
      } catch (error) {
        console.error('Error seeding database:', error);
        setSeedingError(error instanceof Error ? error : new Error('Unknown error during seeding'));
      } finally {
        setIsSeeding(false);
      }
    };

    seedDatabase();
  }, []);

  return (
    <Authenticator.Provider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Header />
            <main>
              {isSeeding ? (
                <div className="container mx-auto px-4 py-8 text-center">
                  <p>Setting up the store...</p>
                </div>
              ) : seedingError ? (
                <div className="container mx-auto px-4 py-8 text-center text-red-500">
                  <p>Error setting up the store: {seedingError.message}</p>
                </div>
              ) : (
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
                </Routes>
              )}
            </main>
            <footer className="bg-gray-800 text-white py-8 mt-12">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">ShopWave</h3>
                    <p className="text-gray-400">Your one-stop shop for all your needs.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                      <li><a href="/" className="text-gray-400 hover:text-white">Home</a></li>
                      <li><a href="/products" className="text-gray-400 hover:text-white">Products</a></li>
                      <li><a href="/cart" className="text-gray-400 hover:text-white">Cart</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Contact</h3>
                    <p className="text-gray-400">Email: info@shopwave.com</p>
                    <p className="text-gray-400">Phone: (123) 456-7890</p>
                  </div>
                </div>
                <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
                  <p>&copy; {new Date().getFullYear()} ShopWave. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </div>
        </Router>
      </CartProvider>
    </Authenticator.Provider>
  );
}

export default App;

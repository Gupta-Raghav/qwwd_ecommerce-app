import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { Auth } from 'aws-amplify';

export const Header: React.FC = () => {
  const { itemCount } = useCart();
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const userData = await Auth.currentAuthenticatedUser();
      setUser(userData);
    } catch (e) {
      setUser(null);
    }
  }

  async function signOut() {
    try {
      await Auth.signOut();
      setUser(null);
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">ShopWave</Link>
        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-blue-200 transition-colors">Home</Link>
          <Link to="/products" className="hover:text-blue-200 transition-colors">Products</Link>
          <Link to="/cart" className="relative hover:text-blue-200 transition-colors">
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex items-center space-x-4">
              <span>Hello, {user.attributes?.email}</span>
              <button 
                onClick={signOut}
                className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { CartItem } from '../components/CartItem';
import { Auth } from 'aws-amplify';
import { cartApi } from '../api/cartApi';

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, getTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      // Check if user is authenticated
      const user = await Auth.currentAuthenticatedUser();
      
      // Prepare order items
      const orderItems = cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      }));

      // Create order
      const order = await cartApi.createOrder(user.attributes.sub, orderItems, getTotal());
      
      if (order) {
        clearCart();
        navigate('/checkout/success');
      } else {
        throw new Error('Failed to create order');
      }
    } catch (err) {
      if (err.name === 'NotAuthorizedException' || err.name === 'NoUserPoolException') {
        // User is not authenticated, redirect to login
        navigate('/login', { state: { from: '/cart' } });
      } else {
        setError('An error occurred during checkout. Please try again.');
        console.error('Checkout error:', err);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <p className="mb-6">Your cart is empty.</p>
        <Link 
          to="/products" 
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            {cart.map(item => (
              <CartItem 
                key={item.product.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>
        </div>
        
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${(getTotal() * 0.1).toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2 font-semibold flex justify-between">
                <span>Total</span>
                <span>${(getTotal() * 1.1).toFixed(2)}</span>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className={`w-full py-3 px-6 rounded-md font-medium text-white mb-4
                ${isProcessing ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} 
                transition-colors`}
            >
              {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
            </button>
            
            <Link 
              to="/products" 
              className="block text-center text-blue-600 hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

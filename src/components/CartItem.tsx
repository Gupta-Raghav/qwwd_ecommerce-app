import React from 'react';
import { CartItem as CartItemType } from '../hooks/useCart';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  const { product, quantity } = item;

  return (
    <div className="flex items-center py-4 border-b border-gray-200">
      <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-md">
        <img 
          src={product.imageUrl || `https://source.unsplash.com/random/100x100?product=${product.id}`} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="ml-4 flex-1">
        <h3 className="text-base font-medium text-gray-800">{product.name}</h3>
        <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center">
        <button 
          onClick={() => onUpdateQuantity(product.id, quantity - 1)}
          className="text-gray-500 focus:outline-none focus:text-gray-600 p-1"
        >
          -
        </button>
        <input
          type="text"
          value={quantity}
          readOnly
          className="mx-2 border text-center w-12 rounded-md"
        />
        <button 
          onClick={() => onUpdateQuantity(product.id, quantity + 1)}
          className="text-gray-500 focus:outline-none focus:text-gray-600 p-1"
        >
          +
        </button>
      </div>
      <div className="ml-4 text-base font-medium text-gray-800">
        ${(product.price * quantity).toFixed(2)}
      </div>
      <button 
        onClick={() => onRemove(product.id)}
        className="ml-4 text-red-500 hover:text-red-700"
      >
        Remove
      </button>
    </div>
  );
};

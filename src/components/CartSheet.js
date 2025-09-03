"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  ShoppingBagIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency, getImageUrl } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function CartSheet({ isOpen, onClose }) {
  const { 
    cartItems, 
    cartProducts, 
    updateItem, 
    removeItem, 
    getCartTotal, 
    getCartCount,
    loading 
  } = useCart();

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }
    
    try {
      await updateItem(itemId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeItem(itemId);
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };

  const getItemTotal = (item) => {
    const product = cartProducts.find(p => p.$id === item.productId);
    if (!product) return 0;
    const price = product.salePrice || product.price;
    return price * item.quantity;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          
          {/* Cart Sheet */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center">
                <ShoppingBagIcon className="h-6 w-6 text-gray-700 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Shopping Cart ({getCartCount()})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBagIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Add some products to get started
                  </p>
                  <button
                    onClick={onClose}
                    className="bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => {
                    const product = cartProducts.find(p => p.$id === item.productId);
                    if (!product) return null;

                    return (
                      <motion.div
                        key={`${item.productId}-${item.size}-${item.color}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                      >
                        {/* Product Image */}
                        <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-gray-200">
                          <Image
                            src={getImageUrl(product.images?.[0]) || '/placeholder-product.jpg'}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">
                            {product.name}
                          </h3>
                          <div className="text-sm text-gray-600">
                            {item.size && <span>Size: {item.size}</span>}
                            {item.color && <span className="ml-2">Color: {item.color}</span>}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-2">
                              {product.salePrice ? (
                                <>
                                  <span className="font-medium text-rose-600">
                                    {formatCurrency(product.salePrice)}
                                  </span>
                                  <span className="text-sm text-gray-500 line-through">
                                    {formatCurrency(product.price)}
                                  </span>
                                </>
                              ) : (
                                <span className="font-medium text-gray-900">
                                  {formatCurrency(product.price)}
                                </span>
                              )}
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency(getItemTotal(item))}
                            </div>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex flex-col items-center space-y-2">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => handleUpdateQuantity(item.id || item.$id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-100 transition-colors"
                            >
                              <MinusIcon className="h-4 w-4" />
                            </button>
                            <span className="px-3 py-1 text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id || item.$id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-100 transition-colors"
                            >
                              <PlusIcon className="h-4 w-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id || item.$id)}
                            className="p-1 text-red-500 hover:text-red-700 transition-colors"
                            title="Remove item"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t p-6 space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(getCartTotal())}</span>
                </div>

                {/* Shipping Info */}
                <div className="text-sm text-gray-600 text-center">
                  {getCartTotal() >= 200 ? (
                    <span className="text-green-600">🎉 Free shipping!</span>
                  ) : (
                    <span>
                      Add {formatCurrency(200 - getCartTotal())} more for free shipping
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link
                    href="/cart"
                    onClick={onClose}
                    className="block w-full text-center border border-rose-600 text-rose-600 py-3 rounded-lg hover:bg-rose-50 transition-colors font-medium"
                  >
                    View Cart
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="block w-full text-center bg-rose-600 text-white py-3 rounded-lg hover:bg-rose-700 transition-colors font-medium"
                  >
                    Checkout
                  </Link>
                </div>

                {/* Continue Shopping */}
                <button
                  onClick={onClose}
                  className="w-full text-center text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

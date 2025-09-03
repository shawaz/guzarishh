"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { addToCart, getCartItems, updateCartItem, removeFromCart } from '@/lib/database';
import { getProduct } from '@/lib/database';
import toast from 'react-hot-toast';

const CartContext = createContext({});

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadCartItems();
    } else {
      // Load from localStorage for guest users
      loadGuestCart();
    }
  }, [user]);

  const loadCartItems = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await getCartItems(user.$id);
      const items = response.documents || [];
      setCartItems(items);
      
      // Load product details for each cart item
      const productPromises = items.map(item => getProduct(item.productId));
      const products = await Promise.all(productPromises);
      setCartProducts(products);
    } catch (error) {
      console.error('Error loading cart items:', error);
      toast.error('Failed to load cart items');
    } finally {
      setLoading(false);
    }
  };

  const loadGuestCart = () => {
    try {
      const guestCart = localStorage.getItem('guestCart');
      if (guestCart) {
        const items = JSON.parse(guestCart);
        setCartItems(items);
        
        // Load product details
        const productPromises = items.map(item => getProduct(item.productId));
        Promise.all(productPromises).then(products => {
          setCartProducts(products);
        });
      }
    } catch (error) {
      console.error('Error loading guest cart:', error);
    }
  };

  const saveGuestCart = (items) => {
    try {
      localStorage.setItem('guestCart', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving guest cart:', error);
    }
  };

  const addItem = async (productId, quantity = 1, size = null, color = null) => {
    try {
      if (user) {
        // Authenticated user - save to database
        const newItem = await addToCart(user.$id, productId, quantity, size, color);
        await loadCartItems(); // Reload cart
        toast.success('Added to cart!');
      } else {
        // Guest user - save to localStorage
        const existingItemIndex = cartItems.findIndex(
          item => item.productId === productId && item.size === size && item.color === color
        );

        let updatedItems;
        if (existingItemIndex >= 0) {
          // Update existing item
          updatedItems = [...cartItems];
          updatedItems[existingItemIndex].quantity += quantity;
        } else {
          // Add new item
          const newItem = {
            id: Date.now().toString(),
            productId,
            quantity,
            size,
            color,
            addedAt: new Date().toISOString()
          };
          updatedItems = [...cartItems, newItem];
        }

        setCartItems(updatedItems);
        saveGuestCart(updatedItems);
        
        // Load product details
        const product = await getProduct(productId);
        const existingProductIndex = cartProducts.findIndex(p => p.$id === productId);
        if (existingProductIndex === -1) {
          setCartProducts(prev => [...prev, product]);
        }
        
        toast.success('Added to cart!');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const updateItem = async (itemId, quantity) => {
    try {
      if (user) {
        // Authenticated user
        await updateCartItem(itemId, quantity);
        await loadCartItems();
      } else {
        // Guest user
        const updatedItems = cartItems.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        );
        setCartItems(updatedItems);
        saveGuestCart(updatedItems);
      }
      toast.success('Cart updated!');
    } catch (error) {
      console.error('Error updating cart item:', error);
      toast.error('Failed to update cart');
    }
  };

  const removeItem = async (itemId) => {
    try {
      if (user) {
        // Authenticated user
        await removeFromCart(itemId);
        await loadCartItems();
      } else {
        // Guest user
        const updatedItems = cartItems.filter(item => item.id !== itemId);
        setCartItems(updatedItems);
        saveGuestCart(updatedItems);
        
        // Remove product if no longer in cart
        const productStillInCart = updatedItems.some(item => 
          cartProducts.some(product => product.$id === item.productId)
        );
        if (!productStillInCart) {
          setCartProducts(prev => prev.filter(product => 
            updatedItems.some(item => item.productId === product.$id)
          ));
        }
      }
      toast.success('Removed from cart!');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove from cart');
    }
  };

  const clearCart = async () => {
    try {
      if (user) {
        // Remove all items for authenticated user
        const removePromises = cartItems.map(item => removeFromCart(item.$id));
        await Promise.all(removePromises);
      } else {
        // Clear guest cart
        localStorage.removeItem('guestCart');
      }
      
      setCartItems([]);
      setCartProducts([]);
      toast.success('Cart cleared!');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const product = cartProducts.find(p => p.$id === item.productId);
      if (product) {
        const price = product.salePrice || product.price;
        return total + (price * item.quantity);
      }
      return total;
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    cartProducts,
    loading,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    getCartTotal,
    getCartCount,
    loadCartItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  HeartIcon, 
  ShoppingBagIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { getProduct } from '@/lib/database';
import { formatCurrency, getImageUrl } from '@/lib/utils';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addItem } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }
    loadWishlist();
  }, [user, router]);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      
      // For now, use localStorage to store wishlist
      // In production, this should be stored in the database
      const savedWishlist = localStorage.getItem(`wishlist_${user.$id}`);
      const wishlistIds = savedWishlist ? JSON.parse(savedWishlist) : [];
      
      setWishlistItems(wishlistIds);
      
      // Load product details for each wishlist item
      if (wishlistIds.length > 0) {
        const productPromises = wishlistIds.map(id => getProduct(id));
        const products = await Promise.all(productPromises);
        setWishlistProducts(products.filter(p => p !== null));
      } else {
        setWishlistProducts([]);
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = (productId) => {
    try {
      const updatedWishlist = wishlistItems.filter(id => id !== productId);
      setWishlistItems(updatedWishlist);
      setWishlistProducts(prev => prev.filter(p => p.$id !== productId));
      
      // Update localStorage
      localStorage.setItem(`wishlist_${user.$id}`, JSON.stringify(updatedWishlist));
      
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  const addToCart = async (productId) => {
    try {
      await addItem(productId, 1);
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/account" className="text-gray-600 hover:text-gray-900">
              ← Back to Account
            </Link>
            <h1 className="text-2xl font-bold font-[Playfair_Display] text-gray-900">
              My Wishlist
            </h1>
            <div className="flex items-center text-gray-600">
              <HeartSolidIcon className="h-5 w-5 text-rose-500 mr-2" />
              {wishlistItems.length} items
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
          </div>
        ) : wishlistProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <HeartIcon className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start adding products you love to your wishlist. You can save items for later and easily find them here.
            </p>
            <Link
              href="/"
              className="inline-block bg-rose-600 text-white px-8 py-3 rounded-full hover:bg-rose-700 transition-colors font-medium"
            >
              Continue Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistProducts.map((product, index) => (
              <motion.div
                key={product.$id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={getImageUrl(product.images?.[0]) || '/placeholder-product.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Remove from wishlist button */}
                  <button
                    onClick={() => removeFromWishlist(product.$id)}
                    className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                    title="Remove from wishlist"
                  >
                    <TrashIcon className="h-5 w-5 text-red-500" />
                  </button>
                  
                  {/* Sale badge */}
                  {product.salePrice && (
                    <div className="absolute top-4 left-4 bg-rose-500 text-white px-2 py-1 rounded text-sm font-medium">
                      Sale
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {product.salePrice ? (
                        <>
                          <span className="text-lg font-bold text-rose-600">
                            {formatCurrency(product.salePrice)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            {formatCurrency(product.price)}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">
                          {formatCurrency(product.price)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => addToCart(product.$id)}
                      className="flex-1 bg-rose-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-rose-700 transition-colors flex items-center justify-center"
                    >
                      <ShoppingBagIcon className="h-4 w-4 mr-2" />
                      Add to Cart
                    </button>
                    <Link
                      href={`/products/${product.$id}`}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Continue Shopping */}
        {wishlistProducts.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/"
              className="inline-block border border-rose-600 text-rose-600 px-8 py-3 rounded-full hover:bg-rose-50 transition-colors font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

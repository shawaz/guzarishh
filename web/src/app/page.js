"use client";

import "./app.css";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBagIcon, HeartIcon, UserIcon, MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { getProducts, getCategories } from "@/lib/database";
import { formatCurrency, getImageUrl } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useAdmin } from "@/contexts/AdminContext";
import LoginModal from "@/components/auth/LoginModal";
import RegisterModal from "@/components/auth/RegisterModal";
import CartSheet from "@/components/CartSheet";
import toast from "react-hot-toast";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showCartSheet, setShowCartSheet] = useState(false);

  const { user, logout } = useAuth();
  const { getCartCount, addItem } = useCart();
  const { isAdmin, loading: adminLoading } = useAdmin();

  // Debug logging
  useEffect(() => {
    console.log('Homepage - User:', user);
    console.log('Homepage - Is Admin:', isAdmin);
    console.log('Homepage - Admin Loading:', adminLoading);
  }, [user, isAdmin, adminLoading]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      // Load categories and products
      const [categoriesResponse, productsResponse] = await Promise.all([
        getCategories(),
        getProducts(12) // Load first 12 products
      ]);

      setCategories(categoriesResponse.documents || []);
      setProducts(productsResponse.documents || []);

      // Set featured products (first 6)
      setFeaturedProducts(productsResponse.documents?.slice(0, 6) || []);

    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = (productId) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    setWishlist(prev => {
      const newWishlist = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];

      // Save to localStorage
      localStorage.setItem(`wishlist_${user.$id}`, JSON.stringify(newWishlist));

      if (prev.includes(productId)) {
        toast.success('Removed from wishlist');
      } else {
        toast.success('Added to wishlist');
      }

      return newWishlist;
    });
  };

  const handleAddToCart = async (productId) => {
    try {
      await addItem(productId, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleAuthClick = () => {
    if (user) {
      logout();
    } else {
      setShowLoginModal(true);
    }
  };

  // Close modals when user logs in and load wishlist
  useEffect(() => {
    if (user) {
      setShowLoginModal(false);
      setShowRegisterModal(false);

      // Load user's wishlist from localStorage
      const savedWishlist = localStorage.getItem(`wishlist_${user.$id}`);
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } else {
      setWishlist([]);
    }
  }, [user]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <h1 className="text-2xl font-bold font-[Playfair_Display] text-rose-600">
                  गुज़ारिश
                </h1>
                <span className="ml-2 text-sm text-gray-500 hidden sm:block">Guzarishh</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/collections" className="text-gray-700 hover:text-rose-600 transition-colors">
                Collections
              </Link>
              <Link href="/sarees" className="text-gray-700 hover:text-rose-600 transition-colors">
                Sarees
              </Link>
              <Link href="/lehengas" className="text-gray-700 hover:text-rose-600 transition-colors">
                Lehengas
              </Link>
              <Link href="/suits" className="text-gray-700 hover:text-rose-600 transition-colors">
                Suits
              </Link>
              <Link href="/accessories" className="text-gray-700 hover:text-rose-600 transition-colors">
                Accessories
              </Link>
            </nav>

            {/* Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for sarees, lehengas..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              {user && (
                <Link
                  href="/admin-test"
                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full hover:bg-blue-700 transition-colors"
                >
                  Debug
                </Link>
              )}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-sm bg-rose-600 text-white px-3 py-1 rounded-full hover:bg-rose-700 transition-colors"
                >
                  Admin
                </Link>
              )}
              {user ? (
                <Link
                  href="/account"
                  className="p-2 text-gray-700 hover:text-rose-600 transition-colors"
                  title={`Account - ${user.name}`}
                >
                  <UserIcon className="h-6 w-6" />
                </Link>
              ) : (
                <button
                  onClick={handleAuthClick}
                  className="p-2 text-gray-700 hover:text-rose-600 transition-colors"
                  title="Login"
                >
                  <UserIcon className="h-6 w-6" />
                </button>
              )}
              <button className="p-2 text-gray-700 hover:text-rose-600 transition-colors relative">
                <HeartIcon className="h-6 w-6" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowCartSheet(true)}
                className="p-2 text-gray-700 hover:text-rose-600 transition-colors relative"
              >
                <ShoppingBagIcon className="h-6 w-6" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 text-gray-700"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-2 space-y-2">
              <Link href="/collections" className="block py-2 text-gray-700">Collections</Link>
              <Link href="/sarees" className="block py-2 text-gray-700">Sarees</Link>
              <Link href="/lehengas" className="block py-2 text-gray-700">Lehengas</Link>
              <Link href="/suits" className="block py-2 text-gray-700">Suits</Link>
              <Link href="/accessories" className="block py-2 text-gray-700">Accessories</Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-rose-100 via-pink-50 to-orange-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl md:text-6xl font-bold font-[Playfair_Display] text-gray-900 mb-6">
                Exquisite
                <span className="text-rose-600 block">Indian Fashion</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Discover the finest collection of traditional Indian women's clothing.
                From elegant sarees to stunning lehengas, find your perfect ethnic ensemble.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/collections"
                  className="bg-rose-600 text-white px-8 py-3 rounded-full hover:bg-rose-700 transition-colors font-medium"
                >
                  Shop Collection
                </Link>
                <Link
                  href="/about"
                  className="border border-rose-600 text-rose-600 px-8 py-3 rounded-full hover:bg-rose-50 transition-colors font-medium"
                >
                  Our Story
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/hero-image.jpg"
                  alt="Beautiful Indian woman in traditional saree"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-white p-4 rounded-full shadow-lg"
              >
                <HeartSolidIcon className="h-6 w-6 text-rose-500" />
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                className="absolute -bottom-4 -left-4 bg-white p-4 rounded-full shadow-lg"
              >
                <span className="text-2xl">✨</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-[Playfair_Display] text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our curated collection of traditional Indian wear
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Sarees', image: '/category-sarees.jpg', href: '/sarees' },
              { name: 'Lehengas', image: '/category-lehengas.jpg', href: '/lehengas' },
              { name: 'Suits', image: '/category-suits.jpg', href: '/suits' },
              { name: 'Accessories', image: '/category-accessories.jpg', href: '/accessories' }
            ].map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <Link href={category.href}>
                  <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
                  </div>
                  <h3 className="text-lg font-semibold text-center text-gray-900 group-hover:text-rose-600 transition-colors">
                    {category.name}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-[Playfair_Display] text-gray-900 mb-4">
              Featured Collection
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Handpicked pieces that celebrate the beauty of Indian craftsmanship
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-64 bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.$id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={getImageUrl(product.images?.[0]) || '/placeholder-product.jpg'}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={() => toggleWishlist(product.$id)}
                      className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                    >
                      {wishlist.includes(product.$id) ? (
                        <HeartSolidIcon className="h-5 w-5 text-rose-500" />
                      ) : (
                        <HeartIcon className="h-5 w-5 text-gray-600" />
                      )}
                    </button>
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
                    <div className="flex items-center justify-between">
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
                      <button
                        onClick={() => handleAddToCart(product.$id)}
                        className="bg-rose-600 text-white px-4 py-2 rounded-full text-sm hover:bg-rose-700 transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/collections"
              className="inline-block bg-rose-600 text-white px-8 py-3 rounded-full hover:bg-rose-700 transition-colors font-medium"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-rose-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold font-[Playfair_Display] text-white mb-4">
            Stay Updated with Latest Collections
          </h2>
          <p className="text-rose-100 mb-8 max-w-2xl mx-auto">
            Be the first to know about new arrivals, exclusive offers, and fashion tips
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-rose-600 px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold font-[Playfair_Display] text-rose-400 mb-4">
                गुज़ारिश
              </h3>
              <p className="text-gray-400 mb-4">
                Celebrating the timeless beauty of Indian fashion with modern elegance.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Pinterest</a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/sarees" className="hover:text-white transition-colors">Sarees</Link></li>
                <li><Link href="/lehengas" className="hover:text-white transition-colors">Lehengas</Link></li>
                <li><Link href="/suits" className="hover:text-white transition-colors">Suits</Link></li>
                <li><Link href="/accessories" className="hover:text-white transition-colors">Accessories</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Customer Care</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
                <li><Link href="/returns" className="hover:text-white transition-colors">Returns</Link></li>
                <li><Link href="/size-guide" className="hover:text-white transition-colors">Size Guide</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">Our Story</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Guzarishh. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Authentication Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />

      {/* Cart Sheet */}
      <CartSheet
        isOpen={showCartSheet}
        onClose={() => setShowCartSheet(false)}
      />
    </div>
  );
}

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format currency
export const formatCurrency = (amount, currency = 'AED') => {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

// Format date
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Generate slug from string
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

// Calculate discount percentage
export const calculateDiscountPercentage = (originalPrice, salePrice) => {
  if (!originalPrice || !salePrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (UAE format)
export const isValidPhone = (phone) => {
  const phoneRegex = /^(\+971|00971|971)?[0-9]{8,9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Generate order ID
export const generateOrderId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `GZ-${timestamp}-${randomStr}`.toUpperCase();
};

// Calculate cart total
export const calculateCartTotal = (cartItems, products) => {
  return cartItems.reduce((total, item) => {
    const product = products.find(p => p.$id === item.productId);
    if (product) {
      const price = product.salePrice || product.price;
      return total + (price * item.quantity);
    }
    return total;
  }, 0);
};

// Get image URL from Appwrite
export const getImageUrl = (fileId) => {
  if (!fileId) return '/placeholder-image.jpg';
  return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Size options for Indian clothing
export const CLOTHING_SIZES = [
  { value: 'XS', label: 'XS (32)' },
  { value: 'S', label: 'S (34)' },
  { value: 'M', label: 'M (36)' },
  { value: 'L', label: 'L (38)' },
  { value: 'XL', label: 'XL (40)' },
  { value: 'XXL', label: 'XXL (42)' },
  { value: 'XXXL', label: 'XXXL (44)' },
];

// Indian clothing categories
export const CLOTHING_CATEGORIES = [
  'Sarees',
  'Lehengas',
  'Salwar Kameez',
  'Kurtis',
  'Anarkali Suits',
  'Indo-Western',
  'Blouses',
  'Dupattas',
  'Palazzo Sets',
  'Sharara Sets',
  'Accessories'
];

// Color options
export const COLOR_OPTIONS = [
  { name: 'Red', value: 'red', hex: '#DC2626' },
  { name: 'Pink', value: 'pink', hex: '#EC4899' },
  { name: 'Orange', value: 'orange', hex: '#EA580C' },
  { name: 'Yellow', value: 'yellow', hex: '#EAB308' },
  { name: 'Green', value: 'green', hex: '#16A34A' },
  { name: 'Blue', value: 'blue', hex: '#2563EB' },
  { name: 'Purple', value: 'purple', hex: '#9333EA' },
  { name: 'Black', value: 'black', hex: '#000000' },
  { name: 'White', value: 'white', hex: '#FFFFFF' },
  { name: 'Gold', value: 'gold', hex: '#D4AF37' },
  { name: 'Silver', value: 'silver', hex: '#C0C0C0' },
  { name: 'Maroon', value: 'maroon', hex: '#7F1D1D' },
];

// Order status options
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURNED: 'returned'
};

// Payment status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

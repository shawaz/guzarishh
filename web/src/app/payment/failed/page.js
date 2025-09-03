"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function PaymentFailedPage() {
  const [orderDetails, setOrderDetails] = useState(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    const reason = searchParams.get('reason') || 'Payment was declined or cancelled';
    
    if (orderId) {
      setOrderDetails({
        orderId,
        reason
      });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6"
          >
            <XCircleIcon className="h-10 w-10 text-red-600" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-3xl font-bold font-[Playfair_Display] text-gray-900 mb-4">
              Payment Failed
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              We're sorry, but your payment could not be processed at this time.
            </p>

            {orderDetails && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Order Information
                </h2>
                <div className="text-left space-y-2">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-semibold text-gray-900">{orderDetails.orderId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Reason</p>
                    <p className="font-semibold text-red-600">{orderDetails.reason}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Common reasons for payment failure:
                </h3>
                <ul className="text-sm text-blue-800 text-left space-y-1">
                  <li>• Insufficient funds in your account</li>
                  <li>• Incorrect card details entered</li>
                  <li>• Card expired or blocked</li>
                  <li>• Bank security restrictions</li>
                  <li>• Network connectivity issues</li>
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/checkout"
                  className="bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700 transition-colors font-medium inline-flex items-center justify-center"
                >
                  <ArrowPathIcon className="h-5 w-5 mr-2" />
                  Try Again
                </Link>
                <Link
                  href="/cart"
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Review Cart
                </Link>
                <Link
                  href="/"
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Need Help?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Contact Customer Support
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Our team is here to help you complete your purchase.
              </p>
              <Link
                href="/contact"
                className="text-rose-600 hover:text-rose-700 font-medium text-sm"
              >
                Get Support →
              </Link>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Alternative Payment Methods
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Try using a different card or payment method.
              </p>
              <Link
                href="/checkout"
                className="text-rose-600 hover:text-rose-700 font-medium text-sm"
              >
                Try Different Method →
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            What You Can Do Next
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-gray-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-gray-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Check Card Details</h3>
              <p className="text-sm text-gray-600">
                Verify your card number, expiry date, and CVV are correct.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-gray-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Contact Your Bank</h3>
              <p className="text-sm text-gray-600">
                Ensure your card is activated for online transactions.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-gray-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Try Again</h3>
              <p className="text-sm text-gray-600">
                Return to checkout and attempt the payment again.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-600 mb-4">
            Your items are still saved in your cart
          </p>
          <Link
            href="/cart"
            className="text-rose-600 hover:text-rose-700 font-medium"
          >
            View Cart →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { verifyTelrPayment } from '@/lib/telr';
import { updateOrderStatus } from '@/lib/database';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const [verifying, setVerifying] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      const orderId = searchParams.get('orderId');
      const cartId = searchParams.get('cartid');
      const reference = searchParams.get('ref');

      if (!orderId || !cartId || !reference) {
        throw new Error('Missing payment parameters');
      }

      // Verify payment with Telr
      const verification = await verifyTelrPayment(cartId, reference);
      
      if (verification.success && verification.status === 'A') {
        // Payment successful, update order status
        await updateOrderStatus(orderId, 'confirmed');
        setPaymentVerified(true);
        setOrderDetails({
          orderId,
          amount: verification.amount,
          currency: verification.currency,
          transactionId: verification.transactionId
        });
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      // Redirect to failure page
      router.push('/payment/failed');
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Verifying Payment...
          </h2>
          <p className="text-gray-600">
            Please wait while we confirm your payment
          </p>
        </div>
      </div>
    );
  }

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
            className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6"
          >
            <CheckCircleIcon className="h-10 w-10 text-green-600" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-3xl font-bold font-[Playfair_Display] text-gray-900 mb-4">
              Payment Successful!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Thank you for your order. Your payment has been processed successfully.
            </p>

            {orderDetails && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Order Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-semibold text-gray-900">{orderDetails.orderId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Transaction ID</p>
                    <p className="font-semibold text-gray-900">{orderDetails.transactionId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Amount Paid</p>
                    <p className="font-semibold text-gray-900">
                      {orderDetails.currency} {orderDetails.amount}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Status</p>
                    <p className="font-semibold text-green-600">Confirmed</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <p className="text-gray-600">
                You will receive an order confirmation email shortly. 
                Your items will be processed and shipped within 2-3 business days.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/orders"
                  className="bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700 transition-colors font-medium"
                >
                  View Order Details
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
            What's Next?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-rose-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-rose-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Order Processing</h3>
              <p className="text-sm text-gray-600">
                We'll prepare your items with care and attention to detail.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-rose-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-rose-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Quality Check</h3>
              <p className="text-sm text-gray-600">
                Each item is carefully inspected before packaging.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-rose-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-rose-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-sm text-gray-600">
                Your order will be shipped and delivered to your doorstep.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-600 mb-4">
            Need help with your order?
          </p>
          <Link
            href="/contact"
            className="text-rose-600 hover:text-rose-700 font-medium"
          >
            Contact our customer support team
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

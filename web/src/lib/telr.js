import axios from 'axios';
import { generateOrderId } from './utils';

const TELR_API_URL = process.env.NEXT_PUBLIC_TELR_TEST_MODE === 'true' 
  ? 'https://secure.telr.com/gateway/order.json' 
  : 'https://secure.telr.com/gateway/order.json';

// Create Telr payment request
export const createTelrPayment = async (orderData) => {
  try {
    const {
      amount,
      currency = 'AED',
      description,
      customerEmail,
      customerName,
      customerPhone,
      orderId,
      returnUrl,
      cancelUrl
    } = orderData;

    const telrRequest = {
      method: 'create',
      store: process.env.NEXT_PUBLIC_TELR_STORE_ID,
      authkey: process.env.TELR_AUTH_KEY,
      order: {
        cartid: orderId || generateOrderId(),
        test: process.env.NEXT_PUBLIC_TELR_TEST_MODE === 'true' ? 1 : 0,
        amount: amount.toFixed(2),
        currency: currency,
        description: description || 'Guzarishh Purchase'
      },
      customer: {
        email: customerEmail,
        name: {
          forenames: customerName.split(' ')[0] || '',
          surname: customerName.split(' ').slice(1).join(' ') || ''
        },
        phone: customerPhone
      },
      return: {
        authorised: returnUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success`,
        declined: cancelUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/payment/failed`,
        cancelled: cancelUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/payment/cancelled`
      }
    };

    const response = await axios.post(TELR_API_URL, telrRequest, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.order && response.data.order.url) {
      return {
        success: true,
        paymentUrl: response.data.order.url,
        orderId: response.data.order.cartid,
        reference: response.data.order.ref
      };
    } else {
      throw new Error('Invalid response from Telr');
    }
  } catch (error) {
    console.error('Telr payment creation error:', error);
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message || 'Payment creation failed'
    };
  }
};

// Verify Telr payment status
export const verifyTelrPayment = async (cartId, reference) => {
  try {
    const telrRequest = {
      method: 'check',
      store: process.env.NEXT_PUBLIC_TELR_STORE_ID,
      authkey: process.env.TELR_AUTH_KEY,
      order: {
        cartid: cartId,
        ref: reference
      }
    };

    const response = await axios.post(TELR_API_URL, telrRequest, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.order) {
      const order = response.data.order;
      return {
        success: true,
        status: order.status, // A = Authorised, H = Hold, D = Declined, C = Cancelled
        amount: order.amount,
        currency: order.currency,
        reference: order.ref,
        transactionId: order.transaction?.ref,
        cardLast4: order.transaction?.card?.last4,
        cardType: order.transaction?.card?.type
      };
    } else {
      throw new Error('Invalid response from Telr');
    }
  } catch (error) {
    console.error('Telr payment verification error:', error);
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message || 'Payment verification failed'
    };
  }
};

// Process payment callback from Telr
export const processTelrCallback = (callbackData) => {
  try {
    const {
      cartid,
      status,
      amount,
      currency,
      ref,
      transaction
    } = callbackData;

    // Validate the callback data
    if (!cartid || !status || !ref) {
      throw new Error('Invalid callback data');
    }

    return {
      success: true,
      orderId: cartid,
      status: status,
      amount: parseFloat(amount),
      currency: currency,
      reference: ref,
      transactionId: transaction?.ref,
      isAuthorised: status === 'A',
      isDeclined: status === 'D',
      isCancelled: status === 'C',
      isHold: status === 'H'
    };
  } catch (error) {
    console.error('Telr callback processing error:', error);
    return {
      success: false,
      error: error.message || 'Callback processing failed'
    };
  }
};

// Refund Telr payment
export const refundTelrPayment = async (cartId, reference, amount = null) => {
  try {
    const telrRequest = {
      method: 'refund',
      store: process.env.NEXT_PUBLIC_TELR_STORE_ID,
      authkey: process.env.TELR_AUTH_KEY,
      order: {
        cartid: cartId,
        ref: reference
      }
    };

    // Add amount for partial refund
    if (amount) {
      telrRequest.order.amount = amount.toFixed(2);
    }

    const response = await axios.post(TELR_API_URL, telrRequest, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.order) {
      return {
        success: true,
        refundReference: response.data.order.ref,
        amount: response.data.order.amount,
        status: response.data.order.status
      };
    } else {
      throw new Error('Invalid response from Telr');
    }
  } catch (error) {
    console.error('Telr refund error:', error);
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message || 'Refund failed'
    };
  }
};

// Get payment status text
export const getPaymentStatusText = (status) => {
  switch (status) {
    case 'A':
      return 'Authorised';
    case 'H':
      return 'On Hold';
    case 'D':
      return 'Declined';
    case 'C':
      return 'Cancelled';
    default:
      return 'Unknown';
  }
};

// Check if payment is successful
export const isPaymentSuccessful = (status) => {
  return status === 'A'; // Authorised
};

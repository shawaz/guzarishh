import { databases, DATABASE_ID, COLLECTIONS, ID, Query } from './appwrite';

// Product Management
export const createProduct = async (productData) => {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.PRODUCTS,
      ID.unique(),
      productData
    );
    return response;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const getProducts = async (limit = 50, offset = 0, categoryId = null) => {
  try {
    const queries = [Query.limit(limit), Query.offset(offset), Query.orderDesc('$createdAt')];

    if (categoryId) {
      queries.push(Query.equal('categoryId', categoryId));
    }

    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.PRODUCTS,
      queries
    );
    return response;
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return empty result instead of throwing error
    return { documents: [], total: 0 };
  }
};

export const getProduct = async (productId) => {
  try {
    const response = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.PRODUCTS,
      productId
    );
    return response;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const searchProducts = async (searchTerm) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.PRODUCTS,
      [
        Query.search('name', searchTerm),
        Query.limit(50)
      ]
    );
    return response;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

// Category Management
export const getCategories = async () => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.CATEGORIES,
      [Query.orderAsc('name')]
    );
    return response;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return empty result instead of throwing error
    return { documents: [], total: 0 };
  }
};

export const createCategory = async (categoryData) => {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.CATEGORIES,
      ID.unique(),
      categoryData
    );
    return response;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

// Cart Management
export const addToCart = async (userId, productId, quantity = 1, size = null, color = null) => {
  try {
    const cartData = {
      userId,
      productId,
      quantity,
      size,
      color
    };

    // Only add addedAt if the attribute exists
    try {
      cartData.addedAt = new Date().toISOString();
    } catch (e) {
      // Ignore if addedAt attribute doesn't exist
    }

    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.CART,
      ID.unique(),
      cartData
    );
    return response;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const getCartItems = async (userId) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.CART,
      [
        Query.equal('userId', userId),
        Query.orderDesc('addedAt')
      ]
    );
    return response;
  } catch (error) {
    console.error('Error fetching cart items:', error);
    throw error;
  }
};

export const updateCartItem = async (cartItemId, quantity) => {
  try {
    const response = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.CART,
      cartItemId,
      { quantity }
    );
    return response;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

export const removeFromCart = async (cartItemId) => {
  try {
    await databases.deleteDocument(
      DATABASE_ID,
      COLLECTIONS.CART,
      cartItemId
    );
    return true;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

// Order Management
export const createOrder = async (orderData) => {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.ORDERS,
      ID.unique(),
      {
        ...orderData,
        createdAt: new Date().toISOString(),
        status: 'pending'
      }
    );
    return response;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getUserOrders = async (userId) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.ORDERS,
      [
        Query.equal('userId', userId),
        Query.orderDesc('createdAt')
      ]
    );
    return response;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.ORDERS,
      orderId,
      { 
        status,
        updatedAt: new Date().toISOString()
      }
    );
    return response;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// User Profile Management
export const createUserProfile = async (userId, profileData) => {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.USERS,
      userId,
      {
        ...profileData,
        createdAt: new Date().toISOString()
      }
    );
    return response;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const response = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.USERS,
      userId
    );
    return response;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, profileData) => {
  try {
    const response = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.USERS,
      userId,
      {
        ...profileData,
        updatedAt: new Date().toISOString()
      }
    );
    return response;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Reviews Management
export const createReview = async (reviewData) => {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.REVIEWS,
      ID.unique(),
      {
        ...reviewData,
        createdAt: new Date().toISOString()
      }
    );
    return response;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

export const getProductReviews = async (productId) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.REVIEWS,
      [
        Query.equal('productId', productId),
        Query.orderDesc('createdAt')
      ]
    );
    return response;
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    throw error;
  }
};

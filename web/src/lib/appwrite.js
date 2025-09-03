import { Client, Account, Databases, Storage, Query, ID } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Database and Collection IDs
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
export const COLLECTIONS = {
  PRODUCTS: process.env.NEXT_PUBLIC_PRODUCTS_COLLECTION_ID,
  CATEGORIES: process.env.NEXT_PUBLIC_CATEGORIES_COLLECTION_ID,
  ORDERS: process.env.NEXT_PUBLIC_ORDERS_COLLECTION_ID,
  CART: process.env.NEXT_PUBLIC_CART_COLLECTION_ID,
  USERS: process.env.NEXT_PUBLIC_USERS_COLLECTION_ID,
  REVIEWS: process.env.NEXT_PUBLIC_REVIEWS_COLLECTION_ID,
};

export const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;

export { client, account, databases, storage, Query, ID };

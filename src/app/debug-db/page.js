"use client";

import { useEffect, useState } from 'react';
import { getProducts, getCategories } from '@/lib/database';
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';

export default function DebugDbPage() {
  const [results, setResults] = useState({
    categories: null,
    products: null,
    rawCategories: null,
    rawProducts: null,
    errors: []
  });
  const [loading, setLoading] = useState(false);

  const testDatabaseConnection = async () => {
    setLoading(true);
    const errors = [];
    const newResults = {};

    try {
      console.log('🔍 Testing database connection...');
      console.log('Database ID:', DATABASE_ID);
      console.log('Collections:', COLLECTIONS);

      // Test raw database connection
      try {
        console.log('📊 Testing raw categories query...');
        const rawCategoriesResponse = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.CATEGORIES
        );
        newResults.rawCategories = rawCategoriesResponse;
        console.log('✅ Raw categories response:', rawCategoriesResponse);
      } catch (error) {
        console.error('❌ Raw categories error:', error);
        errors.push(`Raw categories error: ${error.message}`);
      }

      // Test raw products query
      try {
        console.log('📊 Testing raw products query...');
        const rawProductsResponse = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.PRODUCTS
        );
        newResults.rawProducts = rawProductsResponse;
        console.log('✅ Raw products response:', rawProductsResponse);
      } catch (error) {
        console.error('❌ Raw products error:', error);
        errors.push(`Raw products error: ${error.message}`);
      }

      // Test helper functions
      try {
        console.log('🔧 Testing getCategories helper...');
        const categoriesResponse = await getCategories();
        newResults.categories = categoriesResponse;
        console.log('✅ Categories helper response:', categoriesResponse);
      } catch (error) {
        console.error('❌ Categories helper error:', error);
        errors.push(`Categories helper error: ${error.message}`);
      }

      try {
        console.log('🔧 Testing getProducts helper...');
        const productsResponse = await getProducts(10);
        newResults.products = productsResponse;
        console.log('✅ Products helper response:', productsResponse);
      } catch (error) {
        console.error('❌ Products helper error:', error);
        errors.push(`Products helper error: ${error.message}`);
      }

    } catch (error) {
      console.error('❌ General error:', error);
      errors.push(`General error: ${error.message}`);
    }

    setResults({ ...newResults, errors });
    setLoading(false);
  };

  useEffect(() => {
    testDatabaseConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Database Debug Page</h1>
        
        <div className="mb-6">
          <button 
            onClick={testDatabaseConnection}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Database Connection'}
          </button>
        </div>

        {/* Configuration Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Database ID:</strong> {DATABASE_ID}
            </div>
            <div>
              <strong>Products Collection:</strong> {COLLECTIONS.PRODUCTS}
            </div>
            <div>
              <strong>Categories Collection:</strong> {COLLECTIONS.CATEGORIES}
            </div>
            <div>
              <strong>Endpoint:</strong> {process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}
            </div>
          </div>
        </div>

        {/* Errors */}
        {results.errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-red-800 mb-4">Errors</h2>
            <ul className="space-y-2">
              {results.errors.map((error, index) => (
                <li key={index} className="text-red-700 text-sm">
                  • {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Categories */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Categories</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700">Helper Function Result:</h3>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(results.categories, null, 2)}
                </pre>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Raw Query Result:</h3>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(results.rawCategories, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibent mb-4">Products</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700">Helper Function Result:</h3>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(results.products, null, 2)}
                </pre>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Raw Query Result:</h3>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(results.rawProducts, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Categories Found:</strong> {results.categories?.documents?.length || 0}
            </div>
            <div>
              <strong>Products Found:</strong> {results.products?.documents?.length || 0}
            </div>
            <div>
              <strong>Raw Categories:</strong> {results.rawCategories?.documents?.length || 0}
            </div>
            <div>
              <strong>Raw Products:</strong> {results.rawProducts?.documents?.length || 0}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <a 
            href="/" 
            className="text-rose-600 hover:text-rose-700"
          >
            ← Back to Homepage
          </a>
        </div>
      </div>
    </div>
  );
}

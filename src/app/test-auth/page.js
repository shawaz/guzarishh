"use client";

import { account } from '@/lib/appwrite';
import { useEffect, useState } from 'react';

export default function TestAuthPage() {
  const [methods, setMethods] = useState([]);

  useEffect(() => {
    // Log all available methods on the account object
    console.log('Account object:', account);
    console.log('Account methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(account)));
    
    const accountMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(account))
      .filter(method => typeof account[method] === 'function')
      .sort();
    
    setMethods(accountMethods);
  }, []);

  const testMethods = async () => {
    try {
      // Test different possible method names
      const possibleMethods = [
        'createEmailSession',
        'createEmailPasswordSession', 
        'createSession',
        'createEmailAndPasswordSession',
        'login'
      ];

      for (const methodName of possibleMethods) {
        if (typeof account[methodName] === 'function') {
          console.log(`✅ Method exists: ${methodName}`);
        } else {
          console.log(`❌ Method not found: ${methodName}`);
        }
      }
    } catch (error) {
      console.error('Error testing methods:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Appwrite Account Methods Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Available Account Methods</h2>
          <button 
            onClick={testMethods}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mb-4"
          >
            Test Methods (Check Console)
          </button>
          
          <div className="grid grid-cols-3 gap-2 text-sm">
            {methods.map(method => (
              <div key={method} className="p-2 bg-gray-100 rounded">
                {method}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Manual Test</h2>
          <p className="text-gray-600 mb-4">
            Open browser console and click the button above to see which authentication methods are available.
          </p>
          
          <div className="space-y-2 text-sm">
            <p><strong>Appwrite Version:</strong> 13.0.2</p>
            <p><strong>Server Version:</strong> 1.7.4</p>
            <p><strong>Expected Methods:</strong> createEmailSession, createSession, or similar</p>
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

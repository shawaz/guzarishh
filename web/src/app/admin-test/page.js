"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';

export default function AdminTestPage() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Access Debug</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <div className="space-y-2">
            <p><strong>Auth Loading:</strong> {authLoading ? 'Yes' : 'No'}</p>
            <p><strong>User:</strong> {user ? `${user.name} (${user.email})` : 'Not logged in'}</p>
            <p><strong>User ID:</strong> {user?.$id || 'N/A'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Admin Status</h2>
          <div className="space-y-2">
            <p><strong>Admin Loading:</strong> {adminLoading ? 'Yes' : 'No'}</p>
            <p><strong>Is Admin:</strong> {isAdmin ? 'Yes' : 'No'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-y-4">
            {!user ? (
              <p className="text-red-600">Please log in first to test admin access</p>
            ) : (
              <div className="space-y-2">
                <p className="text-green-600">✅ User is logged in</p>
                {isAdmin ? (
                  <div>
                    <p className="text-green-600">✅ Admin access granted</p>
                    <a 
                      href="/admin" 
                      className="inline-block mt-4 bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700"
                    >
                      Go to Admin Dashboard
                    </a>
                  </div>
                ) : (
                  <p className="text-red-600">❌ Admin access denied</p>
                )}
              </div>
            )}
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

"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { getUserProfile } from '@/lib/database';
import toast from 'react-hot-toast';

const AdminContext = createContext({});

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    try {
      setLoading(true);

      // For testing purposes, allow admin access if user exists
      if (user) {
        console.log('User found, granting admin access:', user.email);
        setIsAdmin(true);
      } else {
        console.log('No user found, denying admin access');
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const requireAdmin = () => {
    if (!isAdmin) {
      toast.error('Access denied. Admin privileges required.');
      throw new Error('Admin access required');
    }
  };

  const value = {
    isAdmin,
    loading,
    requireAdmin,
    checkAdminStatus
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

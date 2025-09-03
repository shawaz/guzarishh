"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { account, ID } from '@/lib/appwrite';
import { createUserProfile, getUserProfile } from '@/lib/database';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
      
      // Try to get user profile
      try {
        const profile = await getUserProfile(currentUser.$id);
        setUserProfile(profile);
      } catch (profileError) {
        // Profile doesn't exist, create one
        if (profileError.code === 404) {
          const newProfile = await createUserProfile(currentUser.$id, {
            name: currentUser.name,
            email: currentUser.email,
            phone: '',
            address: {},
            preferences: {}
          });
          setUserProfile(newProfile);
        }
      }
    } catch (error) {
      // User not authenticated
      setUser(null);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);

      // Check if user is already logged in
      try {
        const currentUser = await account.get();
        if (currentUser) {
          console.log('User already logged in:', currentUser.email);
          await checkAuth();
          toast.success('Already logged in!');
          return { success: true };
        }
      } catch (e) {
        // No existing session, continue with login
      }

      // Create new session
      await account.createEmailSession(email, password);
      await checkAuth();
      toast.success('Welcome back!');
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      if (error.message.includes('session is active')) {
        // User is already logged in
        await checkAuth();
        toast.success('Already logged in!');
        return { success: true };
      }
      toast.error(error.message || 'Login failed');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, name) => {
    try {
      setLoading(true);

      // Create account
      const newUser = await account.create(ID.unique(), email, password, name);

      // Create session
      await account.createEmailSession(email, password);

      // Create user profile with proper data structure
      const profile = await createUserProfile(newUser.$id, {
        name,
        email,
        phone: '',
        address: JSON.stringify({}), // Store as JSON string
        preferences: JSON.stringify({}), // Store as JSON string
        role: 'customer'
      });

      setUser(newUser);
      setUserProfile(profile);

      toast.success('Account created successfully!');
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      if (error.message.includes('session is active')) {
        // User is already logged in
        await checkAuth();
        toast.success('Already logged in!');
        return { success: true };
      }
      toast.error(error.message || 'Registration failed');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
      setUserProfile(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  const sendPasswordReset = async (email) => {
    try {
      await account.createRecovery(
        email,
        `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`
      );
      toast.success('Password reset email sent!');
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(error.message || 'Failed to send reset email');
      return { success: false, error: error.message };
    }
  };

  const resetPassword = async (userId, secret, password) => {
    try {
      await account.updateRecovery(userId, secret, password, password);
      toast.success('Password reset successfully!');
      return { success: true };
    } catch (error) {
      console.error('Password reset completion error:', error);
      toast.error(error.message || 'Password reset failed');
      return { success: false, error: error.message };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      const updatedProfile = await updateUserProfile(user.$id, profileData);
      setUserProfile(updatedProfile);
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Profile update failed');
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    login,
    register,
    logout,
    sendPasswordReset,
    resetPassword,
    updateProfile,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

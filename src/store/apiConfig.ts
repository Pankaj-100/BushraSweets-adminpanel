// src/services/apiConfig.ts
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const BASE_URL = 'https://bushra-sweets-backend.onrender.com/api/v1';

// Token expiration check utility
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

// Handle unauthorized access
const handleUnauthorized = () => {
  // Clear stored auth data
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Redirect to login page
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

export const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      // Check if token is expired before using it
      if (isTokenExpired(token)) {
        handleUnauthorized();
        return headers; // Return headers without authorization
      }
      
      headers.set('authorization', `Bearer ${token}`);
    }
    
    return headers;
  },
});

// Enhanced base query with response interceptor for unauthorized errors
export const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);
  
  // Check for unauthorized error
  if (result.error && result.error.status === 401) {
    handleUnauthorized();
  }
  
  return result;
};
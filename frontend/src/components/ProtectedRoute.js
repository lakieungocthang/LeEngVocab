import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function ProtectedRoute({ children }) {
  const isAuthenticated = !!Cookies.get('authToken');

  return isAuthenticated ? children : <Navigate to="/" />;
}

export default ProtectedRoute;

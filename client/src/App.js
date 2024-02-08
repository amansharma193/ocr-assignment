import React, { useState, useEffect } from 'react';
import Login from './LoginForm.js';
import Signup from './SignUpForm.js';
import Dashboard from './Dashboard.js';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // Import for routing

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    // Check for stored token on app load
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login setToken={setToken} setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated} />} />
        <Route path="/login" element={<Login setToken={setToken} setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated} />} />
        <Route path="/signup" element={<Signup isAuthenticated={isAuthenticated} />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Dashboard token={token} setToken={setToken} setIsAuthenticated={setIsAuthenticated} />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

const PrivateRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    // Redirect to login or other desired behavior
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default App;
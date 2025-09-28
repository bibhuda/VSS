import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import SurveillanceSystem from '@/components/SurveillanceSystem';
import LoginPage from '@/pages/LoginPage';
import { AnimatePresence, motion } from 'framer-motion';
import emailjs from '@emailjs/browser';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loggedInUser = localStorage.getItem('isAuthenticated');
    if (loggedInUser === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
    
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (publicKey && publicKey !== 'YOUR_PUBLIC_KEY') {
      emailjs.init({ publicKey });
    } else {
      console.warn("EmailJS Public Key is not set. Please check your .env file.");
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-t-blue-500 border-r-blue-500 border-b-blue-500/20 border-l-blue-500/20 rounded-full"
        />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>AI Video Surveillance System</title>
        <meta name="description" content="Advanced AI-powered video surveillance system for real-time road accident detection and automated emergency notifications." />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route 
              path="/login" 
              element={
                !isAuthenticated ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/dashboard" />
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                isAuthenticated ? <SurveillanceSystem onLogout={handleLogout} /> : <Navigate to="/login" />
              } 
            />
            <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
          </Routes>
        </AnimatePresence>
        <Toaster />
      </div>
    </>
  );
}

export default App;
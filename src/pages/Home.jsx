import React, { useState, useEffect } from 'react';
import Hero from './Hero';
import Dashboard from './Dashboard';
import Footer from '../components/Footer';
import Loader from '../components/Loader'; 
const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200); 

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-8 text-center">
      <h2 className="text-3xl font-bold mb-4">Welcome to FinEase</h2>
      <p className="text-lg text-gray-700">
        Manage your income, expenses, and savings goals all in one place.
      </p>
      <Hero />
      <Dashboard />
      <Footer />
    </div>
  );
};

export default Home;

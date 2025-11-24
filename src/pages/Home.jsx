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
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="p-8 text-center">
        
        <Hero />
      </div>
      <Footer />
    </div>
  );
};

export default Home;

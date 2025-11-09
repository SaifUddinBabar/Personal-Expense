import React from 'react';
import Hero from './Hero';
import Footer from '../components/Footer';

const Home = () => {
    return (
        <div className="p-8 text-center">
      <h2 className="text-3xl font-bold mb-4">Welcome to FinEase</h2>
      <p className="text-lg text-gray-700">
        Manage your income, expenses, and savings goals all in one place.
      </p>
      <Hero></Hero>
      <Footer></Footer>
    </div>
    );
};

export default Home;
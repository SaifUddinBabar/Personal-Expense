import React from "react";
import { Link } from "react-router-dom";


const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-blue-50 to-blue-100 py-20 flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
        Manage Your <span className="text-blue-600">Expenses</span> Smartly
      </h1>
      <p className="text-gray-600 text-lg max-w-2xl mb-8">
        Track your income and expenses easily, visualize spending habits,
        and take control of your personal finance — all in one place.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
     <Link to='/register'><button   className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-all">
          Get Started
        </button></Link>   
        <button className="bg-white border border-blue-600 text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition-all">
          Sign In
        </button>
      </div>

      <img
        src="https://cdn-icons-png.flaticon.com/512/4922/4922073.png"
        alt="Expense illustration"
        className="w-64 mt-12 drop-shadow-lg animate-float"
      />
    </section>
  );
};

export default Hero;

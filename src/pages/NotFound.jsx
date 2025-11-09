import React from 'react';
import { Link } from 'react-router-dom';

const Notfound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-6">
      <h1 className="text-9xl font-extrabold text-red-500 animate-bounce">404</h1>
      <h2 className="text-3xl md:text-4xl font-bold mt-4 text-red-700 mb-2">
        Oops! Page Not Found
      </h2>
      <p className="text-red-600 text-lg md:text-xl mb-6 text-center max-w-md">
        Sorry, the page you are looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-lg hover:bg-red-600 transition-all transform hover:scale-105"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default Notfound;

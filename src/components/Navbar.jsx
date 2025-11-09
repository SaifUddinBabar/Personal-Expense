import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-500 p-4 text-white flex flex-wrap justify-between items-center">
      {/* Logo */}
      <Link to="/" className="font-bold text-xl md:text-2xl">
        FinEase
      </Link>

      {/* Links */}
      <div className="space-x-4 flex flex-wrap mt-2 md:mt-0">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <Link to="/add-transaction" className="hover:underline">
          Add Transaction
        </Link>
        <Link to="/my-transactions" className="hover:underline">
          My Transactions
        </Link>
        <Link to="/reports" className="hover:underline">
          Reports
        </Link>
        <Link to="/login" className="hover:underline">
          Login
        </Link>
        <Link to="/register" className="hover:underline">
          Register
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

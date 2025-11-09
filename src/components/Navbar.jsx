import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav className="bg-blue-500 p-4 text-white flex justify-between">
    <Link to="/" className="font-bold text-lg">FinEase</Link>
    <div className="space-x-4">
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </div>
  </nav>
);

export default Navbar;

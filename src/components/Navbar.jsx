import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../AuthContext";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed w-full z-50 top-0 left-0 bg-white/40 backdrop-blur-lg shadow-md border-b border-white/20"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
        >
          FinEase
        </Link>

        <div className="hidden md:flex gap-6 text-gray-700 font-medium">
          <Link to="/" className="hover:text-blue-600 transition">Home</Link>
          <Link to="/add-transaction" className="hover:text-blue-600 transition">Add</Link>
          <Link to="/my-transactions" className="hover:text-blue-600 transition">Transactions</Link>
          <Link to="/reports" className="hover:text-blue-600 transition">Reports</Link>
          <Link to="/my-profile" className="hover:text-blue-600 transition">Profile</Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 hover:text-blue-600 transition"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="User"
                    className="w-8 h-8 rounded-full border border-blue-300"
                  />
                ) : (
                  <FaUserCircle className="text-2xl text-gray-600" />
                )}
                <span className="hidden sm:block">{user.displayName || "User"}</span>
              </button>

              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden"
                >
                  <div className="px-4 py-2 text-sm text-gray-700">
                    <p>{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex gap-4">
              <Link
                to="/login"
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all"
              >
                Register
              </Link>
            </div>
          )}

          <button
            className="md:hidden text-2xl text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          className="md:hidden bg-white/80 backdrop-blur-lg shadow-md"
        >
          <div className="flex flex-col items-center py-4 gap-4 text-gray-700">
            <Link to="/" className="hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/add-transaction" className="hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Add</Link>
            <Link to="/my-transactions" className="hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Transactions</Link>
            <Link to="/reports" className="hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Reports</Link>
            <Link to="/my-profile" className="hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Profile</Link>

            {!user && (
              <>
                <Link to="/login" className="text-blue-600" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/register" className="text-blue-600" onClick={() => setIsMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;

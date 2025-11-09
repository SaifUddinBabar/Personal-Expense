import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth(); // ✅ useAuth inside component
  const navigate = useNavigate(); // ✅ navigate declare

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login"); // logout হলে login page এ redirect
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <nav className="bg-blue-500 p-4 text-white flex flex-wrap items-center justify-between">
      {/* Left Section: Logo */}
      <div className="flex-shrink-0">
        <Link to="/" className="font-bold text-xl md:text-2xl">
          FinEase
        </Link>
      </div>

      {/* Middle Section: Main Links */}
      <div className="flex flex-wrap justify-center gap-4 flex-1">
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
        <Link to="/my-profile" className="hover:underline">
          Profile
        </Link>
      </div>

      {/* Right Section: Auth Links */}
      <div className="flex flex-wrap gap-4 flex-shrink-0">
        {user ? (
          <button onClick={handleLogout} className="hover:underline">
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>

          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

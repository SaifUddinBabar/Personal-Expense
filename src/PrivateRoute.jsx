// PrivateRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation(); // যেখান থেকে user আসছে সেই path

  if (loading) return <p>Loading...</p>;

  if (!user) {
    // logged in না থাকলে login page এ redirect এবং state দিয়ে আগের path রাখবে
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default PrivateRoute;

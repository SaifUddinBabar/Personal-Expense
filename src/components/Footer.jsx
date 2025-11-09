import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white text-center py-4 border-t mt-auto">
      <p className="text-gray-500 text-sm">
        © {new Date().getFullYear()} ExpenseTracker — All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;

import React from "react";
import { FiFacebook, FiTwitter, FiLinkedin, FiInstagram } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 py-10 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 md:gap-0">
          
          <div className="flex flex-col items-center md:items-start">
            <h1 className="text-2xl font-bold text-white">FinEase</h1>
            <p className="text-gray-400 mt-2 text-center md:text-left">
              Simplifying your finances with ease.
            </p>
          </div>

          <div className="flex flex-col text-center md:text-left">
            <h2 className="font-semibold text-white mb-2">Quick Links</h2>
            <ul className="space-y-1 text-gray-400">
              <li className="hover:text-blue-400 cursor-pointer">Dashboard</li>
              <li className="hover:text-blue-400 cursor-pointer">Transactions</li>
              <li className="hover:text-blue-400 cursor-pointer">Analytics</li>
              <li className="hover:text-blue-400 cursor-pointer">Settings</li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h2 className="font-semibold text-white mb-2">Follow Us</h2>
            <div className="flex gap-4 mt-2 text-gray-400">
              <FiFacebook className="w-5 h-5 hover:text-blue-500 cursor-pointer" />
              <FiTwitter className="w-5 h-5 hover:text-blue-400 cursor-pointer" />
              <FiLinkedin className="w-5 h-5 hover:text-blue-600 cursor-pointer" />
              <FiInstagram className="w-5 h-5 hover:text-pink-500 cursor-pointer" />
            </div>
          </div>

        </div>

        <hr className="my-6 border-gray-700" />

        <p className="text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} FinEase. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

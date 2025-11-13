import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { FiTrendingUp, FiTrendingDown, FiDollarSign } from "react-icons/fi";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [totals, setTotals] = useState({ income: 0, expense: 0, balance: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/data")
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data);

        let income = 0;
        let expense = 0;

        data.forEach((t) => {
          if (t.type === "Income") income += Number(t.amount);
          if (t.type === "Expense") expense += Number(t.amount);
        });

        setTotals({
          income,
          expense,
          balance: income - expense,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loader />;

  const cardData = [
    { title: "Total Income", value: totals.income, icon: <FiTrendingUp />, gradient: "from-green-400 to-green-600", text: "text-green-600" },
    { title: "Total Expense", value: totals.expense, icon: <FiTrendingDown />, gradient: "from-red-400 to-red-600", text: "text-red-600" },
    { title: "Balance", value: totals.balance, icon: <FiDollarSign />, gradient: "from-blue-400 to-blue-600", text: "text-blue-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-10 pt-24">
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center p-12 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-3xl shadow-xl mb-12 border border-white/50 dark:border-gray-700"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
          Empower Your Finances, Simplify Your Future.
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Track smarter, save more, and achieve your financial freedom with FinEase.
        </p>
        <Link 
            to="/add-transaction"
            className="mt-6 inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all shadow-lg"
        >
            Start Tracking Now
        </Link>
      </motion.div>

      <h2 className="text-4xl font-bold text-gray-800 dark:text-white text-center mb-8">Financial Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {cardData.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * index, duration: 0.8 }}
            className={`relative overflow-hidden rounded-3xl p-6 bg-white/30 dark:bg-gray-700/30 backdrop-blur-lg border border-white/40 dark:border-gray-600 shadow-xl cursor-pointer transform hover:scale-105 transition-all`}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{card.title}</h2>
              <span className={`text-3xl ${card.text}`}>{card.icon}</span>
            </div>
            <p className="mt-6 text-4xl font-bold text-gray-900 dark:text-white">৳{card.value}</p>
          </motion.div>
        ))}
      </div>

    

      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Recent Transactions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transactions.slice(-6).reverse().map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx, duration: 0.6 }}
              className={`p-5 rounded-2xl shadow-lg bg-white/20 dark:bg-gray-700/20 backdrop-blur-lg border border-white/30 dark:border-gray-600 cursor-pointer hover:scale-[1.02] transition-all`}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-700 dark:text-gray-300 font-medium">{t.category}</span>
                <span className={`font-bold text-lg ${t.type === "Income" ? "text-green-600" : "text-red-600"}`}>
                  {t.type === "Income" ? "+" : "-"}৳{t.amount}
                </span>
              </div>
              <div className="flex justify-between items-center text-gray-500 dark:text-gray-400 text-sm">
                <span>{t.description || "N/A"}</span>
                <span>{new Date(t.date).toLocaleDateString()}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      
    </div>
  );
};

export default Dashboard;
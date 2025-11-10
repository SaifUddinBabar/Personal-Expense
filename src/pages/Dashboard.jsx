import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Loader from "../components/Loader";

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
    { title: "Total Income", value: totals.income, icon: "💰", gradient: "from-green-400 to-green-600" },
    { title: "Total Expense", value: totals.expense, icon: "💸", gradient: "from-red-400 to-red-600" },
    { title: "Balance", value: totals.balance, icon: "🏦", gradient: "from-blue-400 to-blue-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-100 p-10">
      <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-12">
        Financial Dashboard
      </h1>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {cardData.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * index, duration: 0.8 }}
            className={`relative overflow-hidden rounded-3xl p-6 bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg cursor-pointer transform hover:scale-105 transition-all`}
          >
            <div className={`absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-to-br ${card.gradient} opacity-20 blur-3xl animate-pulse`}></div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">{card.title}</h2>
              <span className="text-3xl">{card.icon}</span>
            </div>
            <p className="mt-6 text-4xl font-bold text-gray-900">${card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Transactions Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Recent Transactions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transactions.slice(-6).reverse().map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx, duration: 0.6 }}
              className={`p-5 rounded-2xl shadow-lg bg-white/20 backdrop-blur-lg border border-white/30 cursor-pointer hover:scale-105 transition-all`}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-700 font-medium">{t.category}</span>
                <span className={`font-bold text-lg ${t.type === "Income" ? "text-green-600" : "text-red-600"}`}>
                  {t.type === "Income" ? "+" : "-"}${t.amount}
                </span>
              </div>
              <div className="flex justify-between items-center text-gray-500 text-sm">
                <span>{t.type}</span>
                <span>{t.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 mt-20">
        &copy; 2025 FinEase. All rights reserved.
      </div>
    </div>
  );
};

export default Dashboard;

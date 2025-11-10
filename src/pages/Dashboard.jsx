import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Loader from "../components/Loader";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [totals, setTotals] = useState({ income: 0, expense: 0, balance: 0 });
  const [loading, setLoading] = useState(true); // ✅ loading state

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

        setTotals({ income, expense, balance: income - expense });
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false)); // ✅ stop loader
  }, []);

  const cards = [
    { title: "Total Income", value: totals.income, color: "green" },
    { title: "Total Expense", value: totals.expense, color: "red" },
    { title: "Balance", value: totals.balance, color: "blue" },
  ];

  if (loading) return <Loader />; // ✅ show loader while fetching

  return (
    <section className="py-16 px-6 bg-gray-50">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">
        Dashboard Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            className={`p-8 rounded-2xl shadow-lg backdrop-blur-md bg-white/30 border border-white/20 text-center`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.8 }}
          >
            <h3 className="text-xl font-semibold mb-3">{card.title}</h3>
            <p
              className={`text-3xl font-bold ${
                card.color === "green"
                  ? "text-green-700"
                  : card.color === "red"
                  ? "text-red-600"
                  : "text-blue-600"
              }`}
            >
              ${card.value}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Dashboard;

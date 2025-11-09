import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [totals, setTotals] = useState({ income: 0, expense: 0, balance: 0 });

  useEffect(() => {
    fetch("http://localhost:4000/data")
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data);

        // Calculate totals
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
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50 flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-100 p-6 rounded-xl shadow-md text-center">
          <h2 className="text-xl font-semibold mb-2">Total Income</h2>
          <p className="text-2xl font-bold text-green-700">${totals.income}</p>
        </div>

        <div className="bg-red-100 p-6 rounded-xl shadow-md text-center">
          <h2 className="text-xl font-semibold mb-2">Total Expense</h2>
          <p className="text-2xl font-bold text-red-700">${totals.expense}</p>
        </div>

        <div className="bg-blue-100 p-6 rounded-xl shadow-md text-center">
          <h2 className="text-xl font-semibold mb-2">Balance</h2>
          <p className="text-2xl font-bold text-blue-700">${totals.balance}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

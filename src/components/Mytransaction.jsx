import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";

const MyTransaction = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Fetch all transactions from backend
    fetch("http://localhost:4000/data")
      .then((res) => res.json())
      .then((data) => {
        // Filter transactions by logged-in user
        const userTransactions = data.filter(
          (t) => t.userEmail === user?.email
        );
        setTransactions(userTransactions);
      })
      .catch((err) => console.error(err));
  }, [user]);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">My Transactions</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {transactions.map((t) => (
          <div key={t._id} className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{t.category}</h2>
              <span
                className={`px-3 py-1 text-sm rounded-full font-medium ${
                  t.type === "Income"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {t.type}
              </span>
            </div>
            <p className="text-gray-500 text-sm">{new Date(t.date).toLocaleDateString()}</p>
            <p className={`text-2xl font-bold ${
              t.type === "Income" ? "text-green-600" : "text-red-600"
            }`}>
              ${Number(t.amount).toFixed(2)}
            </p>
            <p className="text-gray-700">{t.description}</p>

            <div className="flex gap-2 mt-2">
              <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                <span>👁️ View</span>
              </button>
              <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                <span>✏️ Edit</span>
              </button>
              <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                <span>🗑️ Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTransaction;

import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const AddTransaction = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    type: "",
    category: "",
    amount: "",
    description: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };
    if (name === "type" && value !== formData.type) {
      newFormData = { ...newFormData, category: "" };
    }
    setFormData(newFormData);
  };

  const getCategories = (type) => {
    const allCategories = {
      Income: ["Salary", "Investment", "Gift", "Rental Income", "Other Income"],
      Expense: ["Food", "Transport", "Shopping", "Rent", "Utilities", "Health", "Entertainment", "Other Expense"],
    };
    return allCategories[type] || ["Salary", "Food", "Transport", "Shopping", "Other"];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return Swal.fire("Error", "You must be logged in!", "error");
    if (Number(formData.amount) <= 0) return Swal.fire("Error", "Amount must be greater than 0!", "error");

    const transactionData = {
      ...formData,
      amount: Number(formData.amount),
      userName: user.displayName || "Anonymous",
      userEmail: user.email,
      userId: user.uid,
    };

    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      });
      await res.json();
      Swal.fire("Success", "Transaction added successfully!", "success");
      setFormData({ type: "", category: "", amount: "", description: "", date: "" });
      navigate("/my-transactions");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to add transaction", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md p-8 rounded-3xl backdrop-blur-xl bg-gray-800/70 shadow-2xl shadow-indigo-900/40 border border-gray-700/50 space-y-4"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-400 mb-6">Add Transaction 💰</h2>

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-xl border border-gray-700 bg-gray-700/50 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-gray-700 transition"
        >
          <option value="">Select Type</option>
          <option value="Income">Income 🟢</option>
          <option value="Expense">Expense 🔴</option>
        </select>

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          disabled={!formData.type}
          className="w-full p-3 rounded-xl border border-gray-700 bg-gray-700/50 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-gray-700 transition disabled:opacity-50"
        >
          <option value="">Select Category</option>
          {getCategories(formData.type).map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Amount"
          required
          className="w-full p-3 rounded-xl border border-gray-700 bg-gray-700/50 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-gray-700 transition"
        />
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-3 rounded-xl border border-gray-700 bg-gray-700/50 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-gray-700 transition"
        />
        <input
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-xl border border-gray-700 bg-gray-700/50 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-gray-700 transition"
        />

        <input
          type="text"
          value={user?.displayName || "Anonymous"}
          readOnly
          className="w-full p-3 rounded-xl border border-gray-700 bg-gray-700/50 text-gray-400 cursor-not-allowed transition"
        />
        <input
          type="email"
          value={user?.email}
          readOnly
          className="w-full p-3 rounded-xl border border-gray-700 bg-gray-700/50 text-gray-400 cursor-not-allowed transition"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-4 py-3 rounded-xl font-bold transition-all ${
            loading ? "bg-gray-600 cursor-not-allowed text-gray-400" : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
          } flex justify-center items-center gap-2`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              Adding...
            </>
          ) : (
            "Add Transaction"
          )}
        </button>
      </motion.form>
    </div>
  );
};

export default AddTransaction;

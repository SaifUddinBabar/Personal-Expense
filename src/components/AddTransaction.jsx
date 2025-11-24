import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const BASE_URL = "https://personal-expense-server-production.up.railway.app";

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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "type" ? { category: "" } : {}),
    }));
  };

  const getCategories = (type) => {
    const categories = {
      Income: ["Salary", "Investment", "Gift", "Rental Income", "Other Income"],
      Expense: [
        "Food",
        "Transport",
        "Shopping",
        "Rent",
        "Utilities",
        "Health",
        "Entertainment",
        "Other Expense",
      ],
    };
    return categories[type] || [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return Swal.fire("Error", "You must be logged in!", "error");
    if (!formData.type || !formData.category || !formData.date)
      return Swal.fire("Error", "Please fill all required fields!", "error");
    if (!formData.amount || Number(formData.amount) <= 0)
      return Swal.fire("Error", "Amount must be greater than 0!", "error");

    const transactionData = {
      ...formData,
      amount: Number(formData.amount),
      userName: user.displayName || "Anonymous",
      userEmail: user.email,
      userId: user.uid,
      createdAt: new Date(),
    };

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add transaction");

      Swal.fire({
        title: "Success!",
        text: "Transaction added successfully!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      setFormData({ type: "", category: "", amount: "", description: "", date: "" });
      navigate("/my-transactions");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
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
        <h2 className="text-3xl font-bold text-center text-indigo-400 mb-6">Add Transaction</h2>

        {/* Type */}
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-xl border border-gray-700 bg-gray-700/50 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">Select Type</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>

        {/* Category */}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          disabled={!formData.type}
          className="w-full p-3 rounded-xl border border-gray-700 bg-gray-700/50 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
        >
          <option value="">Select Category</option>
          {getCategories(formData.type).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Amount */}
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Amount"
          required
          min="0.01"
          step="0.01"
          className="w-full p-3 rounded-xl border border-gray-700 bg-gray-700/50 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        {/* Description */}
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description (optional)"
          className="w-full p-3 rounded-xl border border-gray-700 bg-gray-700/50 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        {/* Date */}
        <input
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-xl border border-gray-700 bg-gray-700/50 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        {/* User Info */}
        <input
          type="text"
          value={user?.displayName || "Anonymous"}
          readOnly
          className="w-full p-3 rounded-xl border border-gray-700 bg-gray-700/50 text-gray-400 cursor-not-allowed"
        />
        <input
          type="email"
          value={user?.email || ""}
          readOnly
          className="w-full p-3 rounded-xl border border-gray-700 bg-gray-700/50 text-gray-400 cursor-not-allowed"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-6 py-3 rounded-xl font-bold transition-all flex justify-center items-center gap-2 ${
            loading
              ? "bg-gray-600 cursor-not-allowed text-gray-400"
              : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
          }`}
        >
          {loading ? "Adding..." : "Add Transaction"}
        </button>
      </motion.form>
    </div>
  );
};

export default AddTransaction;

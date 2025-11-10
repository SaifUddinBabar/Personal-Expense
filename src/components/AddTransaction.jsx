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

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return Swal.fire("Error", "You must be logged in!", "error");
    if (Number(formData.amount) <= 0) return Swal.fire("Error", "Amount must be greater than 0!", "error");

    const transactionData = {
      ...formData,
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md p-8 rounded-3xl backdrop-blur-xl bg-white/30 shadow-2xl border border-white/30 space-y-4"
      >
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Add Transaction
        </h2>

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-xl border border-white/40 bg-white/20 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/30 transition"
        >
          <option value="">Select Type</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-xl border border-white/40 bg-white/20 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/30 transition"
        >
          <option value="">Select Category</option>
          <option value="Salary">Salary</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Shopping">Shopping</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Amount"
          required
          className="w-full p-3 rounded-xl border border-white/40 bg-white/20 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/30 transition"
        />
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-3 rounded-xl border border-white/40 bg-white/20 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/30 transition"
        />
        <input
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-xl border border-white/40 bg-white/20 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/30 transition"
        />
        <input
          type="text"
          value={user?.displayName || "Anonymous"}
          readOnly
          className="w-full p-3 rounded-xl border border-white/40 bg-white/20 text-gray-700 cursor-not-allowed transition"
        />
        <input
          type="email"
          value={user?.email}
          readOnly
          className="w-full p-3 rounded-xl border border-white/40 bg-white/20 text-gray-700 cursor-not-allowed transition"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-4 py-3 rounded-xl font-semibold transition-all ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
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
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
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

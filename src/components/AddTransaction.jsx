import React, { useState } from "react";
import { useAuth } from "../AuthContext";

const AddTransaction = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    type: "",
    category: "",
    amount: "",
    description: "",
    date: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in");

    const transactionData = {
      ...formData,
      userName: user.displayName || "Anonymous",
      userEmail: user.email,
      userId: user.uid,
    };

    try {
      const res = await fetch("http://localhost:4000/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      });

      const result = await res.json();
      console.log("Transaction added:", result);
      alert("Transaction added successfully!");

      // Clear form
      setFormData({
        type: "",
        category: "",
        amount: "",
        description: "",
        date: "",
      });
    } catch (err) {
      console.error("Error adding transaction:", err.message);
      alert("Failed to add transaction");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md space-y-4"
      >
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-4">
          Add Transaction
        </h2>

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="text"
          value={user?.displayName || "Anonymous"}
          readOnly
          className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
        />

        <input
          type="email"
          value={user?.email}
          readOnly
          className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
        />

        <button
          type="submit"
          className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all font-semibold"
        >
          Add Transaction
        </button>
      </form>
    </div>
  );
};

export default AddTransaction;

import React from "react";

const AddTransaction = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md space-y-4">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-4">
          Add Transaction
        </h2>

        {/* Type */}
        <select
          name="type"
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Type</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>

        {/* Category */}
        <select
          name="category"
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Category</option>
          <option value="Salary">Salary</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Shopping">Shopping</option>
          <option value="Other">Other</option>
        </select>

        {/* Amount */}
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Description */}
        <input
          type="text"
          name="description"
          placeholder="Description"
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Date */}
        <input
          type="datetime-local"
          name="date"
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* User Name (read-only) */}
        <input
          type="text"
          name="userName"
          value="John Doe"
          readOnly
          className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
        />

        {/* User Email (read-only) */}
        <input
          type="email"
          name="userEmail"
          value="john@example.com"
          readOnly
          className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
        />

        {/* Hidden User ID */}
        <input
          type="hidden"
          name="userId"
          value="615f1c2b4f1a256a2c3b4567"
        />

        {/* Add Transaction Button */}
        <button
          type="button"
          className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all font-semibold"
        >
          Add Transaction
        </button>
      </form>
    </div>
  );
};

export default AddTransaction;

import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiEdit, FiTrash2, FiX } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2"; // <-- added SweetAlert2
import "react-toastify/dist/ReactToastify.css";

const MyTransaction = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalTransaction, setModalTransaction] = useState(null);
  const [modalMode, setModalMode] = useState("view"); // "view" or "edit"

  useEffect(() => {
    if (!user?.email) return;
    fetch("http://localhost:4000/data")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((t) => t.userEmail === user.email);
        setTransactions(filtered);
        setLoading(false);
      });
  }, [user]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await fetch(`http://localhost:4000/data/${id}`, { method: "DELETE" });
        setTransactions(transactions.filter((t) => t._id !== id));
        Swal.fire('Deleted!', 'Transaction has been deleted.', 'success');
      } catch (err) {
        console.error(err);
        Swal.fire('Error!', 'Failed to delete transaction.', 'error');
      }
    }
  };

  const openModal = (transaction, mode) => {
    setModalTransaction(transaction);
    setModalMode(mode);
  };

  const closeModal = () => setModalTransaction(null);

  const handleEditChange = (e) => {
    setModalTransaction({ ...modalTransaction, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:4000/data/${modalTransaction._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(modalTransaction),
      });
      const data = await res.json();
      if (res.ok) {
        setTransactions(transactions.map((t) => (t._id === data.data._id ? data.data : t)));
        toast.success("Transaction updated!");
        closeModal();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update transaction");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <svg
          className="animate-spin h-12 w-12 text-blue-600"
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
          />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    );

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50/20 to-purple-50/20">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">My Transactions</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {transactions.length > 0 ? (
          transactions.map((t) => (
            <motion.div
              key={t._id}
              whileHover={{ scale: 1.03 }}
              className="backdrop-blur-md bg-white/40 border border-white/50 rounded-3xl p-6 shadow-lg flex flex-col justify-between transition-all hover:shadow-2xl"
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-900">{t.category}</h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    t.type === "Income"
                      ? "bg-green-200 text-green-900"
                      : "bg-red-200 text-red-900"
                  }`}
                >
                  {t.type}
                </span>
              </div>

              <p className="text-gray-800 mb-2">{t.description || "-"}</p>
              <p className="text-gray-600 text-sm mb-2">{new Date(t.date).toLocaleDateString()}</p>
              <p className="font-bold text-2xl text-gray-900 mb-4">{t.amount}৳</p>

              <div className="flex gap-2">
                <button
                  onClick={() => openModal(t, "view")}
                  className="flex-1 py-2 rounded-xl bg-white/30 border border-white/50 text-gray-900 font-semibold hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <FiEye /> View
                </button>
                <button
                  onClick={() => openModal(t, "edit")}
                  className="flex-1 py-2 rounded-xl bg-white/30 border border-white/50 text-gray-900 font-semibold hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <FiEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(t._id)}
                  className="flex-1 py-2 rounded-xl bg-white/30 border border-white/50 text-red-700 font-semibold hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-700 py-12">No transactions found</p>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalTransaction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white/90 backdrop-blur-md border border-white/50 rounded-3xl p-6 w-full max-w-md shadow-2xl relative"
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-900 hover:text-red-600"
              >
                <FiX size={24} />
              </button>

              {modalMode === "view" ? (
                <div className="flex flex-col gap-3 text-gray-900">
                  <h2 className="text-2xl font-bold">{modalTransaction.category}</h2>
                  <p>Type: {modalTransaction.type}</p>
                  <p>Amount: {modalTransaction.amount}৳</p>
                  <p>Date: {new Date(modalTransaction.date).toLocaleDateString()}</p>
                  <p>Description: {modalTransaction.description || "-"}</p>
                </div>
              ) : (
                <form className="flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                  <input
                    type="text"
                    name="category"
                    value={modalTransaction.category}
                    onChange={handleEditChange}
                    className="border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <select
                    name="type"
                    value={modalTransaction.type}
                    onChange={handleEditChange}
                    className="border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                  </select>
                  <input
                    type="number"
                    name="amount"
                    value={modalTransaction.amount}
                    onChange={handleEditChange}
                    className="border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <input
                    type="text"
                    name="description"
                    value={modalTransaction.description}
                    onChange={handleEditChange}
                    className="border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <input
                    type="date"
                    name="date"
                    value={new Date(modalTransaction.date).toISOString().split("T")[0]}
                    onChange={handleEditChange}
                    className="border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    type="submit"
                    className="mt-3 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
                  >
                    Update Transaction
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyTransaction;

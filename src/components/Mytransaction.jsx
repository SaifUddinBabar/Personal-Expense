import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiEdit, FiTrash2, FiX, FiArrowDown, FiArrowUp } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";

const CATEGORIES = {
  Income: ["Salary", "Investment", "Gift", "Rental Income", "Other Income"],
  Expense: ["Food", "Transport", "Shopping", "Rent", "Utilities", "Health", "Entertainment", "Other Expense"],
};

const MyTransaction = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalTransaction, setModalTransaction] = useState(null);
  const [modalMode, setModalMode] = useState("view");
  const [sortBy, setSortBy] = useState({ field: "date", direction: -1 });

  const fetchTransactions = () => {
    if (!user?.email) return;
    setLoading(true);
    fetch(`https://personal-expense-server.onrender.com/data?email=${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch transactions");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      let aValue, bValue;
      if (sortBy.field === "date") {
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
      } else if (sortBy.field === "amount") {
        aValue = Number(a.amount);
        bValue = Number(b.amount);
      } else {
        aValue = a[sortBy.field].toLowerCase();
        bValue = b[sortBy.field].toLowerCase();
      }
      if (aValue < bValue) return sortBy.direction * -1;
      if (aValue > bValue) return sortBy.direction * 1;
      return 0;
    });
  }, [transactions, sortBy]);

  const handleSortChange = (field) => {
    setSortBy((prev) => ({
      field,
      direction: prev.field === field ? prev.direction * -1 : -1,
    }));
  };

  const handleDelete = async (_id) => {
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
        const res = await fetch(`https://personal-expense-server.onrender.com/data/${_id}`, {
          method: "DELETE"
        });
        if (!res.ok) throw new Error("Server deletion failed");
        setTransactions((prev) => prev.filter((t) => t._id !== _id));
        Swal.fire('Deleted!', 'Transaction has been deleted.', 'success');
      } catch (err) {
        console.error(err);
        Swal.fire('Error!', 'Failed to delete transaction.', 'error');
      }
    }
  };

  const openModal = (transaction, mode) => {
    setModalTransaction({
      ...transaction,
      date: transaction.date ? new Date(transaction.date).toISOString().slice(0, 16) : ""
    });
    setModalMode(mode);
  };

  const closeModal = () => setModalTransaction(null);

  const handleEditChange = (e) => {
    setModalTransaction({ ...modalTransaction, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!modalTransaction) return;

    const amountNum = Number(modalTransaction.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Amount must be a positive number!");
      return;
    }

    const updatedTransaction = {
      ...modalTransaction,
      amount: amountNum,
      date: new Date(modalTransaction.date).toISOString(),
    };

    try {
      const res = await fetch(`https://personal-expense-server.onrender.com/transaction/update/${updatedTransaction._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTransaction),
      });

      if (!res.ok) throw new Error("Failed to update transaction");

      const result = await res.json();
      setTransactions((prev) =>
        prev.map((t) => (t._id === result.data._id ? result.data : t))
      );

      toast.success("Transaction updated!");
      closeModal();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update transaction");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
      </svg>
    </div>
  );

  return (
    <div className="min-h-screen p-6 pt-24 bg-gradient-to-br from-blue-50/20 to-purple-50/20 dark:from-gray-900/20 dark:to-gray-800/20">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">My Transactions</h1>
      <div className="flex justify-end mb-6">
        <div className="relative inline-block text-left">
          <button
            onClick={() => handleSortChange(sortBy.field === 'date' ? 'amount' : 'date')}
            className="inline-flex justify-center w-full rounded-md border border-gray-300 dark:border-gray-700 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
          >
            Sort By {sortBy.field.charAt(0).toUpperCase() + sortBy.field.slice(1)}
            {sortBy.direction === -1 ? <FiArrowDown className="ml-2 h-5 w-5" /> : <FiArrowUp className="ml-2 h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTransactions.length > 0 ? sortedTransactions.map((t) => (
          <motion.div key={t._id} whileHover={{ scale: 1.03 }} className="backdrop-blur-md bg-white/40 dark:bg-gray-700/40 border border-white/50 dark:border-gray-600 rounded-3xl p-6 shadow-lg flex flex-col justify-between transition-all hover:shadow-2xl">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t.category}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${t.type==="Income"?"bg-green-200 text-green-900":"bg-red-200 text-red-900"}`}>{t.type}</span>
            </div>
            <p className="text-gray-800 dark:text-gray-200 mb-2">{t.description || "No Description"}</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{new Date(t.date).toLocaleString()}</p>
            <p className="font-bold text-2xl text-gray-900 dark:text-white mb-4">৳{t.amount}</p>
            <div className="flex gap-2">
              <button onClick={() => openModal(t, "view")} className="flex-1 py-2 rounded-xl bg-blue-500/20 border border-blue-500/50 text-blue-700 dark:text-blue-300 font-semibold hover:scale-105 transition-all flex items-center justify-center gap-2"><FiEye/> View</button>
              <button onClick={() => openModal(t, "edit")} className="flex-1 py-2 rounded-xl bg-yellow-500/20 border border-yellow-500/50 text-yellow-700 dark:text-yellow-300 font-semibold hover:scale-105 transition-all flex items-center justify-center gap-2"><FiEdit/> Edit</button>
              <button onClick={() => handleDelete(t._id)} className="flex-1 py-2 rounded-xl bg-red-500/20 border border-red-500/50 text-red-700 dark:text-red-300 font-semibold hover:scale-105 transition-all flex items-center justify-center gap-2"><FiTrash2/> Delete</button>
            </div>
          </motion.div>
        )) : <p className="text-center col-span-full text-gray-700 dark:text-gray-400 py-12">No transactions found</p>}
      </div>

      <AnimatePresence>
        {modalTransaction && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div initial={{scale:0.8}} animate={{scale:1}} exit={{scale:0.8}} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-white/50 dark:border-gray-600 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
              <button onClick={closeModal} className="absolute top-4 right-4 text-gray-900 dark:text-white hover:text-red-600 transition"><FiX size={24}/></button>
              {modalMode==="view"?(
                <div className="flex flex-col gap-4 text-gray-900 dark:text-gray-200">
                  <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 text-center mb-3">Transaction Details</h2>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-semibold">Type:</span>
                    <span className={`font-medium ${modalTransaction.type==="Income"?"text-green-600":"text-red-600"}`}>{modalTransaction.type}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-semibold">Category:</span>
                    <span>{modalTransaction.category}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-semibold">Amount:</span>
                    <span className="font-bold text-xl">৳{modalTransaction.amount}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-semibold">Date:</span>
                    <span>{new Date(modalTransaction.date).toLocaleString()}</span>
                  </div>
                  <div className="border-b pb-2">
                    <span className="font-semibold">Description:</span>
                    <p className="mt-1 text-sm">{modalTransaction.description || "N/A"}</p>
                  </div>
                  <button onClick={()=>setModalMode('edit')} className="mt-4 py-2 rounded-xl bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition-all">Edit Transaction</button>
                </div>
              ):(
                <form className="flex flex-col gap-3" onSubmit={(e)=>{e.preventDefault(); handleUpdate();}}>
                  <h2 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 text-center mb-3">Edit Transaction</h2>
                  <select name="type" value={modalTransaction.type} onChange={handleEditChange} className="border border-gray-400 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                  </select>
                  <select name="category" value={modalTransaction.category} onChange={handleEditChange} className="border border-gray-400 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <option value="">Select Category</option>
                    {modalTransaction.type && CATEGORIES[modalTransaction.type]?.map((cat)=>(<option key={cat} value={cat}>{cat}</option>))}
                  </select>
                  <input type="number" name="amount" step="0.01" value={modalTransaction.amount} onChange={handleEditChange} placeholder="Amount" className="border border-gray-400 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                  <input type="text" name="description" value={modalTransaction.description} onChange={handleEditChange} placeholder="Description" className="border border-gray-400 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                  <input type="datetime-local" name="date" value={modalTransaction.date} onChange={handleEditChange} className="border border-gray-400 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                  <button type="submit" className="mt-3 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all">Update Transaction</button>
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

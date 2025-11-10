import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { toast } from "react-toastify";

const MyTransaction = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false); 

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
    if (!window.confirm("Delete this transaction?")) return;
    await fetch(`http://localhost:4000/data/${id}`, { method: "DELETE" });
    setTransactions(transactions.filter((t) => t._id !== id));
  

  };

  const handleView = (t) => {
    setSelectedTransaction(t);
    setShowModal(true);
    setEditMode(false);
  };

  const handleEdit = (t) => {
    setSelectedTransaction(t);
    setShowModal(true);
    setEditMode(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const id = selectedTransaction._id;

    const res = await fetch(`http://localhost:4000/data/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedTransaction),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Transaction updated!");
      setTransactions(
        transactions.map((t) => (t._id === id ? data.data : t))
      );
      setShowModal(false);
    } else {
      toast.success("Transaction added successfully!");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">My Transactions</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {transactions.map((t) => (
          <div key={t._id} className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between">
              <h2 className="font-semibold">{t.category}</h2>
              <span
                className={`px-2 py-1 rounded-full ${
                  t.type === "Income" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {t.type}
              </span>
            </div>
            <p>{t.description}</p>
            <p className="text-sm text-gray-500">{new Date(t.date).toLocaleDateString()}</p>
            <p className="font-bold">{t.amount}৳</p>

            <div className="flex gap-2 mt-3">
              <button onClick={() => handleView(t)} className="flex-1 bg-blue-100 rounded p-2">👁️ View</button>
              <button onClick={() => handleEdit(t)} className="flex-1 bg-yellow-100 rounded p-2">✏️ Edit</button>
              <button onClick={() => handleDelete(t._id)} className="flex-1 bg-red-100 rounded p-2">🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-96 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-2 right-3 text-xl">&times;</button>

            {editMode ? (
              <>
                <h2 className="text-2xl mb-4 text-blue-600 text-center">Edit Transaction</h2>
                <form onSubmit={handleUpdate} className="flex flex-col gap-3">
                  <input
                    className="border p-2 rounded"
                    value={selectedTransaction.type}
                    onChange={(e) =>
                      setSelectedTransaction({ ...selectedTransaction, type: e.target.value })
                    }
                    placeholder="Type (Income/Expense)"
                  />
                  <input
                    className="border p-2 rounded"
                    value={selectedTransaction.description}
                    onChange={(e) =>
                      setSelectedTransaction({ ...selectedTransaction, description: e.target.value })
                    }
                    placeholder="Description"
                  />
                  <input
                    className="border p-2 rounded"
                    value={selectedTransaction.category}
                    onChange={(e) =>
                      setSelectedTransaction({ ...selectedTransaction, category: e.target.value })
                    }
                    placeholder="Category"
                  />
                  <input
                    type="number"
                    className="border p-2 rounded"
                    value={selectedTransaction.amount}
                    onChange={(e) =>
                      setSelectedTransaction({ ...selectedTransaction, amount: e.target.value })
                    }
                    placeholder="Amount"
                  />
                  <input
                    type="date"
                    className="border p-2 rounded"
                    value={selectedTransaction.date?.split("T")[0]}
                    onChange={(e) =>
                      setSelectedTransaction({ ...selectedTransaction, date: e.target.value })
                    }
                  />

                  <button type="submit" className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                    Update
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-2xl mb-4 text-blue-600 text-center">Transaction Details</h2>
                <p><b>Type:</b> {selectedTransaction.type}</p>
                <p><b>Description:</b> {selectedTransaction.description}</p>
                <p><b>Category:</b> {selectedTransaction.category}</p>
                <p><b>Amount:</b> {selectedTransaction.amount}৳</p>
                <p><b>Date:</b> {new Date(selectedTransaction.date).toLocaleDateString()}</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTransaction;

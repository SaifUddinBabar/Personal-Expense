import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { useAuth } from "../AuthContext";

const API_URL = "https://personal-expense-server-production.up.railway.app/data";

const Mytransaction = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [viewData, setViewData] = useState(null);

  const fetchData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}?email=${encodeURIComponent(user.email)}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        data.sort(
          (a, b) =>
            new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
        );
      }

      setTransactions(data);
    } catch {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const deleteItem = async (id) => {
    const confirmBox = await Swal.fire({
      title: "Are you sure?",
      text: "You cannot undo this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      background: "#1f2937",
      color: "#e5e7eb",
    });

    if (!confirmBox.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTransactions((prev) => prev.filter((t) => t._id !== id));
        Swal.fire({
          title: "Deleted!",
          icon: "success",
          timer: 1200,
          background: "#1f2937",
          color: "#e5e7eb",
        });
      }
    } catch {
      Swal.fire("Error", "Delete failed!", "error");
    }
  };

  const openUpdateModal = (item) => {
    const dateValue = item.date || item.createdAt;
    const formatted = new Date(dateValue).toISOString().slice(0, 16);

    setEditData({ ...item, date: formatted });
    setShowUpdateModal(true);
  };

  const openViewModal = (item) => {
    setViewData(item);
    setShowViewModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const saveUpdate = async () => {
    const id = editData._id;
    const updated = {
      type: editData.type,
      category: editData.category,
      amount: Number(editData.amount),
      description: editData.description,
      date: new Date(editData.date).toISOString(),
    };

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (res.ok) {
        setShowUpdateModal(false);
        fetchData();
        Swal.fire("Success", "Updated successfully!", "success");
      }
    } catch {
      Swal.fire("Error", "Update failed!", "error");
    }
  };

  // ANIMATION VARIANTS
  const containerVariants = {
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
    hidden: { opacity: 0 },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  if (!user)
    return <h3 style={{ color: "white", textAlign: "center" }}>Login first</h3>;
  if (loading)
    return <h3 style={{ color: "white", textAlign: "center" }}>Loading...</h3>;
  if (transactions.length === 0)
    return <h3 style={{ color: "white", textAlign: "center" }}>No data found</h3>;

  return (
    <div style={{ background: "#111827", minHeight: "100vh", padding: "20px" }}>
      <h2
        style={{
          color: "#818cf8",
          textAlign: "center",
          marginBottom: "20px",
          fontSize: "2rem",
          fontWeight: "bold",
        }}
      >
        My Transactions ({transactions.length})
      </h2>

      <motion.div
        className="grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "16px",
        }}
      >
        <AnimatePresence>
          {transactions.map((t) => {
            const color = t.type === "Income" ? "#10b981" : "#ef4444";

            return (
              <motion.div
                key={t._id}
                variants={itemVariants}
                style={{
                  background: "#1f2937",
                  padding: "18px",
                  borderRadius: "14px",
                  borderLeft: `6px solid ${color}`,
                  color: "white",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}
              >
                <h3 style={{ color: "#818cf8" }}>
                  {t.type === "Income" ? "💰 Income" : "💸 Expense"}
                </h3>

                <h2 style={{ color: color }}>৳{t.amount}</h2>

                <p>Category: {t.category}</p>
                <p>Description: {t.description || "N/A"}</p>
                <p style={{ fontSize: "12px", opacity: 0.8 }}>
                  {new Date(t.date).toLocaleString()}
                </p>

                <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                  <button
                    onClick={() => openViewModal(t)}
                    style={btnStyle("#8e44ad")}
                  >
                    View
                  </button>
                  <button
                    onClick={() => openUpdateModal(t)}
                    style={btnStyle("#4f46e5")}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteItem(t._id)}
                    style={btnStyle("#ef4444")}
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {showViewModal && viewData && (
        <div style={modalBackdrop}>
          <div style={modalBox}>
            <h2 style={{ color: "#818cf8" }}>Transaction Details</h2>

            <p><b>Type:</b> {viewData.type}</p>
            <p><b>Amount:</b> ৳{viewData.amount}</p>
            <p><b>Category:</b> {viewData.category}</p>
            <p><b>Description:</b> {viewData.description}</p>
            <p><b>Date:</b> {new Date(viewData.date).toLocaleString()}</p>

            <button style={modalCloseBtn} onClick={() => setShowViewModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {showUpdateModal && editData && (
        <div style={modalBackdrop}>
          <div style={modalBox}>
            <h2 style={{ color: "#818cf8" }}>Edit Transaction</h2>

            <label>Type</label>
            <select
              name="type"
              value={editData.type}
              onChange={handleChange}
              style={modalInput}
            >
              <option>Income</option>
              <option>Expense</option>
            </select>

            <label>Amount</label>
            <input
              type="number"
              name="amount"
              value={editData.amount}
              onChange={handleChange}
              style={modalInput}
            />

            <label>Category</label>
            <input
              name="category"
              value={editData.category}
              onChange={handleChange}
              style={modalInput}
            />

            <label>Description</label>
            <textarea
              name="description"
              value={editData.description}
              onChange={handleChange}
              style={modalInput}
            />

            <label>Date</label>
            <input
              type="datetime-local"
              name="date"
              value={editData.date}
              onChange={handleChange}
              style={modalInput}
            />

            <button style={modalSaveBtn} onClick={saveUpdate}>
              Save
            </button>
            <button
              style={modalCloseBtn}
              onClick={() => setShowUpdateModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const btnStyle = (bg) => ({
  flex: 1,
  padding: "8px",
  borderRadius: "8px",
  border: "none",
  background: bg,
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
});

const modalBackdrop = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const modalBox = {
  background: "#1f2937",
  padding: "20px",
  width: "350px",
  borderRadius: "12px",
  color: "white",
};

const modalInput = {
  width: "100%",
  padding: "8px",
  margin: "5px 0 10px 0",
  borderRadius: "8px",
  background: "#374151",
  border: "1px solid #4b5563",
  color: "white",
};

const modalCloseBtn = {
  width: "100%",
  padding: "10px",
  background: "#ef4444",
  border: "none",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer",
  marginTop: "10px",
};

const modalSaveBtn = {
  width: "100%",
  padding: "10px",
  background: "#4f46e5",
  border: "none",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer",
  marginTop: "10px",
};

export default Mytransaction;

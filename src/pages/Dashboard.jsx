import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from "../AuthContext";

const API_URL = "https://personal-expense-server-production.up.railway.app/data";

const Dashboard = () => {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [totals, setTotals] = useState({ income: 0, expense: 0, balance: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) fetchData();
    }, [user]);

    const fetchData = async () => {
        try {
            setLoading(true);

            const res = await fetch(`${API_URL}?email=${encodeURIComponent(user.email)}`);
            const data = await res.json();

            if (Array.isArray(data)) {
                data.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
            }

            setTransactions(data);

            let income = 0, expense = 0;
            data.forEach(item => {
                const amt = Number(item.amount) || 0;
                if (item.type === "Income") income += amt;
                if (item.type === "Expense") expense += amt;
            });

            setTotals({
                income,
                expense,
                balance: income - expense
            });

        } catch {
            setError("Failed to fetch transactions");
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 120 } },
        hover: { scale: 1.05, y: -5 }
    };

    const mainBg = '#0f172a';
    const cardBg = '#1e293b';
    const textColor = '#f8fafc';
    const indigo = '#818cf8';
    const green = '#22c55e';
    const red = '#ef4444';

    if (!user) return <h2 style={{ color: textColor, textAlign: "center" }}>Please Login First</h2>;
    if (loading) return <h2 style={{ color: textColor, textAlign: "center" }}>Loading...</h2>;
    if (error) return <h2 style={{ color: "red", textAlign: "center" }}>{error}</h2>;

    return (
        <div style={{ background: mainBg, padding: '20px', minHeight: '100vh' }}>

            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: "center", fontSize: "3rem", marginBottom: "35px", color: indigo }}
            >
                Dashboard
            </motion.h1>

            <motion.div
                style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={cardVariants} whileHover="hover"
                    style={{
                        background: '#ECFDF5', color: green, padding: 20,
                        borderRadius: 15, width: 220, textAlign: "center",
                        fontWeight: 'bold', fontSize: '1.5rem'
                    }}
                >
                    Income<br />৳{totals.income}
                </motion.div>

                <motion.div variants={cardVariants} whileHover="hover"
                    style={{
                        background: '#FEF3F2', color: red, padding: 20,
                        borderRadius: 15, width: 220, textAlign: "center",
                        fontWeight: 'bold', fontSize: '1.5rem'
                    }}
                >
                    Expense<br />৳{totals.expense}
                </motion.div>

                <motion.div variants={cardVariants} whileHover="hover"
                    style={{
                        background: '#E0F2FE', color: '#1E40AF', padding: 20,
                        borderRadius: 15, width: 220, textAlign: "center",
                        fontWeight: 'bold', fontSize: '1.5rem'
                    }}
                >
                    Balance<br />৳{totals.balance}
                </motion.div>
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ color: textColor, marginTop: '40px', fontSize: "2rem" }}
            >
                Recent Transactions
            </motion.h2>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: '20px',
                    marginTop: '20px'
                }}
            >
                <AnimatePresence>
                    {transactions.slice(0, 5).map(t => {
                        const isIncome = t.type === "Income";
                        const color = isIncome ? green : red;
                        return (
                            <motion.div key={t._id}
                                variants={cardVariants}
                                whileHover="hover"
                                style={{
                                    background: cardBg,
                                    padding: 20,
                                    borderRadius: 15,
                                    borderTop: `4px solid ${color}`,
                                    color: textColor
                                }}
                            >
                                <h3>{isIncome ? "💰 Income" : "💸 Expense"}</h3>

                                <p style={{ fontSize: "1.6rem", color }}>
                                    {isIncome ? "+" : "-"}৳{t.amount}
                                </p>

                                <p>Category: {t.category}</p>
                                <p>Date: {new Date(t.date).toLocaleString()}</p>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </motion.div>

        </div>
    );
};

export default Dashboard;

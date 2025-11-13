import React, { useEffect, useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import Loader from "../components/Loader";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d", "#ffc658", "#FF00FF", "#00FFFF", "#FFA500"];

const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [monthFilter, setMonthFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/data")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((data) => {
        setTransactions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      const now = new Date();

      let matchesMonth = true;
      if (monthFilter !== "all") {
        const monthsAgo = parseInt(monthFilter);
        const cutoffDate = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
        matchesMonth = transactionDate >= cutoffDate;
      }

      const matchesCategory = categoryFilter === "all" || t.category === categoryFilter;
      return matchesMonth && matchesCategory;
    });
  }, [transactions, monthFilter, categoryFilter]);

  const expenseTransactions = filteredTransactions.filter(t => t.type === 'Expense');
  
  const expenseCategoryData = expenseTransactions.reduce((acc, t) => {
    const found = acc.find((i) => i.name === t.category);
    if (found) found.value += Number(t.amount);
    else acc.push({ name: t.category, value: Number(t.amount) });
    return acc;
  }, []);

  const monthlyData = filteredTransactions
    .reduce((acc, t) => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; 
      
      let found = acc.find((i) => i.monthKey === monthKey);
      if (!found) {
        found = {
          monthKey,
          month: date.toLocaleString('en-US', { month: 'short', year: 'numeric' }), 
          income: 0,
          expense: 0,
        };
        acc.push(found);
      }
      
      if (t.type === "Income") found.income += Number(t.amount);
      else found.expense += Number(t.amount);

      return acc;
    }, [])
    .sort((a, b) => a.monthKey.localeCompare(b.monthKey)); 

  // 3. Summary Totals
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = filteredTransactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  
  const categories = Array.from(new Set(transactions.map((t) => t.category)));

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen p-6 pt-24 bg-gradient-to-br from-blue-50/20 to-purple-50/20 dark:from-gray-900/20 dark:to-gray-800/20 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">Financial Reports 📊</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-10 p-4 rounded-xl bg-white/40 dark:bg-gray-700/40 shadow-inner">
        <select
          className="border border-white/50 dark:border-gray-600 bg-white/80 dark:bg-gray-800 p-3 rounded-xl w-full md:w-1/2 text-gray-800 dark:text-gray-200 focus:ring-blue-500"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
        >
          <option value="all">All Time</option>
          <option value="1">Last Month</option>
          <option value="3">Last 3 Months</option>
          <option value="6">Last 6 Months</option>
          <option value="12">Last Year</option>
        </select>

        <select
          className="border border-white/50 dark:border-gray-600 bg-white/80 dark:bg-gray-800 p-3 rounded-xl w-full md:w-1/2 text-gray-800 dark:text-gray-200 focus:ring-blue-500"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-10">
        <div className="backdrop-blur-md bg-white/30 dark:bg-gray-700/30 border border-white/50 dark:border-gray-600 p-6 rounded-3xl shadow-xl flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h2 className="text-gray-700 dark:text-gray-400 font-semibold">Total Income</h2>
            <TrendingUp className="h-6 w-6 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">৳{totalIncome.toFixed(2)}</p>
        </div>

        <div className="backdrop-blur-md bg-white/30 dark:bg-gray-700/30 border border-white/50 dark:border-gray-600 p-6 rounded-3xl shadow-xl flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h2 className="text-gray-700 dark:text-gray-400 font-semibold">Total Expense</h2>
            <TrendingDown className="h-6 w-6 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">৳{totalExpense.toFixed(2)}</p>
        </div>

        <div className="backdrop-blur-md bg-white/30 dark:bg-gray-700/30 border border-white/50 dark:border-gray-600 p-6 rounded-3xl shadow-xl flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h2 className="text-gray-700 dark:text-gray-400 font-semibold">Net Balance</h2>
            <DollarSign className="h-6 w-6 text-blue-500" />
          </div>
          <p className={`text-3xl font-bold ${totalIncome - totalExpense >= 0 ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"}`}>
            ৳{(totalIncome - totalExpense).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="backdrop-blur-md bg-white/40 dark:bg-gray-800/40 border border-white/50 dark:border-gray-600 p-6 rounded-3xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white text-center">Expense Breakdown by Category</h2>
          {expenseCategoryData.length > 0 ? (
            <div style={{ width: "100%", height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseCategoryData.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `৳${value.toFixed(2)}`} />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-12">No Expense data for the selected period.</p>
          )}
        </div>

        <div className="backdrop-blur-md bg-white/40 dark:bg-gray-800/40 border border-white/50 dark:border-gray-600 p-6 rounded-3xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white text-center">Monthly Income vs. Expense Trends</h2>
          {monthlyData.length > 0 ? (
            <div style={{ width: "100%", height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                  <XAxis dataKey="month" stroke={document.documentElement.classList.contains('dark') ? "#ccc" : "#333"} />
                  <YAxis stroke={document.documentElement.classList.contains('dark') ? "#ccc" : "#333"} formatter={(value) => `৳${value.toFixed(0)}`} />
                  <Tooltip 
                    formatter={(value) => `৳${value.toFixed(2)}`}
                    contentStyle={{ backgroundColor: document.documentElement.classList.contains('dark') ? "#1f2937" : "#fff", border: 'none', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Bar dataKey="income" fill="#10b981" name="Income" radius={[10, 10, 0, 0]} />
                  <Bar dataKey="expense" fill="#ef4444" name="Expense" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-12">No transaction data for the selected period.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
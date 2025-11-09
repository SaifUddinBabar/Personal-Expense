import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { TrendingUp, TrendingDown, Calendar } from "lucide-react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d", "#ffc658"];

const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [monthFilter, setMonthFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // ✅ Fetch data from backend
  useEffect(() => {
    fetch("http://localhost:4000/data")
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch((err) => console.error(err));
  }, []);

  // ✅ Filter logic
  const filteredTransactions = transactions.filter((t) => {
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

  // ✅ Category wise total
  const categoryData = filteredTransactions.reduce((acc, t) => {
    const found = acc.find((i) => i.name === t.category);
    if (found) found.value += Number(t.amount);
    else acc.push({ name: t.category, value: Number(t.amount) });
    return acc;
  }, []);

  // ✅ Monthly income vs expense
  const monthlyData = filteredTransactions.reduce((acc, t) => {
    const date = new Date(t.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const found = acc.find((i) => i.month === monthKey);
    if (found) {
      if (t.type === "Income") found.income += Number(t.amount);
      else found.expense += Number(t.amount);
    } else {
      acc.push({
        month: monthKey,
        income: t.type === "Income" ? Number(t.amount) : 0,
        expense: t.type === "Expense" ? Number(t.amount) : 0,
      });
    }
    return acc;
  }, []).sort((a, b) => a.month.localeCompare(b.month));

  // ✅ Totals
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = filteredTransactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const categories = Array.from(new Set(transactions.map((t) => t.category)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-white py-12 px-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Financial Reports</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <select
          className="border p-2 rounded-md w-full md:w-1/2"
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
          className="border p-2 rounded-md w-full md:w-1/2"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Summary */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center">
            <h2 className="text-gray-500">Total Income</h2>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600 mt-2">${totalIncome.toFixed(2)}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center">
            <h2 className="text-gray-500">Total Expense</h2>
            <TrendingDown className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-600 mt-2">${totalExpense.toFixed(2)}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center">
            <h2 className="text-gray-500">Net Balance</h2>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <p
            className={`text-2xl font-bold mt-2 ${
              totalIncome - totalExpense >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            ${(totalIncome - totalExpense).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Spending by Category</h2>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: $${entry.value.toFixed(0)}`}
                  outerRadius={100}
                  dataKey="value"
                >
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-12">No data available</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Monthly Trends</h2>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#10b981" name="Income" />
                <Bar dataKey="expense" fill="#ef4444" name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-12">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;

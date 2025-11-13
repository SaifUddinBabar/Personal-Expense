import React, { useState, useEffect } from "react";
import AppRouter from "./AppRouter";
import Navbar from "./components/Navbar";

function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 transition-colors">
      <Navbar theme={theme} setTheme={setTheme} />
      <div className="flex-1">
        <AppRouter />
      </div>
    </div>
  );
}

export default App;

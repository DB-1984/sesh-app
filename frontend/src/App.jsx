import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Toggle the `.dark` class on the <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Dark mode toggle button */}
      <div className="p-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 rounded border border-border bg-background text-foreground hover:bg-card hover:text-card-foreground transition-colors duration-200"
        >
          {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>
      </div>

      {/* Main content */}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}

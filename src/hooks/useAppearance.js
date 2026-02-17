import { useEffect, useState } from "react";

export function useAppearance() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  const [autoTheme, setAutoTheme] = useState(() => {
    const saved = localStorage.getItem("autoTheme");
    return saved ? JSON.parse(saved) : false;
  });

  const [themeColor, setThemeColor] = useState(() => {
    return localStorage.getItem("themeColor") || "#00d5be";
  });

  const [showWidgets, setShowWidgets] = useState(() => {
    const saved = localStorage.getItem("showWidgets");
    return saved ? JSON.parse(saved) : true;
  });

  // Apply Dark Mode Class
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Apply Theme Color
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--main", themeColor);
    localStorage.setItem("themeColor", themeColor);
  }, [themeColor]);

  // Persist Auto Theme & Widgets
  useEffect(() => {
    localStorage.setItem("autoTheme", JSON.stringify(autoTheme));
    localStorage.setItem("showWidgets", JSON.stringify(showWidgets));
  }, [autoTheme, showWidgets]);

  // Auto Theme Logic (12 PM - 12 AM = Dark)
  useEffect(() => {
    if (!autoTheme) return;

    const checkTime = () => {
      const now = new Date();
      const hour = now.getHours();
      // 12 PM (12) to 12 AM (0/24) -> Dark Mode
      // Using 24-hour format: 12:00 to 23:59 is >= 12.
      // So if hour >= 12, it's PM (until midnight).
      // Wait, user said "after 12am it switches back to light mode".
      // So 00:00 to 11:59 is Light. 12:00 to 23:59 is Dark.
      const shouldBeDark = hour >= 12;
      
      setDarkMode(shouldBeDark);
    };

    checkTime(); // Check immediately
    const interval = setInterval(checkTime, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [autoTheme]);

  return {
    darkMode,
    setDarkMode,
    autoTheme,
    setAutoTheme,
    themeColor,
    setThemeColor,
    showWidgets,
    setShowWidgets,
  };
}

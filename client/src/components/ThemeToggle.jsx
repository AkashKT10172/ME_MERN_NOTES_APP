import React from "react";
import { Button } from "react-bootstrap";
import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext"; // Import the custom hook

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme(); // Access current theme and toggle function

  return (
    <Button variant="outline-secondary" onClick={toggleTheme} className="d-flex align-items-center">
      {theme === "light" ? <FaMoon /> : <FaSun />}
    </Button>
  );
};

export default ThemeToggle;

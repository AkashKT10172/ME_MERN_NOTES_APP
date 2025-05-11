import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Notes from "./pages/Notes";
import { useAuth } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext"; // <- import theme context
import { Container } from "react-bootstrap";
import AppNavbar from "./components/Navbar";

const App = () => {
  const { user } = useAuth();
  const { theme } = useTheme(); // <- get current theme

  return (
    <Router>
      <div className={theme === "dark" ? "bg-dark text-light min-vh-100" : "bg-light text-dark min-vh-100"}>
      <AppNavbar />
      <Container className="py-4">
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/notes" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/notes" />} />
          <Route path="/notes" element={user ? <Notes /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to={user ? "/notes" : "/login"} />} />
        </Routes>
      </Container>
      </div>
    </Router>
  );
};

export default App;

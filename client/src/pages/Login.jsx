import React, { useState } from "react";
import { Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Login = () => {
  const { login: loginUser } = useAuth();
  const navigate = useNavigate();
    const { theme } = useTheme(); // <- get current theme
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login(formData);
      loginUser(res.data); // save to context + localStorage
      navigate("/notes");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  const inputClass = theme === "dark" ? "bg-dark text-light border-secondary" : "";

  return (
    <Card className="mx-auto" style={{ maxWidth: "400px", minHeight: "screen" }}>
      <Card.Body>
        <h2 className="text-center mb-4">Log In</h2>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="loginEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className = {inputClass}
              placeholder="Enter your email"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="loginPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className = {inputClass}
              placeholder = "Enter your password"
            />
          </Form.Group>

          <Button type="submit" className="w-100" disabled={loading}>
            {loading ? <Spinner size="sm" animation="border" /> : "Log In"}
          </Button>
        </Form>

        <div className="text-center mt-3">
          Don't have an account? <Link to="/register">Sign up here</Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Login;

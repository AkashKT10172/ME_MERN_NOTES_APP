import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext"; // <- import theme context
import ThemeToggle from "./ThemeToggle";

const AppNavbar = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme(); // <- get current theme
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Determine Bootstrap theme values
  const bg = theme === "light" ? "light" : "dark";
  const variant = theme === "light" ? "light" : "dark";
  const textClass = theme === "light" ? "text-dark" : "text-light";

  return (
    <Navbar
      bg={bg}
      variant={variant}
      expand="lg"
      className={`mb-4 ${textClass}`}
      style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className={textClass}>
          Notes App
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-center gap-2">
            {user ? (
              <>
                <span className={`navbar-text ${textClass}`}>
                  Hi, {user.user.name}
                </span>
                <Button
                  variant={theme === "light" ? "outline-danger" : "danger"}
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className={textClass}>
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className={textClass}>
                  Register
                </Nav.Link>
              </>
            )}
            <ThemeToggle />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;

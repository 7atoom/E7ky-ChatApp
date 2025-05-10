import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { LogIn, LogOut, User } from "lucide-react";
import Notifications from "./chat/Notifications.jsx";

const NavBar = () => {
  const { user } = useContext(AuthContext);
  const { logout } = useContext(AuthContext);

  return (
    <Navbar bg='dark' expand='lg' style={{ height: "3.75rem" }}>
      <Container>
        <Navbar.Brand as={Link} to='/' className='fw-bold'>
          E7ky
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='me-auto'>
            {user && (
              <span className='text-warning d-flex align-items-center'>
                <User size={18} className='me-1' /> {user.name}
              </span>
            )}
          </Nav>
          <Notifications />
          <Nav>
            {!user ? (
              <>
                <Nav.Link
                  as={Link}
                  to='/login'
                  className='d-flex align-items-center'>
                  <LogIn size={18} className='me-1' /> Login
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to='/register'
                  className='btn btn-primary btn-sm ms-2 rounded-pill px-3'>
                  Register
                </Nav.Link>
              </>
            ) : (
              <Nav.Link
                onClick={logout}
                role='button'
                className='d-flex align-items-center'>
                <LogOut size={18} className='me-1' /> Logout
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;

import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

const NavBar = () => {
  const { user } = useContext(AuthContext);
  const { logout } = useContext(AuthContext);

  return (
    <Navbar bg='dark' className='mb-4' style={{ height: "3.75rem" }}>
      <Container>
        <h2>
          <Link to='/' className='link-light text-decoration-none'>
            E7ky
          </Link>
        </h2>
        <span className='text-warning'>
          {user ? `Logged in as ${user.name}` : "Not logged in"}
        </span>
        <Nav>
          <Stack direction='horizontal' gap={3}>
            {!user ? (
              <>
                <Link to='/login' className='link-light text-decoration-none'>
                  Login
                </Link>
                <Link
                  to='/register'
                  className='link-light text-decoration-none'>
                  Register
                </Link>
              </>
            ) : (
              <span
                role='button'
                className='link-light text-decoration-none'
                onClick={logout}>
                Logout
              </span>
            )}
          </Stack>
        </Nav>
      </Container>
    </Navbar>
  );
};
export default NavBar;

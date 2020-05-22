import React from 'react';
import { useGlobal } from 'reactn';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

const Header = ({ children }) => {
  const [user] = useGlobal('user');
  return (
    <Navbar
      bg="dark"
      variant="dark"
      className="justify-content-between"
    >
      <Navbar.Brand href="#/">
        {children}
      </Navbar.Brand>
      <Navbar.Collapse
        className="justify-content-end"
      >
        {
          user
            ? <Nav.Link as={Link} to="/logout">Logout</Nav.Link>
            : <Nav.Link as={Link} to="/register">Register</Nav.Link>
        }
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;

import React from 'react';
import { useGlobal } from 'reactn';
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
      {user && (
        <Navbar.Collapse
          className="justify-content-end"
        >
          <Nav.Link href="#/logout">Logout</Nav.Link>
        </Navbar.Collapse>
      )}
    </Navbar>
  );
};

export default Header;

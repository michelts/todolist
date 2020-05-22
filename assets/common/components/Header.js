import React from 'react'
import Navbar from 'react-bootstrap/Navbar';

const Header = ({ children }) => (
  <Navbar bg="dark" variant="dark">
    <Navbar.Brand href="#home">{children}</Navbar.Brand>
  </Navbar>
);


export default Header;

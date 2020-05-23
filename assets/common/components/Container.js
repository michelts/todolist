import React from 'react';
import BSContainer from 'react-bootstrap/Container';

const Container = ({ children }) => (
  <BSContainer className="p-3">
    {children}
  </BSContainer>
);


export default Container;

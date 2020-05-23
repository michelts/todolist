import React from 'react';
import BSAlert from 'react-bootstrap/Alert';

const Alert = ({ children }) => (
  <BSAlert variant="danger">
    {children}
  </BSAlert>
);


export default Alert;

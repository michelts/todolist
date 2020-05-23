import React from 'react';
import Form from 'react-bootstrap/Form';

const Sorter = () => (
  <Form.Control as="select" size="sm" custom>
    <option>Sort by date</option>
    <option>Sort by priority</option>
  </Form.Control>
);

export default Sorter;

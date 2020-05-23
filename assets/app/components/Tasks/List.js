import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

const TaskList = ({ children }) => (
  <ListGroup className="mb-3">
    {children}
  </ListGroup>
);

export default TaskList;

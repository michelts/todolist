import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';

const TaskItem = ({
  item: {
    description,
    due_date: dueDate,
  },
}) => (
  <ListGroup.Item>
    <div className="d-flex justify-content-between">
      <div className="w-10">
        <Form.Check type="checkbox" />
      </div>
      <div className="flex-grow-1 ml-3">
        <strong>{description}</strong>
        <br />
        <span className="text-muted">{dueDate}</span>
      </div>
      <div className="w-10 ml-3">
        <Form.Control as="select" size="sm" custom>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
        </Form.Control>
      </div>
    </div>
  </ListGroup.Item>
);

export default TaskItem;

import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const Tasks = () => (
  <>
    <div className="d-flex justify-content-start align-items-center">
      <div>
        <h1>Tasks</h1>
      </div>
      <div className="ml-3">
        <Form.Control as="select" size="sm" custom>
          <option>Sort by date</option>
          <option>Sort by priority</option>
        </Form.Control>
      </div>
    </div>
    <ListGroup className="mb-3">
      <ListGroup.Item>
        <div className="d-flex justify-content-between">
          <div className="w-10">
            <Form.Check type="checkbox" />
          </div>
          <div className="flex-grow-1 ml-3">
            <strong>Cras justo odio</strong>
            <br />
            <span className="text-muted">2010-11-21</span>
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
      <ListGroup.Item>
        <div className="d-flex justify-content-between">
          <div className="w-10">
            <Form.Check type="checkbox" />
          </div>
          <div className="flex-grow-1 ml-3">
            <strong>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem</strong>
            <br />
            <span className="text-muted">2010-11-21</span>
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
    </ListGroup>

    <Button>Add new</Button>
  </>
);

export default Tasks;

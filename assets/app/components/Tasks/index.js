import React from 'react';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Sorter from './Sorter';
import Item from './Item';

const Tasks = () => (
  <>
    <div className="d-flex justify-content-start align-items-center">
      <div>
        <h1>Tasks</h1>
      </div>
      <div className="ml-3">
        <Sorter />
      </div>
    </div>
    <ListGroup className="mb-3">
      <Item item={{ description: 'Cras justo odio', due_date: null }} />
      <Item item={{ description: 'Lorem Ipsum dolor sit amet', due_date: '2019-12-29' }} />
      <Item item={{ description: 'Cras justo odio', due_date: null }} />
      <Item item={{ description: 'Lorem Ipsum dolor sit amet', due_date: '2019-12-29' }} />
    </ListGroup>
    <Button>Add new</Button>
  </>
);

export default Tasks;

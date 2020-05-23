import React from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Loading from 'common/components/Loading';
import Sorter from './Sorter';
import Item from './Item';
import BlankItem from './BlankItem';

const Tasks = () => {
  const [tasks, setTasks] = React.useState(undefined);

  React.useEffect(() => {
    axios.get('/api/v1/tasks/')
      .then(({ data }) => setTasks(data));
  }, []);

  return (
    <>
      <div className="d-flex justify-content-start align-items-center">
        <div>
          <h1>Tasks</h1>
        </div>
        <div className="ml-3">
          <Sorter disabled={tasks === undefined} />
        </div>
      </div>
      <ListGroup className="mb-3">
        {tasks === undefined && <Loading />}
        {tasks !== undefined && tasks.length === 0 && (
          <BlankItem />
        )}
        {tasks !== undefined && tasks.map((item) => (
          <Item key={item.id} item={item} />
        ))}
      </ListGroup>
      <Button disabled={tasks === undefined}>Add new task</Button>
    </>
  );
};

export default Tasks;

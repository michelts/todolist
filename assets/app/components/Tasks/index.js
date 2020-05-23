import React from 'react';
import axios from 'axios';
import { OrderedMap } from 'immutable';
import ListGroup from 'react-bootstrap/ListGroup';
import Loading from 'common/components/Loading';
import Sorter from './Sorter';
import Item from './Item';
import BlankItem from './BlankItem';
import Create from './Create';

const Tasks = () => {
  const [tasks, setTasks] = React.useState(undefined);

  React.useEffect(() => {
    axios.get('/api/v1/tasks/')
      .then(({ data }) => setTasks(
        OrderedMap(data.map((item) => [item.id, item])),
      ));
  }, []);

  return (
    <>
      <div className="d-flex justify-content-start align-items-center">
        <div>
          <h1>Tasks</h1>
        </div>

        <div className="ml-3">
          <Sorter
            disabled={tasks === undefined}
          />
        </div>
      </div>

      <ListGroup className="mb-3">
        {tasks === undefined && <Loading />}

        {tasks !== undefined && tasks.size === 0 && (
          <BlankItem />
        )}

        {tasks !== undefined && tasks.size > 0 && tasks.valueSeq().map((item) => (
          <Item key={item.id} item={item} />
        ))}
      </ListGroup>

      <Create
        disabled={tasks === undefined}
        setTasks={setTasks}
      >
        Add new task
      </Create>
    </>
  );
};

export default Tasks;

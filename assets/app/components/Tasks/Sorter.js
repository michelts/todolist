import React from 'react';
import axios from 'axios';
import { OrderedMap } from 'immutable';
import Form from 'react-bootstrap/Form';

const Sorter = ({ setTasks, disabled }) => {
  const inputRef = React.useRef();
  const [timeoutId, setTimeoutId] = React.useState(null);

  const handleChange = React.useCallback(() => {
    const { current: { value } } = inputRef;

    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    setTimeoutId(
      setTimeout(() => {
        setTasks(undefined);
        axios.get(`/api/v1/tasks/?sort=${value}`).then(({ data }) => {
          setTasks(
            OrderedMap(data.map((task) => [task.id, task])),
          );
        });
      }, 1000),
    );
  }, [inputRef, setTasks]);

  return (
    <Form.Control
      as="select"
      size="sm"
      custom
      ref={inputRef}
      disabled={disabled}
      onChange={handleChange}
    >
      <option value="due_date">Sort by date</option>
      <option value="priority">Sort by priority</option>
    </Form.Control>
  );
};

export default Sorter;

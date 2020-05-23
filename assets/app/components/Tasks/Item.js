import React from 'react';
import axios from 'axios';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import EditText from 'common/components/EditText';

const TaskItem = ({
  task: { id, ...task },
  setTasks,
}) => {
  const priorityRef = React.useRef();

  const handleSaveDescription = (value) => {
    const payload = { ...task, description: value };
    axios.put(`/api/v1/tasks/${id}/`, payload).then(({ data }) => {
      setTasks((state) => state.set(id, data));
    });
  };

  const handleSaveDueDate = (value) => {
    const payload = { ...task, due_date: value };
    axios.put(`/api/v1/tasks/${id}/`, payload).then(({ data }) => {
      setTasks((state) => state.set(id, data));
    });
  };

  const priorities = [0, 1, 2, 3, 4];

  const handlePriorityChange = () => {
    const { current: { value } } = priorityRef;
    const payload = { ...task, priority: parseInt(value, 10) };
    axios.put(`/api/v1/tasks/${id}/`, payload).then(({ data }) => {
      setTasks((state) => state.set(id, data));
    });
  };

  const handleSelectClick = () => {
    setTasks((state) => state.update(id, (obj) => ({ ...obj, selected: !obj.selected })));
  };

  return (
    <ListGroup.Item>
      <div className="d-flex justify-content-between">
        <div className="w-10">
          <Form.Check
            name="select"
            type="checkbox"
            checked={task.selected || false}
            onClick={handleSelectClick}
          />
        </div>
        <div className="flex-grow-1 ml-3">
          <EditText
            data-name="description"
            value={task.description || 'Fill with the task description'}
            onSave={handleSaveDescription}
          />
          <span className="text-muted">
            <EditText
              data-name="due-date"
              value={task.due_date || 'No date'}
              onSave={handleSaveDueDate}
            />
          </span>
        </div>
        <div className="w-10 ml-3">
          <Form.Control
            as="select"
            name="priority"
            size="sm"
            custom
            ref={priorityRef}
            onChange={handlePriorityChange}
          >
            {priorities.map((index) => (
              <option
                key={index}
                value={index}
                selected={index === task.priority}
              >
                {index}
              </option>
            ))}
          </Form.Control>
        </div>
      </div>
    </ListGroup.Item>
  );
};

export default TaskItem;

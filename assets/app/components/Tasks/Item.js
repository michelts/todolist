import React from 'react';
import axios from 'axios';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import EditText from 'common/components/EditText';

const TaskItem = ({
  task: {
    id,
    ...task
  },
  setTasks,
}) => {
  const priorityRef = React.useRef();

  const handleSaveDescription = React.useCallback((value) => {
    const payload = { ...task, description: value };
    axios.put(`/api/v1/tasks/${id}/`, payload).then(({ data }) => {
      setTasks((state) => state.set(id, data));
    });
  }, [id, setTasks]);

  const handleSaveDueDate = React.useCallback((value) => {
    const payload = { ...task, due_date: value };
    axios.put(`/api/v1/tasks/${id}/`, payload).then(({ data }) => {
      setTasks((state) => state.set(id, data));
    });
  }, [id, setTasks]);

  const priorities = [0, 1, 2, 3, 4];

  const handlePriorityChange = React.useCallback(() => {
    const { current: { value } } = priorityRef;
    const payload = { ...task, priority: parseInt(value, 10) };
    axios.put(`/api/v1/tasks/${id}/`, payload).then(({ data }) => {
      setTasks((state) => state.set(id, data));
    });
  }, [id, setTasks]);

  const handleCompleted = React.useCallback(() => {
    const payload = { ...task, is_completed: !task.is_completed };
    axios.put(`/api/v1/tasks/${id}/`, payload).then(({ data }) => {
      setTasks((state) => state.set(id, data));
    });
  }, [id, setTasks]);

  const handleArchive = React.useCallback(() => {
    axios.delete(`/api/v1/tasks/${id}/`).then(() => {
      setTasks((state) => state.delete(id));
    });
  }, [id, setTasks]);

  return (
    <ListGroup.Item>
      <div className="d-flex justify-content-between align-items-center">
        <div className="w-10 text-center">
          <div>Done?</div>
          <Form.Check
            name="is-completed"
            type="checkbox"
            checked={task.is_completed}
            onClick={handleCompleted}
          />
        </div>
        <div className="flex-grow-1 ml-4">
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
        <div className="w-10 ml-4 text-center">
          <div className="mb-1">Priority</div>
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
        <div className="w-10 ml-4">
          <Button
            name="archive"
            variant="danger"
            className="btn-sm"
            onClick={handleArchive}
          >
            Archive
          </Button>
        </div>
      </div>
    </ListGroup.Item>
  );
};

export default TaskItem;

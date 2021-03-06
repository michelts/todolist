import React from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';

const CreateButton = ({ setTasks, disabled }) => {
  const [creating, setCreating] = React.useState(false);

  const handleClick = React.useCallback(() => {
    setCreating(true);
    axios.post('/api/v1/tasks/', { description: '' }).then(({ data }) => {
      setTasks((state) => state.set(data.id, data));
      setCreating(false);
    });
  }, []);

  return (
    <Button
      disabled={disabled || creating}
      onClick={handleClick}
    >
      Add new task
    </Button>
  );
};

export default CreateButton;

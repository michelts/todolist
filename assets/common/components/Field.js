import React from 'react';
import Form from 'react-bootstrap/Form';

const Field = ({
  field: {
    name,
    value,
    onChange: handleChange,
    onBlur: handleBlur,
  },
  form: {
    touched,
    errors,
    isSubmitting,
  },
  control: ControlComponent,
  label,
  id = '',
  ...inputProps
}) => (
  <Form.Group controlId={id}>
    <Form.Label>{label}</Form.Label>
    <ControlComponent
      name={name}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      {...inputProps}
    />
  </Form.Group>
);

export default Field;

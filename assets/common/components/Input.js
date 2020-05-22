import React from 'react';
import Form from 'react-bootstrap/Form';
import Field from './Field';

const Input = (props) => <Field control={Form.Control} type="text" {...props} />;

export default Input;

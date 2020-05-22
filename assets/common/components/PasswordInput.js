import React from 'react';
import Form from 'react-bootstrap/Form';
import Field from './Field';

const PasswordInput = (props) => <Field control={Form.Control} type="password" {...props} />;

export default PasswordInput;

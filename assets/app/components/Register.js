import React from 'react';
import { useGlobal } from 'reactn';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import Alert from 'common/components/Alert';
import Input from 'common/components/Input';
import PasswordInput from 'common/components/PasswordInput';

export const RegisterSchema = Yup.object().shape({
  username: Yup.string().required(),
  username: Yup.string().required(),
  password: Yup.string().required(),
});

const Register = () => {
  const history = useHistory();
  const [saveFailed, setSaveFailed] = React.useState(false);
  const [, setUser] = useGlobal('user');

  const initialValues = {
    username: '',
    name: '',
    password: '',
  };

  const handleSubmit = (values) => {
    axios.post('/api/v1/users/', values)
      .then(({ data }) => {
        setUser(data);
        history.push('/tasks');
      })
      .catch(() => setSaveFailed(true));
  };

  return (
    <>
      <h1>Create an account</h1>

      {saveFailed && (
        <Alert>Registration failed! Check the filled data.</Alert>
      )}

      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit: formikSubmit }) => (
          <Form onSubmit={formikSubmit}>
            <Field component={Input} name="username" label="Username" />

            <Field component={Input} name="name" label="Username" />

            <Field component={PasswordInput} name="password" label="Password" />

            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Register;

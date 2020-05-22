import React from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';

export const LoginSchema = Yup.object().shape({
  username: Yup.string().email().required(),
  password: Yup.string().required(),
});

const Login = () => {
  const history = useHistory();

  React.useEffect(() => {
    axios.get('/api/v1/users/current/')
      .then((user) => history.push('/tasks'))
      .catch(() => {});
  }, []);

  const initialValues = {
    username: '',
    password: '',
  };
  const handleSubmit = (values) => {
    alert(JSON.stringify(values, null, 2));
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <Field type="text" name="username" label="Username" />
      <Field type="password" name="password" label="Password" />
      <button type="submit">Submit</button>
    </Formik>
  );
};

export default Login;

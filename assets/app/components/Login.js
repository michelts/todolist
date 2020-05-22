import React from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import Alert from 'common/components/Alert';

export const LoginSchema = Yup.object().shape({
  username: Yup.string().email().required(),
  password: Yup.string().required(),
});

const Login = () => {
  const history = useHistory();
  const [loginFailed, setLoginFailed] = React.useState(false);

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
    axios.post('/api/v1/users/login/', values)
      .then((user) => history.push('/tasks'))
      .catch(() => setLoginFailed(true));
  };

  return (
    <>
      {loginFailed && (
        <Alert>Login failed! Check your credentials!</Alert>
      )}

      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit: formikSubmit }) => (
          <form onSubmit={formikSubmit}>
            <Field type="text" name="username" label="Username" />

            <Field type="password" name="password" label="Password" />

            <button type="submit">Submit</button>
          </form>
        )}
      </Formik>
    </>
  );
};

export default Login;

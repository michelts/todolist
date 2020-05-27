import React from 'react';
import { useGlobal } from 'reactn';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Loading from 'common/components/Loading';
import Alert from 'common/components/Alert';
import Input from 'common/components/Input';
import PasswordInput from 'common/components/PasswordInput';

export const LoginSchema = Yup.object().shape({
  username: Yup.string().required(),
  password: Yup.string().required(),
});

const Login = () => {
  const history = useHistory();
  const [loginFailed, setLoginFailed] = React.useState(false);
  const [user, setUser] = useGlobal('user');

  React.useEffect(() => {
    axios.get('/api/v1/users/current/')
      .then(({ data }) => {
        setUser(data);
        history.push('/tasks');
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  const initialValues = {
    username: '',
    password: '',
  };

  const handleSubmit = React.useCallback((values) => {
    axios.post('/api/v1/users/login/', values)
      .then(({ data }) => {
        setUser(data);
        history.push('/tasks');
      })
      .catch(() => setLoginFailed(true));
  }, []);

  if (user === undefined) {
    return <Loading />;
  }

  return (
    <>
      <h1>Access your account</h1>

      {loginFailed && (
        <Alert>Login failed! Check your credentials!</Alert>
      )}

      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit: formikSubmit }) => (
          <Form onSubmit={formikSubmit}>
            <Field component={Input} name="username" label="Username" />

            <Field component={PasswordInput} name="password" label="Password" />

            <Button type="submit">Submit</Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Login;

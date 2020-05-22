import React from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Loading from 'common/components/Loading';

const Logout = () => {
  const { push } = useHistory();

  React.useEffect(() => {
    axios.get('/api/v1/users/logout/').then(() => push('/'));
  }, []);

  return (
    <Loading />
  );
}

export default Logout;

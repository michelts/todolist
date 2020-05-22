import React from 'react';
import { shallow } from 'enzyme';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Formik } from 'formik';
import { UserFactory } from '../../factories';
import Login from '../Login';

const getWrapper = () => {
  const history = {
    push: jest.fn(),
  };
  useHistory.mockReturnValue(history);
  const wrapper = shallow(<Login />);
  return { wrapper, history };
};

describe('Login component', () => {
  beforeEach(() => {
    jest.spyOn(React, 'useEffect').mockImplementation((effect) => effect());
  });

  it('should redirect to the task list if the user is already logged in, but only when mounted', async () => {
    axios.get.mockResolvedValue(UserFactory.build());
    const { history } = getWrapper();
    expect(axios.get).toHaveBeenCalledWith('/api/v1/users/current/');

    await axios.get;
    expect(history.push).toHaveBeenCalledWith('/tasks');

    // Enzyme doesn't allow to test effect update yet so, to ensure we are
    // acting only on mount, we test the signature passed to useEffect.
    expect(React.useEffect).toHaveBeenCalledWith(expect.anything(), []);
  });

  it('should render a login form if user is not authenticated', async () => {
    axios.get.mockRejectedValue({});
    const { wrapper, history } = getWrapper();
    expect(axios.get).toHaveBeenCalledWith('/api/v1/users/current/');

    await axios.get;
    expect(history.push).not.toHaveBeenCalled();
    expect(wrapper).toMatchSnapshot();
  });

  it('should authenticate the user and redirect him to the task list when form is submitted successfully', async () => {
    axios.get.mockRejectedValue({});
    axios.post.mockResolvedValue(UserFactory.build());
    const { wrapper, history } = getWrapper();

    await axios.get;
    const payload = { username: 'foo', password: 'bar' };
    wrapper.find(Formik).simulate('submit', payload);

    await axios.post;
    expect(axios.post).toHaveBeenCalledWith('/api/v1/users/login/', payload);
    expect(history.push).toHaveBeenCalledWith('/tasks');
  });

  it('should indicate authenticated failed if form submission is not successful', async (done) => {
    axios.get.mockRejectedValue({});
    axios.post.mockRejectedValue({});
    const { wrapper, history } = getWrapper();

    await axios.get;
    const payload = { username: 'foo', password: 'bar' };
    wrapper.find(Formik).simulate('submit', payload);
    expect(axios.post).toHaveBeenCalledWith('/api/v1/users/login/', payload);

    await axios.post;
    expect(history.push).not.toHaveBeenCalled();

    process.nextTick(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });
});

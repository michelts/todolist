import React from 'react';
import { useGlobal } from 'reactn';
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

const formikChild = (wrapper) => {
  const handleSubmit = jest.fn().mockName('formikSubmit');
  return wrapper.find(Formik).renderProp('children')({ handleSubmit });
};

describe('Login component', () => {
  let setUser;

  beforeEach(() => {
    setUser = jest.fn();
    jest.spyOn(React, 'useEffect').mockImplementation((effect) => effect());
  });

  it('should render a loading component while the current user checking is being processed', async () => {
    useGlobal.mockReturnValue([undefined, setUser]);
    axios.get.mockRejectedValue({});

    const { wrapper } = getWrapper();
    expect(wrapper).toMatchSnapshot();
  });

  it('should set global user and redirect to the task list if the user is already logged in, but only when mounted', async () => {
    useGlobal.mockReturnValue([undefined, setUser]);

    const user = UserFactory.build();
    axios.get.mockResolvedValue({ data: user });

    const { history } = getWrapper();
    expect(axios.get).toHaveBeenCalledWith('/api/v1/users/current/');

    await axios.get;
    expect(history.push).toHaveBeenCalledWith('/tasks');
    expect(setUser).toHaveBeenCalledWith(user);

    // Enzyme doesn't allow to test effect update yet so, to ensure we are
    // acting only on mount, we test the signature passed to useEffect.
    expect(React.useEffect).toHaveBeenCalledWith(expect.anything(), []);
  });

  it('should setUser to null if current user is not logged in, when mounted', async (done) => {
    useGlobal.mockReturnValue([undefined, setUser]);
    axios.get.mockRejectedValue({});

    const { history } = getWrapper();
    expect(axios.get).toHaveBeenCalledWith('/api/v1/users/current/');

    process.nextTick(() => {
      expect(history.push).not.toHaveBeenCalled();
      expect(setUser).toHaveBeenCalledWith(null);
      done();
    });
  });

  it('should render a login form if global user is null (e.g. not authenticated)', async () => {
    useGlobal.mockReturnValue([null, setUser]);
    axios.get.mockRejectedValue({});

    const { wrapper } = getWrapper();
    await axios.get;

    expect(wrapper).toMatchSnapshot('Formik');
    expect(formikChild(wrapper)).toMatchSnapshot('Formik children');
  });

  it('should authenticate the user and redirect him to the task list when form is submitted successfully', async () => {
    useGlobal.mockReturnValue([null, setUser]);
    axios.get.mockRejectedValue({});

    const loggedInUser = UserFactory.build();
    axios.post.mockResolvedValue({ data: loggedInUser });

    const { wrapper, history } = getWrapper();
    await axios.get;

    const payload = { username: 'foo', password: 'bar' };
    wrapper.find(Formik).simulate('submit', payload);
    expect(axios.post).toHaveBeenCalledWith('/api/v1/users/login/', payload);

    await axios.post;
    expect(history.push).toHaveBeenCalledWith('/tasks');
    expect(setUser).toHaveBeenCalledWith(loggedInUser);
  });

  it('should indicate authenticated failed if form submission is not successful', async (done) => {
    useGlobal.mockReturnValue([null, setUser]);
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
      expect(wrapper).toMatchSnapshot('Error msg and Formik');
      expect(formikChild(wrapper)).toMatchSnapshot('Formik children');
      done();
    });
  });
});

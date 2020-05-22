import React from 'react';
import { useGlobal } from 'reactn';
import { shallow } from 'enzyme';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Formik } from 'formik';
import { UserFactory } from '../../factories';
import Register from '../Register';

const getWrapper = () => {
  const history = {
    push: jest.fn(),
  };
  useHistory.mockReturnValue(history);
  const wrapper = shallow(<Register />);
  return { wrapper, history };
};

const formikChild = (wrapper) => {
  const handleSubmit = jest.fn().mockName('formikSubmit');
  return wrapper.find(Formik).renderProp('children')({ handleSubmit });
};

describe('Register component', () => {
  let setUser;

  beforeEach(() => {
    jest.spyOn(React, 'useEffect').mockImplementation((effect) => effect());
    setUser = jest.fn();
    useGlobal.mockReturnValue([undefined, setUser]);
  });

  it('should render a registration form', async () => {
    const { wrapper } = getWrapper();
    expect(wrapper).toMatchSnapshot('Formik');
    expect(formikChild(wrapper)).toMatchSnapshot('Formik children');
  });

  it('should create the user and redirect him to the task list when form is submitted successfully', async () => {
    const loggedInUser = UserFactory.build();
    axios.post.mockResolvedValue({ data: loggedInUser });

    const { wrapper, history } = getWrapper();
    const payload = { username: 'foo', password: 'bar', name: 'Foo Bar' };
    wrapper.find(Formik).simulate('submit', payload);
    expect(axios.post).toHaveBeenCalledWith('/api/v1/users/', payload);

    await axios.post;
    expect(history.push).toHaveBeenCalledWith('/tasks');
    expect(setUser).toHaveBeenCalledWith(loggedInUser);
  });

  it('should indicate creation failed if form submission is not successful', async (done) => {
    axios.post.mockRejectedValue({});

    const { wrapper, history } = getWrapper();
    const payload = { username: 'foo', password: 'bar', name: 'Foo Bar' };
    wrapper.find(Formik).simulate('submit', payload);
    expect(axios.post).toHaveBeenCalledWith('/api/v1/users/', payload);

    await axios.post;
    expect(history.push).not.toHaveBeenCalled();

    process.nextTick(() => {
      expect(wrapper).toMatchSnapshot('Error msg and Formik');
      expect(formikChild(wrapper)).toMatchSnapshot('Formik children');
      done();
    });
  });
});

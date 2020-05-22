import React from 'react';
import { shallow } from 'enzyme';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Logout from '../Logout';

const getWrapper = () => {
  const push = jest.fn();
  useHistory.mockReturnValue({ push });
  const wrapper = shallow(<Logout />);
  return { wrapper, history: { push } };
};

describe('Logout component', () => {
  beforeEach(() => {
    jest.spyOn(React, 'useEffect').mockImplementation((effect) => effect());
    axios.get.mockResolvedValue({});
  });

  it('should logout user on mount and redirect him to home', async () => {
    const { history } = getWrapper();
    await axios;
    expect(history.push).toHaveBeenCalledWith('/');

    // Ensure it was called twice (enzyme don't work well with useEffect)
    expect(React.useEffect).toHaveBeenCalledWith(expect.anything(), []);
  });

  it('should render a loading component while processing logout', () => {
    const { wrapper } = getWrapper();
    expect(wrapper).toMatchSnapshot();
  });
});
